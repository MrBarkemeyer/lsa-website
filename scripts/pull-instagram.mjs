/**
 * Pull new Instagram posts into src/config/instagramPosts.config.js
 * and public/instagram/<id>/.
 *
 *   npm run instagram
 *   npm run instagram @lsaboard2030
 *
 * With no username, this pulls @lowellhs. Extra usernames are added
 * to the same events list. Instagram's public page is rendered in the
 * browser, so this opens headless Chrome, reads each profile, and
 * downloads any posts that are not already saved. Newest first.
 */
import { spawn } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "src/config/instagramPosts.config.js");
const imageRoot = path.join(root, "public/instagram");
const DEFAULT_HANDLE = "lowellhs";

const MONTHS = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function handlesFromArgs(argv = process.argv.slice(2)) {
  const handles = [];
  for (const arg of argv) {
    if (!arg || arg === "--") continue;
    const handle = arg.replace(/^@/, "").trim().replace(/\/+$/, "");
    if (!/^[A-Za-z0-9._]{1,30}$/.test(handle)) {
      throw new Error(`Not an Instagram username: ${arg}`);
    }
    if (!handles.includes(handle)) handles.push(handle);
  }
  return handles.length ? handles : [DEFAULT_HANDLE];
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) || null;
}

function extractJsonObject(source, start) {
  if (source[start] !== "{") return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  return null;
}

function dateFromAccessibility(text) {
  const match = String(text || "").match(/\bon ([A-Za-z]+) (\d{1,2}), (\d{4})/);
  const month = match && MONTHS[match[1]];
  if (!month) return null;
  return `${month} ${Number(match[2])}, ${match[3]}`;
}

function dateFromPk(pk) {
  const ms = Number((BigInt(pk) >> 23n) + 1314220021721n);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).formatToParts(new Date(ms));
  const value = (type) => parts.find((part) => part.type === type)?.value;
  return `${value("month")} ${value("day")}, ${value("year")}`;
}

function postsOnProfile(posts, html, handle) {
  const codes = new Set();
  const pattern = new RegExp(`/${handle}/(?:p|reel)/([A-Za-z0-9_-]+)/`, "g");
  for (const match of html.matchAll(pattern)) codes.add(match[1]);
  if (!codes.size) return posts;
  const onProfile = posts.filter((post) => codes.has(post.id));
  return onProfile.length ? onProfile : posts;
}

function parseTimeline(html) {
  const posts = [];
  const seen = new Set();
  const marker = '"__typename":"XIGPolaris';
  let from = 0;
  while (from < html.length) {
    const at = html.indexOf(marker, from);
    if (at < 0) break;
    const start = html.lastIndexOf("{", at);
    from = at + marker.length;
    const raw = start >= 0 ? extractJsonObject(html, start) : null;
    if (!raw) continue;
    let node;
    try {
      node = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!node?.code || !node?.pk || seen.has(node.code)) continue;
    if (!node.caption && !node.accessibility_caption) continue;
    seen.add(node.code);
    const kind = String(node.__typename || "").includes("Video") ? "video" : "photo";
    posts.push({
      id: node.code,
      pk: node.pk,
      kind,
      date: dateFromAccessibility(node.accessibility_caption) || dateFromPk(node.pk),
      caption: node.caption?.text || "",
      displayUri: node.display_uri || "",
      slideCount: Number(node.carousel_media_count) || (kind === "photo" ? 1 : 0),
    });
  }
  posts.sort((a, b) => (BigInt(a.pk) > BigInt(b.pk) ? -1 : 1));
  return posts;
}

function unescapeUrl(value) {
  return String(value)
    .replace(/\\u0026/g, "&")
    .replace(/\\u00253D/g, "%3D")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&");
}

function parseSlides(html) {
  const text = unescapeUrl(html);
  const pattern = /https:\/\/scontent[^"'\s]+?_n\.jpg\?[^"'\s]+/g;
  const chosen = new Map();
  const order = [];
  for (const match of text.matchAll(pattern)) {
    const url = match[0];
    const file = url.split("/").pop().split("?")[0];
    let score = 0;
    if (url.includes("dst-jpg_e35_tt6") && !url.includes("s640") && !url.includes("s150") && !url.includes("stp=c0")) {
      score = 100;
    } else if (url.includes("s640x640")) {
      score = 10;
    } else if (url.includes(".jpg")) {
      score = 1;
    }
    const previous = chosen.get(file);
    if (!previous) {
      order.push(file);
      chosen.set(file, { score, url });
    } else if (score > previous.score) {
      chosen.set(file, { score, url });
    }
  }
  const slides = order
    .map((file) => chosen.get(file))
    .filter((item) => item && item.score >= 10)
    .map((item) => item.url);
  const full = slides.filter((url) => url.includes("dst-jpg_e35_tt6") && !url.includes("s640"));
  return full.length ? full : slides;
}

function parseVideo(html) {
  const text = unescapeUrl(html);
  const match = text.match(/https:\/\/[^"'\s]+?\.mp4[^"'\s]*/);
  return match ? match[0] : null;
}

function slideName(index) {
  return index === 0 ? "cover.jpg" : `${index + 1}.jpg`;
}

class Browser {
  constructor(chromePath) {
    this.chromePath = chromePath;
    this.child = null;
    this.ws = null;
    this.userDataDir = "";
    this.nextId = 0;
    this.pending = new Map();
  }

  async start() {
    this.userDataDir = path.join(os.tmpdir(), `lsa-instagram-${process.pid}`);
    await fs.mkdir(this.userDataDir, { recursive: true });
    this.child = spawn(
      this.chromePath,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-extensions",
        "--remote-debugging-port=0",
        "--remote-allow-origins=*",
        `--user-data-dir=${this.userDataDir}`,
        "about:blank",
      ],
      { stdio: ["ignore", "ignore", "pipe"] },
    );
    const port = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Chrome did not start")), 20000);
      let buffer = "";
      const onExit = (code) => {
        clearTimeout(timer);
        reject(new Error(`Chrome exited (${code ?? "unknown"}) before DevTools was ready`));
      };
      this.child.on("exit", onExit);
      this.child.stderr.on("data", (chunk) => {
        buffer += chunk.toString();
        const match = buffer.match(/127\.0\.0\.1:(\d+)/);
        if (!match) return;
        clearTimeout(timer);
        this.child.off("exit", onExit);
        resolve(Number(match[1]));
      });
    });
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const page = targets.find((target) => target.type === "page" && target.webSocketDebuggerUrl);
    if (!page) throw new Error("Chrome did not open a page");
    this.ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message || "Chrome command failed"));
      else resolve(message.result);
    });
    await this.send("Page.enable");
    await this.send("Runtime.enable");
  }

  send(method, params = {}) {
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async html() {
    const result = await this.send("Runtime.evaluate", {
      expression: "document.documentElement.outerHTML",
      returnByValue: true,
    });
    return result?.result?.value || "";
  }

  async open(url) {
    await this.send("Page.navigate", { url });
    const deadline = Date.now() + 20000;
    while (Date.now() < deadline) {
      const html = await this.html();
      if (html.includes("XIGPolaris")) return html;
      await sleep(400);
    }
    return this.html();
  }

  async showMore() {
    const result = await this.send("Runtime.evaluate", {
      expression: `(() => {
        const button = [...document.querySelectorAll("button")].find((element) =>
          /show more posts/i.test(element.textContent || ""),
        );
        if (!button) return false;
        button.click();
        return true;
      })()`,
      returnByValue: true,
    });
    return Boolean(result?.result?.value);
  }

  async close() {
    try {
      this.ws?.close();
    } catch {
      // already closed
    }
    if (this.child && !this.child.killed) {
      this.child.kill("SIGKILL");
      await sleep(200);
    }
    if (this.userDataDir) {
      try {
        rmSync(this.userDataDir, { recursive: true, force: true });
      } catch {
        // Chrome may still be releasing the profile directory.
      }
    }
  }
}

async function download(url, destination) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: "https://www.instagram.com/",
    },
  });
  if (!response.ok) throw new Error(`Download failed (${response.status})`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (destination.endsWith(".jpg") && bytes[0] !== 0xff) {
    throw new Error("Downloaded file is not a JPEG");
  }
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, bytes);
}

async function loadProfile(browser, handle, knownIds, pageFurther) {
  await browser.open(`https://www.instagram.com/${handle}/`);
  let posts = parseTimeline(await browser.html());
  for (let attempt = 0; attempt < 8; attempt += 1) {
    if (!posts.length) {
      await sleep(500);
      posts = parseTimeline(await browser.html());
      continue;
    }
    // A first pull stays on the latest grid. Later pulls keep going until
    // they overlap a post that is already saved.
    if (!pageFurther || posts.some((post) => knownIds.has(post.id))) break;
    const clicked = await browser.showMore();
    if (!clicked) break;
    await sleep(1200);
    posts = parseTimeline(await browser.html());
  }
  const html = await browser.html();
  return postsOnProfile(parseTimeline(html), html, handle).map((post) => ({ ...post, handle }));
}

async function savePost(browser, post) {
  const pageUrl = `https://www.instagram.com/${post.handle}/${post.kind === "video" ? "reel" : "p"}/${post.id}/`;
  const html = await browser.open(pageUrl);
  let slides = parseSlides(html);
  if (!slides.length && post.displayUri) slides = [post.displayUri];
  if (!slides.length) throw new Error(`No images found for ${post.id}`);
  if (post.slideCount > 1 && slides.length < post.slideCount) {
    console.warn(`${post.id} expected ${post.slideCount} photos and saved ${slides.length}.`);
  }

  const folder = path.join(imageRoot, post.id);
  await fs.mkdir(folder, { recursive: true });
  for (let index = 0; index < slides.length; index += 1) {
    await download(slides[index], path.join(folder, slideName(index)));
  }

  const videoUrl = post.kind === "video" ? parseVideo(html) : null;
  let video = null;
  if (videoUrl) {
    await download(videoUrl, path.join(folder, "reel.mp4"));
    video = `/instagram/${post.id}/reel.mp4`;
  }

  const entry = {
    id: post.id,
    date: post.date,
    caption: post.caption,
    cover: `/instagram/${post.id}/cover.jpg`,
    slides: slides.map((_, index) => `/instagram/${post.id}/${slideName(index)}`),
    url: pageUrl,
  };
  if (post.handle && post.handle !== DEFAULT_HANDLE) entry.handle = post.handle;
  if (video) entry.video = video;
  return entry;
}

async function writeConfig(posts) {
  const source = await fs.readFile(configPath, "utf8");
  const marker = "const posts = ";
  const headerAt = source.indexOf(marker);
  if (headerAt < 0) throw new Error("Could not find the posts list in instagramPosts.config.js");
  const header = source.slice(0, headerAt);
  const body = `${header}${marker}${JSON.stringify(posts, null, 4)};\n\nexport default posts;\n`;
  await fs.writeFile(configPath, body);
}

async function main() {
  const handles = handlesFromArgs();
  if (process.env.INSTAGRAM_PRINT_HANDLES) {
    console.log(handles.join(" "));
    return;
  }
  const chromePath = findChrome();
  if (!chromePath) {
    throw new Error("Google Chrome was not found. Set CHROME_PATH to the Chrome executable.");
  }
  const existing = (await import(pathToFileURL(configPath).href)).default;
  const knownIds = new Set(existing.map((post) => post.id));
  const browser = new Browser(chromePath);
  const saved = [];
  try {
    await browser.start();
    for (const handle of handles) {
      const accountHasSaved = existing.some(
        (post) => (post.handle || DEFAULT_HANDLE) === handle,
      );
      const remote = await loadProfile(browser, handle, knownIds, accountHasSaved);
      if (!remote.length) {
        throw new Error(`Instagram did not return any @${handle} posts. Try again in a few minutes.`);
      }
      const fresh = remote.filter((post) => !knownIds.has(post.id));
      if (!fresh.length) {
        console.log(`Checked ${remote.length} recent @${handle} posts. None are new.`);
        continue;
      }
      for (const post of fresh) {
        process.stdout.write(`Saving @${handle} ${post.date} ${post.id}...\n`);
        const entry = await savePost(browser, post);
        saved.push(entry);
        knownIds.add(post.id);
      }
    }
    if (!saved.length) return;
    const merged = [...saved, ...existing].sort((a, b) => {
      const aTime = Date.parse(a.date) || 0;
      const bTime = Date.parse(b.date) || 0;
      return bTime - aTime;
    });
    await writeConfig(merged);
    console.log(`Added ${saved.length} post${saved.length === 1 ? "" : "s"}:`);
    for (const post of saved) console.log(`- @${post.handle || DEFAULT_HANDLE} ${post.date} ${post.id}`);
  } finally {
    await browser.close();
  }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main().catch((error) => {
    console.error(error?.message || error);
    process.exit(1);
  });
}

import fs from "fs";
import path from "path";

/** File name → the route that renders it. Unlisted files are shared components. */
const PAGE_ROUTES = {
  "Home.jsx": { to: "/", title: "Home", section: "Home" },
  "AboutLSA.jsx": { to: "/LSA", title: "About LSA", section: "About LSA" },
  "SBC.jsx": { to: "/LSA/SBC", title: "Student Body Council", section: "About LSA" },
  "DSA.jsx": { to: "/LSA/DSA", title: "Director of Student Activities", section: "About LSA" },
  "Charter.jsx": { to: "/LSA/Charter", title: "Charter of the LSA", section: "About LSA" },
  "Committees.jsx": { to: "/LSA/Commitees", title: "Committees", section: "About LSA" },
  "SpiritCommittee.jsx": { to: "/LSA/Spirit Committee", title: "Spirit Committees", section: "About LSA" },
  "LSAExplore.jsx": { to: "/LSA-EXPLORE", title: "All boards", section: "About LSA" },
  "Organizations.jsx": { to: "/Organizations", title: "Organizations", section: "Organizations" },
  "MockTrial.jsx": { to: "/Organizations/MockTrial", title: "Mock Trial", section: "Organizations" },
  "ShieldAndScroll.jsx": { to: "/Organizations/ShieldAndScroll", title: "Shield and Scroll", section: "Organizations" },
  "Forensic.jsx": { to: "/Organizations/Forensic", title: "Forensic Society", section: "Organizations" },
  "VideoLowell.jsx": { to: "/Organizations/VideoLowell", title: "Video Lowell", section: "Organizations" },
  "Clubs.jsx": { to: "/Clubs", title: "Clubs", section: "Clubs" },
  "ClubResources.jsx": { to: "/Clubs/ClubResources", title: "Club Resources", section: "Clubs" },
  "NewClub.jsx": { to: "/Clubs/NewClub", title: "How to start a club", section: "Clubs" },
  "EventPlanning.jsx": { to: "/Clubs/EventPlanning", title: "Event planning", section: "Clubs" },
  "Fundraising.jsx": { to: "/Clubs/Fundraising", title: "Fundraising", section: "Clubs" },
  "Announcements.jsx": { to: "/Announcements", title: "Announcements", section: "Announcements" },
  "Resources.jsx": { to: "/Resources", title: "Resources", section: "Resources" },
  "Wellness.jsx": { to: "/Resources/Wellness", title: "Lowell Wellness Center", section: "Resources" },
  "TitleIX.jsx": { to: "/Resources/TitleIX", title: "Title IX Support", section: "Resources" },
  "FreshmenCorner.jsx": { to: "/FreshmenCorner", title: "Freshmen Corner", section: "More" },
  "Registry.jsx": { to: "/Registry", title: "Master registry list", section: "More" },
  "Events.jsx": { to: "/Events", title: "Events", section: "Events" },
  "Site.jsx": { to: "/AboutSite", title: "About this site", section: "More" },
  "Archives.jsx": { to: "/Archives", title: "LSA Archives", section: "More" },
  "Cardinalympics.jsx": { to: "/Cardinalympics", title: "Cardinalympics", section: "Cardinalympics" },
  "More.jsx": { to: "/More", title: "More", section: "More" },
  "Elections.jsx": { to: "/Elections", title: "Elections", section: "Elections" },
  "ElectionResults.jsx": { to: "/Elections/Results", title: "Election results", section: "Elections" },
  "ElectionBoard.jsx": { to: "/Elections", title: "Election board", section: "Elections" },
  "ElectionsCandidateBoards.jsx": { to: "/Elections", title: "Election candidates", section: "Elections" },
};

const SKIP_FILES = new Set([
  "Layout.jsx",
  "NotFound.jsx",
  "ApplicationsOpen.jsx",
  "News.jsx",
]);

export function listJsxFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listJsxFiles(full));
    else if (entry.name.endsWith(".jsx")) out.push(full);
  }
  return out;
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&rarr;/g, "→")
    .replace(/&larr;/g, "←");
}

function looksLikeCode(text) {
  if (text.startsWith("./") || text.startsWith("../") || /^\/[\w./-]+$/.test(text)) return true;
  if (/^https?:\/\/\S+$/i.test(text)) return true;
  if (/^#[0-9a-f]{3,8}$/i.test(text)) return true;
  if (/\.(jsx|js|scss|png|jpe?g|svg|webp)$/i.test(text) && !text.includes(" ")) return true;
  if (text.includes("=>") || text.includes("PropTypes") || text.includes("className")) return true;
  if (/[{}]|\)\s*:|=>|===|!==|&&/.test(text)) return true;
  if (text.length < 90 && /\w+\(/.test(text) && !/[.!?]\s/.test(text)) return true;
  if (/\b(const|let|var)\b/.test(text) || /\bfunction\s*\(/.test(text)) return true;
  if (/\breturn\s*[({]/.test(text)) return true;
  if (/\bnull\b/.test(text) && /[(){}:;]/.test(text)) return true;
  if (/^\s*[)};=+]/.test(text)) return true;
  if (text.length < 40 && text.includes("+")) return true;
  if (/^[A-Z0-9_]+$/.test(text) && text.includes("_")) return true;
  if (/^[A-Z][A-Za-z0-9]+$/.test(text)) return true;
  if (/^[a-z0-9_-]+$/.test(text) && (text.includes("-") || text.includes("_"))) return true;
  return false;
}

function keepChunk(text) {
  const value = decodeEntities(text).replace(/\s+/g, " ").trim();
  if (value.length < 3 || looksLikeCode(value)) return "";
  if (!/[a-z]/i.test(value)) return "";
  const email = value.includes("@") && value.includes(".");
  const hasCapital = /[A-Z]/.test(value);
  const hasDigit = /[0-9]/.test(value);
  const hasSentenceMark = /[.!?,:;]/.test(value);
  if (
    !email &&
    !hasCapital &&
    !hasDigit &&
    !hasSentenceMark &&
    !value.includes(" ") &&
    value.length < 8
  ) {
    return "";
  }
  return value;
}

export function extractReadableText(source) {
  const stripped = source
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:\\])\/\/.*$/gm, "$1");
  const chunks = [];

  const textNode = />([^<{})]+)/g;
  let match;
  while ((match = textNode.exec(stripped))) {
    const kept = keepChunk(match[1]);
    if (kept) chunks.push(kept);
  }

  const strings = /"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'/g;
  while ((match = strings.exec(stripped))) {
    const raw = (match[1] ?? match[2] ?? "")
      .replace(/\\n/g, " ")
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"');
    const kept = keepChunk(raw);
    if (kept) chunks.push(kept);
  }

  return [...new Set(chunks)].join(" ").replace(/ +([.,;:!?])/g, "$1");
}

function importsFile(source, base) {
  const stem = base.replace(/\.jsx$/, "");
  return (
    source.includes(`/${stem}.jsx`) ||
    source.includes(`/${stem}"`) ||
    source.includes(`/${stem}'`)
  );
}

export function collectStaticPages(filePaths) {
  const files = filePaths
    .map((filePath) => ({
      base: path.basename(filePath),
      source: fs.readFileSync(filePath, "utf8"),
    }))
    .filter((file) => !SKIP_FILES.has(file.base));

  const ownText = new Map(
    files.map((file) => [file.base, extractReadableText(file.source)]),
  );
  const unrouted = files.filter((file) => !PAGE_ROUTES[file.base]);
  const byRoute = new Map();

  for (const file of files) {
    const route = PAGE_ROUTES[file.base];
    if (!route) continue;

    let text = ownText.get(file.base) || "";
    for (const shared of unrouted) {
      const piece = ownText.get(shared.base);
      if (!piece) continue;
      if (importsFile(file.source, shared.base)) {
        text += ` ${piece}`;
        continue;
      }
      for (const mid of unrouted) {
        if (mid.base === shared.base) continue;
        if (
          importsFile(file.source, mid.base) &&
          importsFile(mid.source, shared.base)
        ) {
          text += ` ${piece}`;
          break;
        }
      }
    }

    const existing = byRoute.get(route.to);
    if (existing) existing.text += ` ${text}`;
    else byRoute.set(route.to, { ...route, text: text.trim() });
  }

  return [...byRoute.values()];
}

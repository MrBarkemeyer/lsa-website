import posts from "../config/instagramPosts.config.js";
import { staticPageText } from "virtual:page-text";

function isExternal(to) {
  return /^https?:\/\//i.test(to || "");
}

function childPath(parentTo, to) {
  if (!to || to === "#") return null;
  if (isExternal(to) || to.startsWith("/")) return to;
  const base = String(parentTo || "").replace(/\/$/, "");
  return `${base}/${to}`;
}

function clubText(club) {
  const skip = /photo|image|banner|logo|pfp|video|media|drive/i;
  return Object.entries(club)
    .filter(([key, value]) => {
      if (typeof value !== "string") return false;
      const text = value.trim();
      if (!text || skip.test(key)) return false;
      if (/^https?:\/\//i.test(text) && text.length > 80) return false;
      return true;
    })
    .map(([, value]) => value.trim())
    .join(" ");
}

function officerPath(team) {
  if (!team || team === "SBC") return "/LSA/SBC";
  return `/LSA/${team}`;
}

function splitPeople(value, fallbackRole) {
  return String(value || "")
    .split(/\s*(?:,|;|\n|\band\b)\s*/i)
    .map((part) => {
      const trimmed = part.trim();
      const paren = trimmed.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
      const name = (paren ? paren[1] : trimmed).trim();
      const role = (paren ? paren[2] : fallbackRole).trim();
      return { name, role };
    })
    .filter((person) => {
      const words = person.name.split(/\s+/).filter(Boolean);
      if (words.length === 0 || words.length > 5) return false;
      if (/^(n\/?a|none|tbd|unknown|-+)$/i.test(person.name)) return false;
      return /[a-z]/i.test(person.name);
    });
}

function cleanBlurb(value) {
  const text = String(value || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!text || /=>|\)\s*:|className|<\/?[a-z]/.test(text)) return "";
  return text;
}

function personDoc({ id, name, role, org, to, blurb, source }) {
  const clean = cleanBlurb(blurb);
  return {
    id,
    kind: "person",
    source,
    title: name,
    name,
    role: role || "",
    org: org || "",
    blurb: clean,
    to,
    section: [role, org].filter(Boolean).join(" · "),
    text: [name, role, org, clean].filter(Boolean).join(" ").replace(/\s+/g, " "),
    external: false,
  };
}

function eventTitle(caption, date) {
  const line = String(caption || "")
    .replace(/\s+/g, " ")
    .trim()
    .split(/[.!\n]/)[0]
    .trim();
  if (!line) return date || "Event";
  return line.length > 90 ? `${line.slice(0, 87)}…` : line;
}

export function buildSearchDocuments({
  navLinks = [],
  clubData = [],
  officerData = [],
  newsData = [],
  electionsConfig = null,
  cardinalympicsEvents = [],
}) {
  const docs = [];
  const pageByKey = new Map();

  const addPage = (to, title, section, text, external = false) => {
    if (!to || to === "#") return;
    const key = `${external ? "ext:" : ""}${to}`;
    const prev = pageByKey.get(key);
    if (prev) {
      prev.text += ` ${text || ""}`;
      return;
    }
    const doc = {
      id: key,
      title: title || to,
      to,
      section: section || "",
      text: `${title || ""} ${section || ""} ${text || ""}`.replace(/\s+/g, " ").trim(),
      external,
    };
    pageByKey.set(key, doc);
    docs.push(doc);
  };

  for (const link of navLinks || []) {
    addPage(link.to, link.name, link.name, "");
    for (const sub of link.subLinks || []) {
      const href = sub.directLink ? sub.to : childPath(link.to, sub.to);
      addPage(href, sub.name, link.name, "", isExternal(href));
      for (const nested of sub.subLinks2 || []) {
        const nestedHref = childPath(link.to, nested.to);
        addPage(nestedHref, nested.name, link.name, "");
      }
    }
  }

  for (const page of staticPageText) {
    addPage(page.to, page.title, page.section, page.text);
  }

  for (const club of clubData || []) {
    if (!club?.Name) continue;
    addPage(`/Clubs/${club.Name}`, club.Name, "Clubs", clubText(club));
    const leaders = [
      ...splitPeople(club.President, "President"),
      ...splitPeople(club.VP, "Vice President"),
      ...splitPeople(club.OtherOfficers, "Officer"),
    ];
    for (const person of leaders) {
      docs.push(
        personDoc({
          id: `club-person:${club.Name}:${person.role}:${person.name}`,
          name: person.name,
          role: person.role,
          org: club.Name,
          to: `/Clubs/${club.Name}`,
          source: "club",
        }),
      );
    }
  }

  for (const officer of officerData || []) {
    if (!officer?.Name) continue;
    docs.push(
      personDoc({
        id: `officer:${officer.Team}:${officer.Name}:${officer.Role}`,
        name: officer.Name,
        role: officer.Role,
        org: officer.Team,
        to: officerPath(officer.Team),
        blurb: officer.Description,
        source: "officer",
      }),
    );
  }

  for (const item of newsData || []) {
    if (!item?.title && !item?.content) continue;
    docs.push({
      id: `news:${item.id || item.title}`,
      title: item.title || "Announcement",
      to: "/Announcements",
      section: item.date ? `Announcements · ${item.date}` : "Announcements",
      text: [item.title, item.date, item.content].filter(Boolean).join(" "),
      external: false,
    });
  }

  for (const post of posts) {
    const caption = String(post.caption || "").replace(/\s+/g, " ").trim();
    if (!caption) continue;
    docs.push({
      id: `event:${post.id}`,
      title: eventTitle(caption, post.date),
      to: "/Events",
      section: post.date ? `Events · ${post.date}` : "Events",
      text: `${post.date || ""} ${caption}`,
      external: false,
    });
  }

  for (const event of cardinalympicsEvents || []) {
    const title = event.heading || event.name;
    if (!title) continue;
    docs.push({
      id: `cymp:${event.id || title}`,
      title,
      to: "/Cardinalympics",
      section: event.category
        ? `Cardinalympics · ${event.category}`
        : "Cardinalympics",
      text: [
        title,
        event.category,
        event.dateDisplay,
        event.bodyText,
        event.descriptionFull,
        event.pointsPossible,
      ]
        .filter(Boolean)
        .join(" "),
      external: false,
    });
  }

  const elections = (navLinks || []).find((link) => link.name === "ELECTIONS");
  const allowedSlugs = new Set(
    (elections?.subLinks || []).map((sub) =>
      String(sub.to || "").trim().toLowerCase(),
    ),
  );
  if (allowedSlugs.size > 0) {
    for (const board of electionsConfig?.contenders || []) {
      const slug = String(board.slug || "").trim().toLowerCase();
      if (!allowedSlugs.has(slug)) continue;
      for (const role of board.roles || []) {
        for (const person of role.candidates || []) {
          if (!person?.name) continue;
          docs.push(
            personDoc({
              id: `candidate:${board.slug}:${role.role}:${person.name}`,
              name: person.name,
              role: role.role,
              org: board.board,
              to: `/Elections/${board.slug}`,
              blurb: person.description,
              source: "candidate",
            }),
          );
        }
      }
    }
  }

  return docs;
}

const WHO_LIMIT = 6;
const STOP = new Set(["the", "a", "an", "our", "of", "for", "on", "at", "to", "and", "or"]);

function whoPhrase(query) {
  const normalized = String(query || "")
    .toLowerCase()
    .replace(/['’]/g, "");
  const match = normalized.match(/^who(?:s| is| are)?\s+(.+)$/);
  if (!match) return "";
  return match[1].replace(/\s+/g, " ").trim();
}

function whoTokens(phrase) {
  return phrase
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1 && !STOP.has(word));
}

function covers(text, token) {
  const hay = String(text || "").toLowerCase();
  if (!hay || !token) return false;
  if (hay.includes(token)) return true;
  // ponytail: one trailing s, so "presidents" hits "president"
  return token.length > 4 && token.endsWith("s") && hay.includes(token.slice(0, -1));
}

function scorePerson(person, tokens) {
  const name = person.name;
  const role = person.role;
  if (!tokens.every((token) => covers(name, token) || covers(role, token) || covers(person.org, token))) {
    return 0;
  }
  const nameHits = tokens.filter((token) => covers(name, token)).length;
  const roleHits = tokens.filter((token) => covers(role, token)).length;
  if (nameHits === 0 && roleHits === 0) return 0;

  let score = 10 + nameHits * 20 + roleHits * 8;
  const extraRoleWords = String(role || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word && !tokens.some((token) => covers(word, token)));
  if (nameHits === tokens.length) score += 40;
  else if (extraRoleWords.length > 0) return 0;
  if (person.source === "officer") score += 5;
  else if (person.source === "candidate") score += 2;
  return score;
}

function describePerson(person) {
  const role = person.role;
  const org = person.org;
  let sentence = person.name;
  if (person.source === "candidate" && role) {
    sentence = org
      ? `${person.name} is running for ${role} of ${org}.`
      : `${person.name} is running for ${role}.`;
  } else if (role && org) {
    const label = role.toLowerCase() === "officer" ? "an officer" : `the ${role}`;
    sentence = `${person.name} is ${label} of ${org}.`;
  } else if (role) {
    sentence = `${person.name} is the ${role}.`;
  } else if (org) {
    sentence = `${person.name} is on ${org}.`;
  }
  const blurb = person.blurb;
  if (!blurb) return sentence;
  let short = blurb;
  if (short.length > 280) {
    const cut = short.slice(0, 280);
    const at = Math.max(cut.lastIndexOf("\n"), cut.lastIndexOf(" "));
    short = `${(at > 80 ? cut.slice(0, at) : cut).trim()}…`;
  }
  return `${sentence}\n\n${short}`;
}

export function whoAnswers(documents, query) {
  const phrase = whoPhrase(query);
  const tokens = whoTokens(phrase);
  if (tokens.length === 0) return [];
  return (documents || [])
    .filter((doc) => doc.kind === "person")
    .map((person) => ({ person, score: scorePerson(person, tokens) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.person.name.localeCompare(b.person.name))
    .slice(0, WHO_LIMIT)
    .map(({ person }) => ({
      id: person.id,
      question: person.name,
      answer: describePerson(person),
      to: person.to,
    }));
}

export function pageQuery(query) {
  const phrase = whoPhrase(query);
  return phrase || query;
}

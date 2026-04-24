/**
 * Parse "Cardinalympics Events" tab: Name, Category, Date (MM/DD/YY), Description, Sign Up Link, Points Possible
 */

function parseMMDDYY(str) {
  if (!str) return null;
  const s = String(str).trim();
  const mdy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (!mdy) return null;
  const month = parseInt(mdy[1], 10) - 1;
  const day = parseInt(mdy[2], 10);
  let year = parseInt(mdy[3], 10);
  if (year < 100) year += 2000;
  const d = new Date(year, month, day);
  return Number.isNaN(d.getTime()) ? null : d;
}

function splitDescription(description) {
  const lines = String(description || "").split(/\r?\n/);
  const first = lines[0]?.trim() || "";
  const rest = lines.slice(1).join("\n").trim();
  return { headline: first, body: rest };
}

function isGenericName(name) {
  const n = String(name || "")
    .trim()
    .toLowerCase();
  return !n || n === "cardinalympics";
}

function parseSignUpCell(raw) {
  if (raw == null) return { signUpLink: "", signUpClosed: false };
  const s = String(raw).trim();
  if (!s || /^n\/?a$/i.test(s)) return { signUpLink: "", signUpClosed: false };
  if (/^closed$/i.test(s)) return { signUpLink: "", signUpClosed: true };
  if (/^https?:\/\//i.test(s)) return { signUpLink: s, signUpClosed: false };
  return { signUpLink: "", signUpClosed: false };
}

function parsePointsPossibleCell(raw) {
  if (raw == null) return "";
  const s = String(raw).trim();
  if (!s || /^n\/?a$/i.test(s) || /^none$/i.test(s)) return "";
  return s;
}

export function parseCardinalympicsEventsSheet(values) {
  if (!Array.isArray(values) || values.length < 2) return [];

  const headers = values[0].map((h) => String(h || "").trim().toLowerCase());

  const nameIdx = headers.findIndex((h) => h === "name");
  let categoryIdx = headers.findIndex((h) => h === "category" || h.startsWith("category"));
  if (categoryIdx < 0) {
    categoryIdx = headers.findIndex((h) => h.includes("category"));
  }
  let dateIdx = headers.findIndex(
    (h) => h === "date (mm/dd/yy)" || h.includes("mm/dd/yy")
  );
  if (dateIdx < 0) {
    dateIdx = headers.findIndex((h) => h === "date");
  }
  const descIdx = headers.findIndex((h) => h === "description");
  let signIdx = headers.findIndex(
    (h) => (h.includes("sign") && h.includes("link")) || h === "sign up link"
  );
  if (signIdx < 0) {
    signIdx = headers.findIndex((h) => h.includes("signup") || h.includes("sign-up"));
  }
  let pointsPossibleIdx = headers.findIndex(
    (h) => h === "points possible" || (h.includes("points") && h.includes("possible"))
  );
  if (pointsPossibleIdx < 0) {
    pointsPossibleIdx = headers.findIndex((h) => h.includes("pts poss"));
  }

  if (descIdx < 0) return [];

  const rows = values.slice(1);
  const events = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const description = String(row?.[descIdx] ?? "").trim();
    if (!description) continue;

    const name = nameIdx >= 0 ? String(row?.[nameIdx] ?? "").trim() : "";
    const category =
      categoryIdx >= 0 ? String(row?.[categoryIdx] ?? "").trim() : "";
    const dateRaw = dateIdx >= 0 ? String(row?.[dateIdx] ?? "").trim() : "";
    const { signUpLink, signUpClosed } =
      signIdx >= 0 ? parseSignUpCell(row?.[signIdx]) : { signUpLink: "", signUpClosed: false };
    const pointsPossible =
      pointsPossibleIdx >= 0 ? parsePointsPossibleCell(row?.[pointsPossibleIdx]) : "";

    const sortDate = parseMMDDYY(dateRaw);
    const { headline, body } = splitDescription(description);
    const useName = !isGenericName(name);
    const heading = useName ? name : headline || "Event";
    const bodyText = useName ? description : body || description;

    events.push({
      id: `cymp-ev-${i}-${heading.slice(0, 24)}`,
      name,
      category: category || "Events",
      dateDisplay: dateRaw || "",
      sortDate,
      heading,
      bodyText,
      descriptionFull: description,
      signUpLink,
      signUpClosed,
      pointsPossible,
    });
  }

  return events;
}

/**
 * Group by category; sort events by date ascending; sort groups by earliest event date.
 */
export function groupCardinalympicsEventsByCategory(events) {
  if (!events?.length) return [];

  const byCat = new Map();
  for (const ev of events) {
    const key = ev.category || "Events";
    if (!byCat.has(key)) byCat.set(key, []);
    byCat.get(key).push(ev);
  }

  const groups = [...byCat.entries()].map(([category, list]) => {
    const sorted = [...list].sort((a, b) => {
      const ta = a.sortDate ? a.sortDate.getTime() : 0;
      const tb = b.sortDate ? b.sortDate.getTime() : 0;
      if (!a.sortDate && !b.sortDate) return 0;
      if (!a.sortDate) return 1;
      if (!b.sortDate) return -1;
      return ta - tb;
    });
    const minDate = sorted.reduce((acc, ev) => {
      if (!ev.sortDate) return acc;
      const t = ev.sortDate.getTime();
      if (acc == null || t < acc) return t;
      return acc;
    }, null);
    return { category, events: sorted, minDate };
  });

  groups.sort((a, b) => {
    if (a.minDate != null && b.minDate != null) return a.minDate - b.minDate;
    if (a.minDate != null) return -1;
    if (b.minDate != null) return 1;
    return String(a.category).localeCompare(String(b.category));
  });

  return groups;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * True when the sheet has a sign-up URL but the event calendar day (MM/DD/YY → sortDate)
 * is strictly before today (local). Used to show "Closed" instead of the link after that day.
 */
export function isCardinalympicsSignupPastEventDay(ev) {
  if (!ev?.signUpLink || ev.signUpClosed) return false;
  if (!ev.sortDate) return false;
  const now = new Date();
  const todayStart = startOfDay(now);
  const eventDayStart = startOfDay(ev.sortDate);
  return eventDayStart < todayStart;
}

function sortEventsByDate(a, b) {
  const ta = a.sortDate ? a.sortDate.getTime() : 0;
  const tb = b.sortDate ? b.sortDate.getTime() : 0;
  if (!a.sortDate && !b.sortDate) return 0;
  if (!a.sortDate) return 1;
  if (!b.sortDate) return -1;
  return ta - tb;
}

/**
 * Group events by week number (relative to first dated event), then day of week.
 * Example output:
 * [{ weekLabel: "Week 1", days: [{ dayLabel: "Monday", events: [...] }] }]
 */
export function groupCardinalympicsEventsByWeekAndDay(events) {
  if (!events?.length) return [];

  const sorted = [...events].sort(sortEventsByDate);
  const dated = sorted.filter((ev) => ev.sortDate);
  if (!dated.length) {
    return [
      {
        weekLabel: "Week 1",
        days: [{ dayLabel: "Unscheduled", events: sorted }],
      },
    ];
  }

  const earliestMs = startOfDay(dated[0].sortDate);
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
  const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });

  const weekMap = new Map();

  for (const ev of sorted) {
    const weekIndex = ev.sortDate
      ? Math.floor((startOfDay(ev.sortDate) - earliestMs) / oneWeekMs) + 1
      : 1;
    const weekLabel = `Week ${weekIndex}`;
    const dayLabel = ev.sortDate ? dayFormatter.format(ev.sortDate) : "Unscheduled";

    if (!weekMap.has(weekLabel)) weekMap.set(weekLabel, new Map());
    const dayMap = weekMap.get(weekLabel);
    if (!dayMap.has(dayLabel)) dayMap.set(dayLabel, []);
    dayMap.get(dayLabel).push(ev);
  }

  return [...weekMap.entries()].map(([weekLabel, dayMap]) => ({
    weekLabel,
    days: [...dayMap.entries()].map(([dayLabel, evs]) => ({
      dayLabel,
      events: evs.sort(sortEventsByDate),
    })),
  }));
}

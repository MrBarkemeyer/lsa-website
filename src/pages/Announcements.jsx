import { useEffect, useMemo, useState } from "react";

const INITIAL_VISIBLE = 9;
const LOAD_MORE_STEP = 9;
const PREVIEW_LENGTH = 120;
const GOOGLE_API_KEY = "AIzaSyAgshc5Aqd8B149h5RpsenMh_SQAeb4AXc";
const ANNOUNCEMENTS_SPREADSHEET_ID = "1Kk7Bs58DAWZ9pHvqD-RFvoV1ePeThQ1Yr9c5RsDeAq4";
// Tab title in the spreadsheet is misspelled "Annoucements" (one n). Keeps one values.get per page load.
const ANNOUNCEMENTS_SHEET_NAMES = ["Annoucements Archive"];

function toSortableDate(input) {
  if (!input) return null;
  const s = String(input).trim();

  // Date (MM/DD/YY) column — parse before Date.parse to avoid locale ambiguity
  const mdy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (mdy) {
    const month = parseInt(mdy[1], 10) - 1;
    const day = parseInt(mdy[2], 10);
    let year = parseInt(mdy[3], 10);
    if (year < 100) year += 2000;
    const d = new Date(year, month, day);
    if (!Number.isNaN(d.getTime())) return d;
  }

  const parsed = Date.parse(s);
  if (!Number.isNaN(parsed)) return new Date(parsed);

  const monthYear = s.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const [, monthName, year] = monthYear;
    const monthParsed = Date.parse(`${monthName} 1, ${year}`);
    if (!Number.isNaN(monthParsed)) return new Date(monthParsed);
  }
  return null;
}

function toMonthValue(input) {
  const d = toSortableDate(input);
  if (!d) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function trimPreview(text) {
  if (!text || text.length <= PREVIEW_LENGTH) return text || "";
  return `${text.slice(0, PREVIEW_LENGTH).trimEnd()}...`;
}

function parseSheetAnnouncements(values) {
  if (!Array.isArray(values) || values.length < 2) return [];
  const headers = values[0].map((h) => String(h || "").trim().toLowerCase());
  const normalizedHeaders = headers.map((h) =>
    h
      .toLowerCase()
      .replace(/\([^)]*\)/g, "")
      .replace(/[^a-z0-9]/g, "")
  );
  let titleIndex = headers.findIndex(
    (h) => h === "name" || h === "title" || h === "event name"
  );
  if (titleIndex < 0) {
    titleIndex = normalizedHeaders.findIndex((h) => h === "eventname");
  }
  // Prefer "Date (MM/DD/YY)" column; fall back to Year / Date
  let dateIndex = headers.findIndex(
    (h) => h === "date (mm/dd/yy)" || h.includes("mm/dd/yy")
  );
  if (dateIndex < 0) {
    dateIndex = headers.findIndex((h) => h === "year" || h === "date");
  }
  const contentIndex = headers.findIndex((h) => h === "description" || h === "content");
  if (contentIndex < 0) return [];
  if (titleIndex < 0) {
    // Some tabs use Event Name in col A with custom formatting; fallback safely.
    titleIndex = 0;
  }

  return values
    .slice(1)
    .map((row) => ({
      title: String(row?.[titleIndex] ?? "").trim(),
      date: String(row?.[dateIndex] ?? "").trim() || "Unknown",
      content: String(row?.[contentIndex] ?? "").trim(),
    }))
    .filter((item) => item.title && item.content);
}

export default function Announcements() {
  const [sheetAnnouncements, setSheetAnnouncements] = useState([]);
  const [loadingSheet, setLoadingSheet] = useState(true);
  const [query, setQuery] = useState("");
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAnnouncementsFromSheet() {
      setLoadingSheet(true);
      try {
        for (const sheetName of ANNOUNCEMENTS_SHEET_NAMES) {
          const range = encodeURIComponent(sheetName);
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${ANNOUNCEMENTS_SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;
          const res = await fetch(url);
          const json = await res.json();
          if (json?.error) continue;
          const parsed = parseSheetAnnouncements(json.values);
          if (parsed.length > 0) {
            if (!cancelled) setSheetAnnouncements(parsed);
            return;
          }
        }
      } catch (error) {
        console.warn("Announcements sheet fetch failed:", error);
      } finally {
        if (!cancelled) setLoadingSheet(false);
      }
    }

    fetchAnnouncementsFromSheet();
    return () => {
      cancelled = true;
    };
  }, []);

  const sourceAnnouncements = sheetAnnouncements;

  const normalized = useMemo(
    () =>
      sourceAnnouncements
        .map((item, index) => ({
          ...item,
          id: `${item.title}-${index}`,
          sortDate: toSortableDate(item.date),
          monthValue: toMonthValue(item.date),
        }))
        .sort((a, b) => {
          if (!a.sortDate && !b.sortDate) return 0;
          if (!a.sortDate) return 1;
          if (!b.sortDate) return -1;
          return b.sortDate.getTime() - a.sortDate.getTime();
        }),
    [sourceAnnouncements]
  );

  const filteredAnnouncements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const from = fromMonth || "";
    const to = toMonth || "";

    return normalized.filter((item) => {
      const searchable = `${item.title} ${item.content}`.toLowerCase();
      const matchesQuery =
        !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesFrom = !from || (item.monthValue && item.monthValue >= from);
      const matchesTo = !to || (item.monthValue && item.monthValue <= to);
      return matchesQuery && matchesFrom && matchesTo;
    });
  }, [normalized, query, fromMonth, toMonth]);

  const visibleAnnouncements = filteredAnnouncements.slice(0, visibleCount);
  const hasMore = filteredAnnouncements.length > visibleCount;

  const modalItem = useMemo(() => {
    if (!openId) return null;
    return (
      filteredAnnouncements.find((i) => i.id === openId) ??
      normalized.find((i) => i.id === openId) ??
      null
    );
  }, [openId, filteredAnnouncements, normalized]);

  useEffect(() => {
    if (!openId) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [openId]);

  return (
    <section className="announcements-page info-page">
      <div className="announcements-page__header">
        <h1>All Announcements</h1>
        <p>
          {loadingSheet
            ? "Loading annoucements"
            : "Search and filter updates by month, then click a card to read the full announcement."}
        </p>
      </div>

      <div className="announcements-toolbar">
        <label className="announcements-field">
          <span>Search</span>
          <input
            type="search"
            placeholder="Search title or content..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(INITIAL_VISIBLE);
              setOpenId(null);
            }}
          />
        </label>

        <label className="announcements-field">
          <span>From month</span>
          <input
            type="month"
            value={fromMonth}
            onChange={(e) => {
              setFromMonth(e.target.value);
              setVisibleCount(INITIAL_VISIBLE);
              setOpenId(null);
            }}
          />
        </label>

        <label className="announcements-field">
          <span>To month</span>
          <input
            type="month"
            value={toMonth}
            onChange={(e) => {
              setToMonth(e.target.value);
              setVisibleCount(INITIAL_VISIBLE);
              setOpenId(null);
            }}
          />
        </label>
      </div>

      <p className="announcements-count">
        Showing {visibleAnnouncements.length} of {filteredAnnouncements.length} announcements
      </p>

      <div className="announcements-grid">
        {!loadingSheet && visibleAnnouncements.length === 0 && (
          <p className="announcements-count">You&apos;re up to date!</p>
        )}
        {visibleAnnouncements.map((item) => (
          <div className="announcement-card-wrap" key={item.id}>
            <button
              type="button"
              className="announcement-card"
              aria-haspopup="dialog"
              onClick={() => setOpenId(item.id)}
            >
              <h3>{item.title}</h3>
              <p className="announcement-card-date">{item.date}</p>
              <p className="announcement-card-preview">{trimPreview(item.content)}</p>
              <p className="announcement-card-cta">View details</p>
            </button>
          </div>
        ))}
      </div>

      {modalItem && (
        <div
          className="announcement-modal-backdrop"
          role="presentation"
          onClick={() => setOpenId(null)}
        >
          <div
            className="announcement-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="announcement-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="announcement-modal-close"
              aria-label="Close announcement"
              onClick={() => setOpenId(null)}
            >
              ×
            </button>
            <h2 id="announcement-modal-title" className="announcement-modal-title">
              {modalItem.title}
            </h2>
            <p className="announcement-modal-date">{modalItem.date}</p>
            <div className="announcement-modal-body">
              <p className="announcement-modal-content">{modalItem.content}</p>
            </div>
          </div>
        </div>
      )}

      {hasMore && (
        <button
          type="button"
          className="announcements-load-more"
          onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}
        >
          Load more announcements
        </button>
      )}
    </section>
  );
}

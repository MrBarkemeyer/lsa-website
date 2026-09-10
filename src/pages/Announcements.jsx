import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  announcementMonthValue,
  parseAnnouncementDate,
} from "../utils/announcementsSheet.js";

const INITIAL_VISIBLE = 9;
const LOAD_MORE_STEP = 9;
const PREVIEW_LENGTH = 120;
const EMPTY_ANNOUNCEMENTS = [];

function trimPreview(text) {
  if (!text || text.length <= PREVIEW_LENGTH) return text || "";
  return `${text.slice(0, PREVIEW_LENGTH).trimEnd()}...`;
}

export default function Announcements({
  announcements = EMPTY_ANNOUNCEMENTS,
  loading = true,
}) {
  const [query, setQuery] = useState("");
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [openId, setOpenId] = useState(null);

  const normalized = useMemo(
    () =>
      announcements
        .map((item, index) => ({
          ...item,
          id: item.id ?? `${item.title}-${item.date}-${index}`,
          sortDate: parseAnnouncementDate(item.date),
          monthValue: announcementMonthValue(item.date),
        }))
        .sort((a, b) => {
          if (!a.sortDate && !b.sortDate) return 0;
          if (!a.sortDate) return 1;
          if (!b.sortDate) return -1;
          return b.sortDate.getTime() - a.sortDate.getTime();
        }),
    [announcements]
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
          {loading
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
        {!loading && visibleAnnouncements.length === 0 && (
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

Announcements.propTypes = {
  announcements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ),
  loading: PropTypes.bool,
};

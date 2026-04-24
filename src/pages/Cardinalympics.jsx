/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import Counter from "../components/Counter";
import {
  groupCardinalympicsEventsByWeekAndDay,
  isCardinalympicsSignupPastEventDay,
} from "../utils/cardinalympicsEventsFromSheet";
import "./Cardinalympics.scss";

const CLASS_NAMES = ["Freshman", "Sophomore", "Junior", "Senior"];
const CLASS_SLUGS = ["freshman", "sophomore", "junior", "senior"];
const COUNTER_COLORS = ["#2e7d32", "#6a1b9a", "#1565c0", "#9c1919"];
const POINTS_POSSIBLE = 9750;

// turn a cell value into a number or bail with empty string (sheet data is messy)
function parseScore(val) {
  if (val == null || val === "") return "";
  const n = parseInt(String(val).replace(/[^0-9-]/g, ""), 10);
  return isNaN(n) ? "" : n;
}

// is this row the header row? (Date, Points Poss., etc.)
function isHeaderRow(row) {
  if (!row || !row[0]) return false;
  const first = String(row[0]).toLowerCase();
  const second = row[1] ? String(row[1]).toLowerCase() : "";
  return (
    first.includes("date") ||
    second.includes("points") ||
    (first.includes("points") && second.includes("poss"))
  );
}

// "TOTAL" row at the bottom - we skip or style it different
function isTotalRow(row) {
  const label = String(row[0] ?? "").toUpperCase();
  return label.includes("TOTAL") && !label.includes("EVENTS TOTAL");
}

// sheet columns: Freshman Soph Junior Senior scores then winner. layout is kinda weird but here we are
const IDX_FR = 4;
const IDX_SO = 5;
const IDX_JR = 6;
const IDX_SR = 7;
const IDX_WINNER = 8;

// section headers like "Shorter Daily Events" - no scores, just a label
function isSectionRow(row) {
  if (!row || row.length < 8) return true;
  const hasScores = [row[IDX_FR], row[IDX_SO], row[IDX_JR], row[IDX_SR]].some((c) => parseScore(c) !== "");
  return !hasScores && String(row[0] ?? "").trim().length > 0;
}

// real event row = has at least one class score
function isEventRow(row) {
  if (!row || row.length < 8) return false;
  return [row[IDX_FR], row[IDX_SO], row[IDX_JR], row[IDX_SR]].some((c) => parseScore(c) !== "");
}

// winner text might be in col 8 or 9 depending on who edited the sheet last 
function getWinner(row) {
  for (let c = IDX_WINNER; c <= IDX_WINNER + 2; c++) {
    const val = row[c] != null ? String(row[c]).trim() : "";
    if (val && !/^\d+$/.test(val)) return val;
  }
  return "";
}

const INITIAL_VISIBLE_ROWS = 12;

function ScoreboardTable({ rows }) {
  const [sidebar, setSidebar] = useState(null); // { eventName, winner } when you click a row
  const [showAllRows, setShowAllRows] = useState(false);

  if (!rows || rows.length === 0) return null;
  const isSpiritTotalRow = (row) =>
    String(row[0] ?? "").toUpperCase().includes("SPIRIT WEEK TOTALS") &&
    row[1] != null && !isNaN(parseInt(String(row[1]), 10));
  const withoutSpiritTotal = rows.filter((r) => !isSpiritTotalRow(r));
  const headerRow = withoutSpiritTotal.find(isHeaderRow);
  const dataRows = headerRow
    ? withoutSpiritTotal.slice(withoutSpiritTotal.indexOf(headerRow) + 1)
    : withoutSpiritTotal;
  const effectiveRows = headerRow ? dataRows : withoutSpiritTotal;
  const visibleRows = showAllRows ? effectiveRows : effectiveRows.slice(0, INITIAL_VISIBLE_ROWS);
  const hasMore = effectiveRows.length > INITIAL_VISIBLE_ROWS;

  const renderRow = (row, idx) => {
    const label = String(row[0] ?? "").trim();
    const date = String(row[1] ?? "").trim();
    const ptsPoss = row[2] != null ? String(row[2]).trim() : "";
    const fr = parseScore(row[IDX_FR]);
    const so = parseScore(row[IDX_SO]);
    const jr = parseScore(row[IDX_JR]);
    const sr = parseScore(row[IDX_SR]);
    const winner = getWinner(row);
    if (!label && !date && fr === "" && so === "" && jr === "" && sr === "") return null;
    if (isHeaderRow(row)) return null;

    const totalClass = isTotalRow(row) ? "scoreboard-row-total" : "";
    const sectionClass = isSectionRow(row) && !totalClass ? "scoreboard-row-section" : "";
    const isEvent = isEventRow(row);
    const hasWinner = !!winner;

    return (
      <tr key={idx} className={`${totalClass} ${sectionClass}`.trim()}>
        <td>{label}</td>
        <td>{date}</td>
        <td>{ptsPoss}</td>
        <td className="score-cell">{fr !== "" ? fr : "-"}</td>
        <td className="score-cell">{so !== "" ? so : "-"}</td>
        <td className="score-cell">{jr !== "" ? jr : "-"}</td>
        <td className="score-cell">{sr !== "" ? sr : "-"}</td>
        <td className="scoreboard-arrow-cell">
          {isEvent && hasWinner ? (
            <button
              type="button"
              className="scoreboard-arrow-btn"
              onClick={() => setSidebar({ eventName: label, winner })}
              title="View winner(s)"
              aria-label={`View winner for ${label}`}
            >
              ▶
            </button>
          ) : (
            "-"
          )}
        </td>
      </tr>
    );
  };

  return (
    <>
      <table className="cardinalympics-scoreboard-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Date</th>
            <th>Pts poss.</th>
            <th className="score-cell">Fr</th>
            <th className="score-cell">So</th>
            <th className="score-cell">Jr</th>
            <th className="score-cell">Sr</th>
            <th className="scoreboard-arrow-header"></th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, idx) => renderRow(row, idx))}
        </tbody>
      </table>
      {hasMore && (
        <button
          type="button"
          className="cardinalympics-scoreboard-show-more"
          onClick={() => setShowAllRows(!showAllRows)}
        >
          {showAllRows ? "Show fewer" : `Show more (${effectiveRows.length - INITIAL_VISIBLE_ROWS} more)`}
        </button>
      )}
      {sidebar && (
        <>
          <div
            className="cardinalympics-sidebar-backdrop"
            onClick={() => setSidebar(null)}
            onKeyDown={(e) => e.key === "Escape" && setSidebar(null)}
            role="button"
            tabIndex={-1}
            aria-label="Close sidebar"
          />
          <aside className="cardinalympics-winner-sidebar" aria-label="Winner details">
            <div className="cardinalympics-winner-sidebar-header">
              <h3>Winner(s)</h3>
              <button
                type="button"
                className="cardinalympics-winner-sidebar-close"
                onClick={() => setSidebar(null)}
                aria-label="Close"
              >
                x
              </button>
            </div>
            <p className="cardinalympics-winner-sidebar-event">{sidebar.eventName}</p>
            <p className="cardinalympics-winner-sidebar-winner">{sidebar.winner || "-"}</p>
          </aside>
        </>
      )}
    </>
  );
}

function CardinalympicsEventsSchedule({ events }) {
  const weekGroups = useMemo(() => groupCardinalympicsEventsByWeekAndDay(events || []), [events]);

  if (!events || events.length === 0) {
    return (
      <p className="cardinalympics-events-empty">
        Event listings will appear here when the &quot;Cardinalympics Events&quot; sheet is available.
      </p>
    );
  }

  return (
    <>
      {weekGroups.map((weekGroup, weekIndex) => (
        <section className="cardinalympics-week" key={`${weekGroup.weekLabel}-${weekIndex}`}>
          <h3 className="cardinalympics-week__title">{weekGroup.weekLabel}</h3>
          {weekGroup.days.map((dayGroup, dayIndex) => (
            <div className="cardinalympics-day" key={`${weekGroup.weekLabel}-${dayGroup.dayLabel}-${dayIndex}`}>
              <h4 className="cardinalympics-day__title">{dayGroup.dayLabel}</h4>
              <div className="cardinalympics-day__events">
                {dayGroup.events.map((ev) => (
                  <div className="event cardinalympics-event" key={ev.id}>
                    <div className="cardinalympics-event__head">
                      <h3 className="event-description">{ev.heading}</h3>
                      {ev.pointsPossible ? (
                        <span className="cardinalympics-event__points-tag">
                          {ev.pointsPossible} pts possible
                        </span>
                      ) : null}
                    </div>
                    {ev.dateDisplay ? (
                      <p className="event-description">
                        <strong>Date:</strong> {ev.dateDisplay}
                      </p>
                    ) : null}
                    {ev.bodyText ? (
                      <div className="event-description cardinalympics-event__body">{ev.bodyText}</div>
                    ) : null}
                    {ev.signUpClosed || isCardinalympicsSignupPastEventDay(ev) ? (
                      <button
                        type="button"
                        className="event-description cardinalympics-event-closed"
                        disabled
                        aria-label={`${ev.heading} sign up is closed`}
                      >
                        <strong>Closed</strong>
                      </button>
                    ) : ev.signUpLink ? (
                      <a
                        className="event-description"
                        href={ev.signUpLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <strong>Sign up</strong>
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </>
  );
}

export default function Cardinalympics({
  cardinalympicsData,
  scoreboardRows = [],
  cardinalympicsEvents = [],
  showScoresAndScoreboard = true,
  showEvents = true,
}) {
  const spiritTotals = [0, 1, 2, 3].map((i) => {
    const n = Number(cardinalympicsData?.[i]);
    return Number.isFinite(n) ? n : 0;
  });
  const leaderIndex =
    spiritTotals.length === 4
      ? spiritTotals.indexOf(Math.max(...spiritTotals))
      : -1;

  return (
    <div className="cardinalympics-page">
      {showScoresAndScoreboard && (
      <section
        className="home-cardinalympics cardinalympics-spirit-scores-only"
        aria-labelledby="cardinalympics-points-cap"
      >
        <div className="home-cardinalympics__inner">
          <div className="cardinalympics-spirit-card">
            <div className="cardinalympics-spirit-card__cap" id="cardinalympics-points-cap">
              <span className="cardinalympics-spirit-card__cap-number">
                {POINTS_POSSIBLE.toLocaleString()}
              </span>
              <span className="cardinalympics-spirit-card__cap-label">points possible</span>
            </div>
            <div className="home-cardinalympics__grid" role="list">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={CLASS_SLUGS[i]}
                  className={`home-cardinalympics__class home-cardinalympics__class--${CLASS_SLUGS[i]}${
                    leaderIndex === i ? " home-cardinalympics__class--leader" : ""
                  }`}
                  role="listitem"
                >
                  {leaderIndex === i && (
                    <span className="home-cardinalympics__leader-badge">Leading</span>
                  )}
                  <span className="home-cardinalympics__class-name">{CLASS_NAMES[i]}</span>
                  <div className="home-cardinalympics__points">
                    <Counter
                      start={0}
                      end={spiritTotals[i]}
                      duration={2000}
                      className="home-cardinalympics__counter"
                      color={COUNTER_COLORS[i]}
                    />
                    <span className="home-cardinalympics__pts-label">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}
      {showScoresAndScoreboard && scoreboardRows.length > 0 && (
        <div className="cardinalympics-scoreboard" id="detailed-scoreboard">
          <h2>Detailed scoreboard</h2>
          <div className="cardinalympics-scoreboard-table-wrap">
            <ScoreboardTable rows={scoreboardRows} />
          </div>
        </div>
      )}
      {showEvents && (
      <section className="cardinalympics-content info-page">
          <CardinalympicsEventsSchedule events={cardinalympicsEvents} />
      </section>
      )}
    </div>
  );
}

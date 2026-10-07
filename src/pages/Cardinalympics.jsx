/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Counter from "../components/Counter";
import CardinalympicLogo from "../components/CardinalympicLogo";
import {
  groupCardinalympicsEventsByWeekAndDay,
  isCardinalympicsSignupPastEventDay,
} from "../utils/cardinalympicsEventsFromSheet";
import {
  cardinalympicsIsResultsMode,
  cardinalympicsLeaderBadgeLabel,
} from "../utils/cardinalympicsDisplayMode.js";
import "./Cardinalympics.scss";

const CLASS_NAMES = ["Freshman", "Sophomore", "Junior", "Senior"];
const CLASS_SLUGS = ["freshman", "sophomore", "junior", "senior"];
const COUNTER_COLORS = ["#2e7d32", "#6a1b9a", "#1565c0", "#9c1919"];
const POINTS_POSSIBLE_FALLBACK = 9750;
const EMPTY_ROWS = [];

// turn a cell value into a number or bail with empty string (sheet data is messy)
function parseScore(val) {
  if (val == null || val === "") return "";
  const n = parseInt(String(val).replace(/[^0-9-]/g, ""), 10);
  return isNaN(n) ? "" : n;
}

/** Sum "Pts poss." (col 2) for leaf event rows (skip headers and any row whose label includes TOTAL). */
function sumPointsPossibleFromEventRows(rows) {
  if (!Array.isArray(rows)) return 0;
  let sum = 0;
  for (const row of rows) {
    if (!row || row.length < 3) continue;
    if (isHeaderRow(row)) continue;
    const label0 = String(row[0] ?? "").toUpperCase();
    if (label0.includes("TOTAL")) continue;
    const pts = parseScore(row[2]);
    if (pts !== "" && pts > 0) sum += pts;
  }
  return sum;
}

function getPointsPossibleFromRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0)
    return POINTS_POSSIBLE_FALLBACK;

  const fromEvents = sumPointsPossibleFromEventRows(
    filterDisplayScoreboardRows(rows),
  );
  if (fromEvents > 0) return fromEvents;

  return POINTS_POSSIBLE_FALLBACK;
}

// is this row the header row? (Date, Points Poss., etc.)
function isHeaderRow(row) {
  if (!row) return false;
  const first = String(row[0] ?? "")
    .toLowerCase()
    .trim();
  const second = String(row[1] ?? "")
    .toLowerCase()
    .trim();
  const third = String(row[2] ?? "")
    .toLowerCase()
    .trim();
  const classCols = [4, 5, 6, 7].map((i) =>
    String(row[i] ?? "")
      .toLowerCase()
      .trim(),
  );
  const looksLikeClassHeader = classCols.some(
    (v) => v === "29" || v === "28" || v === "27" || v === "26",
  );
  return (
    first.includes("date") ||
    second.includes("points") ||
    third.includes("points") ||
    (first.includes("points") && second.includes("poss")) ||
    (second.includes("date") && third.includes("points")) ||
    looksLikeClassHeader
  );
}

// "TOTAL" row at the bottom - we skip or style it different
function isTotalRow(row) {
  const label = String(row[0] ?? "").toUpperCase();
  return label.includes("TOTAL") && !label.includes("EVENTS TOTAL");
}

function rowLabelUpper(row) {
  return String(row?.[0] ?? "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

function isEnableLiveCountRow(row) {
  return rowLabelUpper(row).includes("ENABLE LIVE COUNT");
}

function isPointCompensationRow(row) {
  return rowLabelUpper(row).includes("POINT COMPENSATION");
}

function isFridayRallyTotalsRow(row) {
  return rowLabelUpper(row).includes("FRIDAY RALLY COMPETITIONS TOTALS");
}

function isSpiritWeekTotalsRow(row) {
  return rowLabelUpper(row) === "SPIRIT WEEK TOTALS";
}

/**
 * Public scoreboard: everything through Friday Rally Competitions Totals,
 * then only the final SPIRIT WEEK TOTALS row (hide Point Compensation, etc.).
 */
function filterDisplayScoreboardRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  const headerIndex = rows.findIndex(isHeaderRow);
  const start = headerIndex >= 0 ? headerIndex + 1 : 0;

  let fridayIdx = -1;
  let spiritIdx = -1;
  for (let i = start; i < rows.length; i++) {
    if (isFridayRallyTotalsRow(rows[i])) fridayIdx = i;
    if (isSpiritWeekTotalsRow(rows[i])) spiritIdx = i;
  }

  const keepRow = (row) => {
    if (!row) return false;
    if (isEnableLiveCountRow(row) || isPointCompensationRow(row)) return false;
    const label = rowLabelUpper(row);
    if (!label && !(row[1] || row[2] || row[IDX_FR])) return false;
    return true;
  };

  if (fridayIdx < 0) {
    return rows.slice(start).filter(keepRow);
  }

  const main = rows.slice(start, fridayIdx + 1).filter(keepRow);
  if (spiritIdx > fridayIdx) {
    main.push(rows[spiritIdx]);
  }
  return main;
}

// sheet columns: Freshman Soph Junior Senior scores then winner. layout is kinda weird but here we are
const IDX_FR = 4;
const IDX_SO = 5;
const IDX_JR = 6;
const IDX_SR = 7;
const IDX_WINNER = 8;

// Historical strength: seniors have always won, then juniors, sophomores, freshmen.
// Kept mild so a full week of remaining points can still reshuffle the race.
const HISTORICAL_STRENGTH = [1, 1.2, 1.45, 1.75];
const DEFAULT_DAILY_EVENT_PTS = 300;
const DEFAULT_WEEKLONG_EVENT_PTS = 400;
const DEFAULT_FRIDAY_RALLY_EVENT_PTS = 400;
const CHANCE_SMOOTHING_ALPHA = 12;

// Place payout from "pts possible" (matches typical 300 / 200 / 100 / 0 events).
function placePointsFromPossible(ptsPossible) {
  const pts = Math.max(0, Number(ptsPossible) || 0);
  return [pts, Math.round((pts * 2) / 3), Math.round(pts / 3), 0];
}

function isSectionHeaderLabel(label) {
  const u = String(label ?? "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
  if (!u || u.includes("TOTAL")) return false;
  if (u.startsWith("SHORTER DAILY EVENTS")) return true;
  if (u.startsWith("WEEK-LONG")) return true;
  if (u === "FRIDAY RALLY COMPETITIONS") return true;
  return false;
}

function sectionContextFromLabel(label) {
  const u = String(label ?? "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
  if (u.startsWith("WEEK-LONG")) return "weeklong";
  if (u.startsWith("FRIDAY RALLY")) return "friday";
  return "daily";
}

function estimateEventPointsPossible(row, sectionContext) {
  const explicit = parseScore(row?.[2]);
  if (explicit !== "" && explicit > 0) return explicit;
  if (sectionContext === "weeklong") return DEFAULT_WEEKLONG_EVENT_PTS;
  if (sectionContext === "friday") return DEFAULT_FRIDAY_RALLY_EVENT_PTS;
  return DEFAULT_DAILY_EVENT_PTS;
}

// section headers like "Shorter Daily Events" - no scores, just a label
function isSectionRow(row) {
  return isSectionHeaderLabel(String(row?.[0] ?? "").trim());
}

// real event row = has at least one class score
function isEventRow(row) {
  if (!row || row.length < 8) return false;
  return [row[IDX_FR], row[IDX_SO], row[IDX_JR], row[IDX_SR]].some(
    (c) => parseScore(c) !== "",
  );
}

// winner text might be in col 8 or 9 depending on who edited the sheet last
function getWinner(row) {
  for (let c = IDX_WINNER; c <= IDX_WINNER + 2; c++) {
    const val = row[c] != null ? String(row[c]).trim() : "";
    if (val && !/^\d+$/.test(val)) return val;
  }
  return "";
}

function splitWinnerNames(winner) {
  return String(winner || "")
    .split(/\r?\n|[;|•]|,(?=\s|$)/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function isCancelledStatus(value) {
  const s = String(value ?? "")
    .trim()
    .toLowerCase();
  return s === "cancelled" || s === "canceled";
}

function normalizeEventMatchKey(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Map normalized scoreboard event labels → winner text (for graying event cards). */
function buildScoreboardWinnerLookup(rows) {
  const lookup = new Map();
  for (const row of filterDisplayScoreboardRows(rows)) {
    if (!row || isHeaderRow(row) || isSectionRow(row) || isTotalRow(row))
      continue;
    if (!isEventRow(row) && !getWinner(row)) continue;
    const label = String(row[0] ?? "").trim();
    const key = normalizeEventMatchKey(label);
    if (!key) continue;
    const winner = getWinner(row);
    if (!winner) continue;
    lookup.set(key, {
      winner,
      isCancelled: isCancelledStatus(winner),
    });
  }
  return lookup;
}

function lookupEventWinner(ev, winnerLookup) {
  if (!winnerLookup?.size) return null;
  const candidates = [ev?.heading, ev?.name]
    .map(normalizeEventMatchKey)
    .filter(Boolean);
  for (const key of candidates) {
    if (winnerLookup.has(key)) return winnerLookup.get(key);
  }
  // Soft match: "Bead Game" ↔ "Bead Games"
  for (const key of candidates) {
    const alt = key.endsWith("s") ? key.slice(0, -1) : `${key}s`;
    if (winnerLookup.has(alt)) return winnerLookup.get(alt);
  }
  return null;
}

function getRowViewModel(row) {
  const label = String(row[0] ?? "").trim();
  const date = String(row[1] ?? "").trim();
  const ptsPoss = row[2] != null ? String(row[2]).trim() : "";
  const fr = parseScore(row[IDX_FR]);
  const so = parseScore(row[IDX_SO]);
  const jr = parseScore(row[IDX_JR]);
  const sr = parseScore(row[IDX_SR]);
  const winner = getWinner(row);
  if (!label && !date && fr === "" && so === "" && jr === "" && sr === "")
    return null;
  if (isHeaderRow(row)) return null;

  const totalClass = isTotalRow(row) ? "scoreboard-row-total" : "";
  const sectionClass =
    isSectionRow(row) && !totalClass ? "scoreboard-row-section" : "";
  const grandClass = isSpiritWeekTotalsRow(row) ? "scoreboard-row-grand" : "";
  const scoreTone = sectionClass
    ? ""
    : grandClass
      ? "score-tone-strong"
      : "score-tone-light";
  return {
    key: `${label}-${date}-${ptsPoss}`,
    label,
    date,
    ptsPoss,
    fr,
    so,
    jr,
    sr,
    winner,
    totalClass,
    sectionClass,
    grandClass,
    scoreTone,
    isEvent: isEventRow(row),
    hasWinner: Boolean(winner),
    isCancelled: isCancelledStatus(winner),
  };
}

const INITIAL_VISIBLE_ROWS = 12;
const CHANCE_SIMULATION_RUNS = 5000;

function hashStringSeed(input) {
  let h = 2166136261;
  const s = String(input ?? "");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeSeededRandom(seed) {
  let x = seed >>> 0;
  return () => {
    x = (1664525 * x + 1013904223) >>> 0;
    return x / 4294967296;
  };
}

function ScoreboardTable({ rows }) {
  const [sidebar, setSidebar] = useState(null); // { eventName, winner } when you click a row
  const [showAllRows, setShowAllRows] = useState(false);

  const { visibleRowModels, hasMore, hiddenRowCount } = useMemo(() => {
    if (!rows?.length) {
      return { visibleRowModels: [], hasMore: false, hiddenRowCount: 0 };
    }
    const effectiveRows = filterDisplayScoreboardRows(rows);
    const models = effectiveRows.reduce((list, row) => {
      const model = getRowViewModel(row);
      if (model) list.push(model);
      return list;
    }, []);
    const totalsIndex = models.findIndex((model) => model.grandClass);
    const totals = totalsIndex >= 0 ? models[totalsIndex] : null;
    const withoutTotals =
      totalsIndex >= 0
        ? models.filter((_, index) => index !== totalsIndex)
        : models;
    const preview = withoutTotals.slice(0, INITIAL_VISIBLE_ROWS);
    return {
      visibleRowModels: showAllRows
        ? models
        : totals
          ? [...preview, totals]
          : preview,
      hasMore: withoutTotals.length > INITIAL_VISIBLE_ROWS,
      hiddenRowCount: Math.max(0, withoutTotals.length - INITIAL_VISIBLE_ROWS),
    };
  }, [rows, showAllRows]);

  if (!rows?.length) return null;

  const renderRow = (view) => {
    return (
      <tr
        key={view.key}
        className={
          `${view.totalClass} ${view.sectionClass} ${view.grandClass} ${view.scoreTone}`.trim()
        }
      >
        <td>{view.label}</td>
        <td>{view.date}</td>
        <td>{view.ptsPoss}</td>
        <td className="score-cell score-cell--fr">
          {view.fr !== "" ? view.fr : "-"}
        </td>
        <td className="score-cell score-cell--so">
          {view.so !== "" ? view.so : "-"}
        </td>
        <td className="score-cell score-cell--jr">
          {view.jr !== "" ? view.jr : "-"}
        </td>
        <td className="score-cell score-cell--sr">
          {view.sr !== "" ? view.sr : "-"}
        </td>
        <td className="scoreboard-arrow-cell">
          {view.isCancelled ? (
            "Cancelled"
          ) : view.isEvent && view.hasWinner ? (
            <button
              type="button"
              className="scoreboard-arrow-btn"
              onClick={() =>
                setSidebar({ eventName: view.label, winner: view.winner })
              }
              title="View winner(s)"
              aria-label={`View winner for ${view.label}`}
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

  const toggleShowAllRows = () => {
    const y = window.scrollY;
    setShowAllRows((prev) => !prev);
    requestAnimationFrame(() => {
      window.scrollTo(0, y);
    });
  };

  return (
    <>
      <div className="cardinalympics-scoreboard-table-wrap">
        <table className="cardinalympics-scoreboard-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Pts poss.</th>
              <th className="score-cell score-cell--fr">Fr</th>
              <th className="score-cell score-cell--so">So</th>
              <th className="score-cell score-cell--jr">Jr</th>
              <th className="score-cell score-cell--sr">Sr</th>
              <th className="scoreboard-arrow-header"></th>
            </tr>
          </thead>
          <tbody>{visibleRowModels.map(renderRow)}</tbody>
        </table>
        <div className="cardinalympics-scoreboard-mobile-list">
          {visibleRowModels.map((view) => {
            return (
              <article
                key={view.key}
                className={`scoreboard-mobile-card ${view.totalClass} ${view.sectionClass} ${view.grandClass} ${view.scoreTone}`.trim()}
              >
                <h4 className="scoreboard-mobile-card__title">
                  {view.label || "Event"}
                </h4>
                <div className="scoreboard-mobile-card__meta">
                  <span>
                    <strong>Date:</strong> {view.date || "-"}
                  </span>
                  <span>
                    <strong>Pts poss.:</strong> {view.ptsPoss || "-"}
                  </span>
                </div>
                <div className="scoreboard-mobile-card__scores">
                  <span className="scoreboard-mobile-card__score-pill scoreboard-mobile-card__score-pill--fr">
                    <strong>Fr</strong> {view.fr !== "" ? view.fr : "-"}
                  </span>
                  <span className="scoreboard-mobile-card__score-pill scoreboard-mobile-card__score-pill--so">
                    <strong>So</strong> {view.so !== "" ? view.so : "-"}
                  </span>
                  <span className="scoreboard-mobile-card__score-pill scoreboard-mobile-card__score-pill--jr">
                    <strong>Jr</strong> {view.jr !== "" ? view.jr : "-"}
                  </span>
                  <span className="scoreboard-mobile-card__score-pill scoreboard-mobile-card__score-pill--sr">
                    <strong>Sr</strong> {view.sr !== "" ? view.sr : "-"}
                  </span>
                </div>
                <div className="scoreboard-mobile-card__winner">
                  {view.isCancelled ? (
                    <strong>Cancelled</strong>
                  ) : view.isEvent && view.hasWinner ? (
                    <button
                      type="button"
                      className="scoreboard-mobile-card__winner-btn"
                      onClick={() =>
                        setSidebar({
                          eventName: view.label,
                          winner: view.winner,
                        })
                      }
                      aria-label={`View winner for ${view.label}`}
                    >
                      View winner(s)
                    </button>
                  ) : (
                    <span>
                      <strong>Winner:</strong> -
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
      {hasMore && (
        <button
          type="button"
          className="cardinalympics-scoreboard-show-more"
          onClick={toggleShowAllRows}
        >
          {showAllRows ? "Show fewer" : `Show more (${hiddenRowCount} more)`}
        </button>
      )}
      {sidebar &&
        createPortal(
          <div className="cardinalympics-winner-modal" role="presentation">
            <button
              type="button"
              className="cardinalympics-winner-modal__backdrop"
              onClick={() => setSidebar(null)}
              aria-label="Close winners"
            />
            <div
              className="cardinalympics-winner-modal__dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cardinalympics-winner-modal-title"
            >
              <button
                type="button"
                className="cardinalympics-winner-modal__close"
                onClick={() => setSidebar(null)}
                aria-label="Close"
              >
                ×
              </button>
              <p className="cardinalympics-winner-modal__eyebrow">Winner(s)</p>
              <h3
                id="cardinalympics-winner-modal-title"
                className="cardinalympics-winner-modal__event"
              >
                {sidebar.eventName}
              </h3>
              <ul className="cardinalympics-winner-modal__names">
                {(() => {
                  const names = splitWinnerNames(sidebar.winner);
                  return (names.length ? names : ["-"]).map((name, i) => (
                    <li key={`${name}-${i}`}>{name}</li>
                  ));
                })()}
              </ul>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function effectiveHistoricalStrength(baseTotals, pendingEvents) {
  const remainingFirst = pendingEvents.reduce(
    (sum, ev) => sum + (ev.places[0] || 0),
    0,
  );
  const lead = Math.max(...baseTotals) - Math.min(...baseTotals);
  // When lots of points remain vs the current gap, flatten class priors.
  const uncertainty =
    remainingFirst <= 0
      ? 0
      : Math.min(1, remainingFirst / (remainingFirst + Math.max(lead, 1)));
  return HISTORICAL_STRENGTH.map(
    (weight) => 1 + (weight - 1) * (1 - uncertainty * 0.9),
  );
}

function weightedFinishOrder(classIndexes, rand, strengths) {
  const remaining = classIndexes.map((i) => ({
    i,
    weight: strengths[i] ?? 1,
  }));
  const order = [];
  while (remaining.length) {
    const total = remaining.reduce((sum, item) => sum + item.weight, 0);
    let pick = rand() * total;
    let chosen = remaining.length - 1;
    for (let r = 0; r < remaining.length; r++) {
      pick -= remaining[r].weight;
      if (pick <= 0) {
        chosen = r;
        break;
      }
    }
    order.push(remaining[chosen].i);
    remaining.splice(chosen, 1);
  }
  return order;
}

function nearestOpenPlace(score, places, taken) {
  let best = -1;
  let bestDiff = Infinity;
  for (let p = 0; p < places.length; p++) {
    if (taken.has(p)) continue;
    const diff = Math.abs(places[p] - score);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = p;
    }
  }
  return best;
}

function collectPendingEvents(rows) {
  const pending = [];
  const displayRows = filterDisplayScoreboardRows(rows);
  let sectionContext = "daily";

  for (const row of displayRows) {
    if (!row || isHeaderRow(row)) continue;
    const label = String(row[0] ?? "").trim();
    if (!label) continue;

    if (isSectionHeaderLabel(label)) {
      sectionContext = sectionContextFromLabel(label);
      continue;
    }
    if (isTotalRow(row) || isSpiritWeekTotalsRow(row) || isFridayRallyTotalsRow(row))
      continue;
    if (isEnableLiveCountRow(row) || isPointCompensationRow(row)) continue;
    if (isCancelledStatus(getWinner(row))) continue;

    const scores = [
      parseScore(row[IDX_FR]),
      parseScore(row[IDX_SO]),
      parseScore(row[IDX_JR]),
      parseScore(row[IDX_SR]),
    ];
    const missingClassIndexes = scores
      .map((s, i) => ({ s, i }))
      .filter((x) => x.s === "")
      .map((x) => x.i);
    if (!missingClassIndexes.length) continue;

    // Sheet often leaves pts blank until scored — still count the event using
    // typical payouts so early-week projections stay uncertain.
    const ptsPossible = estimateEventPointsPossible(row, sectionContext);
    if (ptsPossible <= 0) continue;

    pending.push({
      ptsPossible,
      scores,
      missingClassIndexes,
      places: placePointsFromPossible(ptsPossible),
    });
  }
  return pending;
}

function simulatePendingOntoTotals(baseTotals, pendingEvents, rand, strengths) {
  const simulated = [...baseTotals];
  for (const ev of pendingEvents) {
    const takenPlaces = new Set();
    for (let i = 0; i < 4; i++) {
      if (ev.scores[i] === "") continue;
      const place = nearestOpenPlace(ev.scores[i], ev.places, takenPlaces);
      if (place >= 0) takenPlaces.add(place);
    }

    const openPlaces = ev.places
      .map((pts, place) => ({ pts, place }))
      .filter((item) => !takenPlaces.has(item.place))
      .map((item) => item.pts);

    const order = weightedFinishOrder(
      ev.missingClassIndexes,
      rand,
      strengths,
    );
    for (let rank = 0; rank < order.length; rank++) {
      simulated[order[rank]] += openPlaces[rank] ?? 0;
    }
  }
  return simulated;
}

function chancesFromWinCounts(wins, runs) {
  const denom = runs + CHANCE_SMOOTHING_ALPHA * 4;
  return wins.map((w) => ((w + CHANCE_SMOOTHING_ALPHA) / denom) * 100);
}

function calculateWinningChances(spiritTotals, rows, seedInput = "") {
  const baseTotals = [0, 1, 2, 3].map((i) => {
    const n = Number(spiritTotals?.[i]);
    return Number.isFinite(n) ? n : 0;
  });

  const pendingEvents = collectPendingEvents(rows);
  const strengths = effectiveHistoricalStrength(baseTotals, pendingEvents);
  const rand = makeSeededRandom(hashStringSeed(seedInput));
  const wins = [0, 0, 0, 0];

  if (!pendingEvents.length) {
    // Truly finished: share among current leaders (no fake 99% from prior).
    const max = Math.max(...baseTotals);
    const leaders = baseTotals
      .map((v, i) => ({ v, i }))
      .filter((x) => x.v === max);
    const share = leaders.length ? 1 / leaders.length : 0;
    const rawWins = [0, 1, 2, 3].map((i) =>
      leaders.some((l) => l.i === i) ? share * CHANCE_SIMULATION_RUNS : 0,
    );
    return chancesFromWinCounts(rawWins, CHANCE_SIMULATION_RUNS);
  }

  for (let run = 0; run < CHANCE_SIMULATION_RUNS; run++) {
    const simulated = simulatePendingOntoTotals(
      baseTotals,
      pendingEvents,
      rand,
      strengths,
    );
    const maxScore = Math.max(...simulated);
    const winners = simulated
      .map((score, i) => ({ score, i }))
      .filter((x) => x.score === maxScore)
      .map((x) => x.i);
    const split = 1 / winners.length;
    for (const i of winners) wins[i] += split;
  }

  return chancesFromWinCounts(wins, CHANCE_SIMULATION_RUNS);
}

function WinningChancesBar({ chances }) {
  const [progress, setProgress] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0,
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    const delay = 160;
    const duration = 700;
    let frame;
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start - delay) / duration));
      setProgress(1 - (1 - t) ** 3);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="cardinalympics-winning-chances"
      role="region"
      aria-labelledby="cardinalympics-winning-chances-heading"
    >
      <h3 id="cardinalympics-winning-chances-heading">
        Projected winning chances
      </h3>
      <div className="cardinalympics-winning-chances__rows">
        {CLASS_NAMES.map((name, i) => {
          const pct = progress >= 1 ? chances[i] : chances[i] * progress;
          return (
            <div className="cardinalympics-winning-chances__row" key={name}>
              <div className="cardinalympics-winning-chances__label-wrap">
                <span
                  className={`cardinalympics-winning-chances__dot cardinalympics-winning-chances__dot--${CLASS_SLUGS[i]}`}
                />
                <span className="cardinalympics-winning-chances__label">
                  {name}
                </span>
                <span className="cardinalympics-winning-chances__value">
                  {pct.toFixed(1)}%
                </span>
              </div>
              <div
                className="cardinalympics-winning-chances__track"
                aria-hidden="true"
              >
                <div
                  className={`cardinalympics-winning-chances__fill cardinalympics-winning-chances__fill--${CLASS_SLUGS[i]}`}
                  style={{
                    width: `${Math.max(0, Math.min(100, pct))}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function scheduleEventView(ev, winnerLookup) {
  const result = lookupEventWinner(ev, winnerLookup);
  const completed = Boolean(result);
  const expired =
    ev.signUpClosed || isCardinalympicsSignupPastEventDay(ev);
  return {
    result,
    formClosed: completed || expired,
  };
}

function compareOpenScheduleEvents(a, b) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const rank = (ev) => {
    const start = ev.sortDate ? new Date(ev.sortDate).setHours(0, 0, 0, 0) : null;
    if (start != null && start >= todayMs) return [0, start];
    if (start != null) return [1, start];
    return [2, 0];
  };
  const ra = rank(a);
  const rb = rank(b);
  return ra[0] - rb[0] || ra[1] - rb[1];
}

function CardinalympicsEventsSchedule({ events, winnerLookup }) {
  const { upcomingEvents, weekGroups } = useMemo(() => {
    const list = events || [];
    const upcoming = list.filter(
      (ev) => !scheduleEventView(ev, winnerLookup).formClosed,
    );
    upcoming.sort(compareOpenScheduleEvents);
    return {
      upcomingEvents: upcoming,
      weekGroups: groupCardinalympicsEventsByWeekAndDay(list),
    };
  }, [events, winnerLookup]);

  if (!events || events.length === 0) {
    return (
      <p className="cardinalympics-events-empty">
        Event listings will appear here when the &quot;Cardinalympics
        Events&quot; sheet is available.
      </p>
    );
  }

  const renderEvent = (ev, keyPrefix) => {
    const { result, formClosed } = scheduleEventView(ev, winnerLookup);
    return (
      <div
        className={`event cardinalympics-event${
          formClosed ? " cardinalympics-event--resolved" : ""
        }`}
        key={`${keyPrefix}-${ev.id}`}
      >
        <div className="cardinalympics-event__head">
          <h3 className="event-description">{ev.heading}</h3>
          {ev.pointsPossible ? (
            <span className="cardinalympics-event__points-tag">
              {ev.pointsPossible} pts possible
            </span>
          ) : null}
        </div>
        {ev.dateDisplay ? (
          <p className="event-description cardinalympics-event__meta">
            <strong>Date:</strong> {ev.dateDisplay}
          </p>
        ) : null}
        {formClosed && result && !result.isCancelled ? (
          <p className="event-description cardinalympics-event__meta cardinalympics-event__winner">
            <strong>Winner:</strong> {result.winner}
          </p>
        ) : null}
        {ev.bodyText ? (
          <div className="event-description cardinalympics-event__body">
            {String(ev.bodyText)
              .replace(/\n{3,}/g, "\n\n")
              .trim()}
          </div>
        ) : null}
        {!formClosed && ev.signUpLink ? (
          <a
            className="event-description cardinalympics-event-signup"
            href={ev.signUpLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Sign up
          </a>
        ) : null}
      </div>
    );
  };

  return (
    <>
      {upcomingEvents.length > 0 && (
        <div className="cardinalympics-day">
          <h4 className="cardinalympics-day__title">Upcoming</h4>
          <div className="cardinalympics-day__events">
            {upcomingEvents.map((ev) => renderEvent(ev, "upcoming"))}
          </div>
        </div>
      )}
      {weekGroups.map((weekGroup, weekIndex) => (
        <div
          className="cardinalympics-week"
          key={`${weekGroup.weekLabel}-${weekIndex}`}
        >
          {weekGroup.weekLabel ? (
            <h3 className="cardinalympics-week__title">{weekGroup.weekLabel}</h3>
          ) : null}
          {weekGroup.days.map((dayGroup, dayIndex) => (
            <div
              className="cardinalympics-day"
              key={`${weekGroup.weekLabel}-${dayGroup.dayLabel}-${dayIndex}`}
            >
              <h4 className="cardinalympics-day__title">{dayGroup.dayLabel}</h4>
              <div className="cardinalympics-day__events">
                {dayGroup.events.map((ev) => renderEvent(ev, "all"))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default function Cardinalympics({
  cardinalympicsData,
  scoreboardRows = EMPTY_ROWS,
  cardinalympicsEvents = EMPTY_ROWS,
  showScoresAndScoreboard = true,
  showScoreBreakdown = true,
  showWinningChances = true,
  showEvents = true,
  cardinalympicsDisplayMode = "activeGame",
}) {
  const spiritTotals = useMemo(
    () =>
      [0, 1, 2, 3].map((index) => {
        const score = Number(cardinalympicsData?.[index]);
        return Number.isFinite(score) ? score : 0;
      }),
    [cardinalympicsData],
  );
  const leaderIndex =
    spiritTotals.length === 4
      ? spiritTotals.indexOf(Math.max(...spiritTotals))
      : -1;
  const topClassBadge = cardinalympicsLeaderBadgeLabel(
    cardinalympicsDisplayMode,
  );
  const resultsMode = cardinalympicsIsResultsMode(cardinalympicsDisplayMode);
  const pointsPossible = useMemo(
    () => getPointsPossibleFromRows(scoreboardRows),
    [scoreboardRows],
  );
  const scoreUpdateKey = useMemo(() => {
    const totalsKey = spiritTotals.join("|");
    const rowsKey = (scoreboardRows || [])
      .map((row) =>
        [0, 2, IDX_FR, IDX_SO, IDX_JR, IDX_SR, IDX_WINNER]
          .map((i) => String(row?.[i] ?? "").trim())
          .join("~"),
      )
      .join("||");
    return `${totalsKey}###${rowsKey}`;
  }, [spiritTotals, scoreboardRows]);
  const winningChances = useMemo(
    () =>
      showScoresAndScoreboard && !resultsMode
        ? calculateWinningChances(spiritTotals, scoreboardRows, scoreUpdateKey)
        : [0, 0, 0, 0],
    [
      showScoresAndScoreboard,
      resultsMode,
      spiritTotals,
      scoreboardRows,
      scoreUpdateKey,
    ],
  );
  const [showProjectedBars, setShowProjectedBars] = useState(false);
  const eventWinnerLookup = useMemo(
    () => buildScoreboardWinnerLookup(scoreboardRows),
    [scoreboardRows],
  );

  return (
    <main className="cardinalympics-page">
      <header className="cardinalympics-page-header">
        <div className="cardinalympics-page-header__rings" aria-hidden="true">
          <CardinalympicLogo variant="homeBackdrop" />
        </div>
        <div className="cardinalympics-page-header__inner">
          <p className="cardinalympics-page-header__eyebrow">Spirit Week</p>
          <h1 className="cardinalympics-page-header__title">Cardinalympics</h1>
        </div>
      </header>

      {showScoresAndScoreboard && (
        <section
          className="home-cardinalympics cardinalympics-spirit-scores"
          aria-labelledby="cardinalympics-points-cap"
        >
          <div className="home-cardinalympics__inner">
            <div className="home-cardinalympics__content-wrap">
              <div className="home-cardinalympics__head-wrap">
                <div className="home-cardinalympics__intro">
                  <div
                    className="cardinalympics-spirit-cap"
                    id="cardinalympics-points-cap"
                  >
                    <span className="cardinalympics-spirit-cap__number">
                      {pointsPossible.toLocaleString()}
                    </span>
                    <div className="cardinalympics-spirit-cap__label-row">
                      <span className="cardinalympics-spirit-cap__label">
                        points possible
                      </span>
                      {!resultsMode && (
                        <span
                          className="home-cardinalympics__live"
                          role="status"
                          aria-label="Scores from the live scoreboard"
                        >
                          <span
                            className="home-cardinalympics__live-dot"
                            aria-hidden="true"
                          />
                          Live
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="home-cardinalympics__subtitle">
                    Spirit Week class totals
                  </p>
                </div>
              </div>
              <div className="home-cardinalympics__scores-wrap">
                <div
                  className="home-cardinalympics__rings-bg"
                  aria-hidden="true"
                >
                  <CardinalympicLogo variant="homeBackdrop" />
                </div>
                <div className="home-cardinalympics__grid" role="list">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={CLASS_SLUGS[i]}
                      className={`home-cardinalympics__class home-cardinalympics__class--${CLASS_SLUGS[i]}${
                        leaderIndex === i
                          ? " home-cardinalympics__class--leader"
                          : ""
                      }`}
                      role="listitem"
                    >
                      {leaderIndex === i && (
                        <span className="home-cardinalympics__leader-badge">
                          {topClassBadge}
                        </span>
                      )}
                      <span className="home-cardinalympics__class-name">
                        {CLASS_NAMES[i]}
                      </span>
                      <div className="home-cardinalympics__points">
                        <Counter
                          start={0}
                          end={spiritTotals[i]}
                          duration={2000}
                          className="home-cardinalympics__counter"
                          color={COUNTER_COLORS[i]}
                        />
                        <span className="home-cardinalympics__pts-label">
                          pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {showScoresAndScoreboard &&
        showScoreBreakdown &&
        scoreboardRows.length > 0 && (
          <section
            className="cardinalympics-scoreboard"
            id="detailed-scoreboard"
            aria-labelledby="cardinalympics-scoreboard-heading"
          >
            <div className="cardinalympics-section-heading">
              <p className="cardinalympics-section-heading__eyebrow">
                Standings
              </p>
              <h2 id="cardinalympics-scoreboard-heading">
                Detailed scoreboard
              </h2>
            </div>
            <ScoreboardTable rows={scoreboardRows} />
            {showWinningChances && !resultsMode && (
              <div className="cardinalympics-winning-chances-toggle-wrap">
                <button
                  type="button"
                  className="cardinalympics-winning-chances-toggle"
                  onClick={() => setShowProjectedBars((v) => !v)}
                  aria-expanded={showProjectedBars}
                  aria-controls="cardinalympics-winning-chances"
                >
                  {showProjectedBars
                    ? "Hide projected winning chances"
                    : "Show projected winning chances"}
                </button>
              </div>
            )}
            {showWinningChances && !resultsMode && showProjectedBars && (
              <div id="cardinalympics-winning-chances">
                <WinningChancesBar chances={winningChances} />
              </div>
            )}
          </section>
        )}

      {showEvents && (
        <section
          className="cardinalympics-content"
          aria-labelledby="cardinalympics-events-heading"
        >
          <div className="cardinalympics-section-heading">
            <p className="cardinalympics-section-heading__eyebrow">Schedule</p>
            <h2 id="cardinalympics-events-heading">Events</h2>
          </div>
          <CardinalympicsEventsSchedule
            events={cardinalympicsEvents}
            winnerLookup={eventWinnerLookup}
          />
        </section>
      )}
    </main>
  );
}

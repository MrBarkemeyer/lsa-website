function normalizedCardinalympicsMode(mode) {
  return String(mode ?? "")
    .trim()
    .toLowerCase();
}

/** @param {unknown} mode */
export function cardinalympicsIsResultsMode(mode) {
  const m = normalizedCardinalympicsMode(mode);
  return m === "results" || m === "result";
}

/** @param {unknown} mode */
export function cardinalympicsLeaderBadgeLabel(mode) {
  return cardinalympicsIsResultsMode(mode) ? "Winner" : "Leading";
}

const SCORE_COLS = [4, 5, 6, 7];
const WINNER_COLS = [8, 9, 10];

function cellHasScore(cell) {
  if (cell == null) return false;
  const raw = String(cell).trim();
  if (!raw) return false;
  const n = parseInt(raw.replace(/[^0-9-]/g, ""), 10);
  return !Number.isNaN(n);
}

function winnerText(row) {
  for (const col of WINNER_COLS) {
    const val = row?.[col] != null ? String(row[col]).trim() : "";
    if (val && !/^\d+$/.test(val)) return val;
  }
  return "";
}

/**
 * A dated scoreboard row is one event. Section headers, totals, and the
 * live-count flag have no date, so they are not required to be "filled".
 */
function isDatedEventRow(row) {
  const label = String(row?.[0] ?? "").trim();
  const date = String(row?.[1] ?? "").trim();
  if (!label || !date) return false;
  if (/^date$/i.test(date)) return false;
  if (label.toUpperCase().includes("TOTAL")) return false;
  return true;
}

function datedEventIsFilled(row) {
  const winner = winnerText(row).toLowerCase();
  if (winner === "cancelled" || winner === "canceled") return true;
  return SCORE_COLS.every((col) => cellHasScore(row?.[col]));
}

/**
 * True when every dated event has all four class scores (0 counts).
 * A cancelled event counts as filled without scores.
 * @param {unknown} rows
 */
export function cardinalympicsScoreboardIsComplete(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return false;
  const events = rows.filter(isDatedEventRow);
  if (events.length === 0) return false;
  return events.every(datedEventIsFilled);
}

/**
 * Config "results" forces winner mode. A finished scoreboard does too,
 * so a full Google Sheet switches the site without a config edit.
 * @param {unknown} configMode
 * @param {unknown} rows
 */
export function resolveCardinalympicsDisplayMode(configMode, rows) {
  if (cardinalympicsIsResultsMode(configMode)) return "results";
  if (cardinalympicsScoreboardIsComplete(rows)) return "results";
  return "activeGame";
}

// Central rules for when election URLs are public (config from elections.config.js).

/** Parse `resultsReleaseAt` ISO string → epoch ms, or null if unset/invalid. */
export function parseResultsReleaseAtMs(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  const ms = Date.parse(s);
  return Number.isNaN(ms) ? null : ms;
}

/** True when no release time is set, or the current time is past `resultsReleaseAt`. */
export function areElectionResultsReleased(config) {
  const ms = parseResultsReleaseAtMs(config?.resultsReleaseAt);
  if (ms == null) return true;
  return Date.now() >= ms;
}

/**
 * Candidate board pages (/Elections/:slug) — open while polling, or during results embargo
 * (before `resultsReleaseAt`) so people can still open candidate bios from /Elections?candidates=1.
 */
export function areElectionBoardsPublic(config) {
  if (config?.state === "polling") return true;
  if (config?.state === "results" && !areElectionResultsReleased(config)) return true;
  return false;
}

/** Full results on /Elections and /Elections/Results — state is results and release time has passed (if set). */
export function areElectionResultsPublic(config) {
  return config?.state === "results" && areElectionResultsReleased(config);
}

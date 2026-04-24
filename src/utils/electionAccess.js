// Central rules for when election URLs are public (config from elections.config.js).

/** Candidate board pages (/Elections/:slug) — only while state is polling. */
export function areElectionBoardsPublic(config) {
  return config?.state === "polling";
}

/** Full results on /Elections/Results — only after results are released. */
export function areElectionResultsPublic(config) {
  return config?.state === "results";
}

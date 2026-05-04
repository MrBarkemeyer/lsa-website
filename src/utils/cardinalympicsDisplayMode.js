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

import electionsConfig from "./elections.config.js";

const META = electionsConfig.electionBoardMeta || {};

/**
 * Accent for /LSA/SBC and class board pages (non-election), aligned with
 * `electionBoardMeta` colors (SBC, 2026–2029).
 *
 * @param {"SBC"|"Senior Board"|"Junior Board"|"Sophomore Board"|"Freshman Board"} boardKey
 * @returns {string} CSS color (hex)
 */
export function getLsaCurrentBoardAccent(boardKey) {
  if (boardKey === "SBC") return META.SBC?.color ?? "#9c1919";
  if (boardKey === "Senior Board") return META["2026"]?.color ?? "#9c1919";
  if (boardKey === "Junior Board") return META["2027"]?.color ?? "#1565c0";
  if (boardKey === "Sophomore Board") return META["2028"]?.color ?? "#6a1b9a";
  if (boardKey === "Freshman Board") return META["2029"]?.color ?? "#2e7d32";
  return META.SBC?.color ?? "#9c1919";
}

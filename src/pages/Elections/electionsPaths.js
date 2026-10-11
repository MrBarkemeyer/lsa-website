export const ELECTIONS_BASE = "/Elections";
export const ELECTIONS_HUB = `${ELECTIONS_BASE}/All`;

export function isElectionsHubSlug(slug) {
  return String(slug ?? "").trim().toLowerCase() === "all";
}

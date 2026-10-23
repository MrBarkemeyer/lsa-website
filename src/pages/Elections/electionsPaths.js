export const ELECTIONS_BASE = "/Elections";
export const ELECTIONS_HUB = `${ELECTIONS_BASE}/All`;
/** Preview URL. Registered only while `npm run dev` is running (`import.meta.env.DEV`). */
export const DEV_ELECTIONS_PREVIEW_PATH = "/dev";

const DEV_ELECTION_PREVIEW_PATHS = new Set(["/dev", "/dev/elections"]);

export function isElectionsHubSlug(slug) {
  return String(slug ?? "").trim().toLowerCase() === "all";
}

function normalizePathname(pathname) {
  return String(pathname ?? "")
    .replace(/\/+$/, "")
    .toLowerCase();
}

/**
 * True only on the Vite dev server (`npm run dev`).
 * Production builds and `npm run preview` never treat these URLs as a results preview.
 */
export function isDevElectionResultsPath(pathname) {
  if (!import.meta.env.DEV) return false;
  return DEV_ELECTION_PREVIEW_PATHS.has(normalizePathname(pathname));
}

/** Treat results as already released, and keep the view dropdown on this preview URL. */
export function withDevElectionResultsPreview(config) {
  if (!import.meta.env.DEV || !config) return config;
  return {
    ...config,
    state: "results",
    resultsReleaseAt: "",
    pollingBar: {
      ...(config.pollingBar ?? {}),
      resultsPath: DEV_ELECTIONS_PREVIEW_PATH,
    },
  };
}

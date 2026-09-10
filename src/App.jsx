import { lazy, useState, useEffect, useMemo } from 'react'
import './App.scss'
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import Home from "./pages/Home"
import Layout from "./pages/Layout"
import ScrollToTop from "./components/ScrollToTop";
import { site } from './config/site.config.js'
import { mergeElectionConfigWithSheet } from './utils/electionCandidatesFromSheet.js'
import { parseCardinalympicsEventsSheet } from './utils/cardinalympicsEventsFromSheet.js'
import { parseAnnouncementsSheet } from './utils/announcementsSheet.js'
import { ElectionTimingProvider } from './utils/electionVotingWindow.js'
import applicationsSheetConfig from './config/applications.config.js'
import cardinalympicsConfig from './config/cardinalympics.config.js'
import NotFound from './pages/NotFound'

const Elections = lazy(() => import("./pages/Elections"));
const ElectionBoard = lazy(() => import("./pages/Elections/ElectionBoard"));
const ElectionResults = lazy(() => import("./pages/Elections/ElectionResults"));
const Club = lazy(() => import("./pages/Clubs/Club"));
const TitleIX = lazy(() => import("./pages/Resources/TitleIX"));
const FreshMenCorner = lazy(() => import("./pages/More/FreshmenCorner"));
const Charter = lazy(() => import("./pages/About/Charter"));
const ClubResources = lazy(() => import("./pages/Clubs/ClubResources"));
const Wellness = lazy(() => import("./pages/Resources/Wellness"));
const Resources = lazy(() => import("./pages/Resources/Resources"));
const Clubs = lazy(() => import("./pages/Clubs/Clubs"));
const AboutLSA = lazy(() => import("./pages/About/AboutLSA"));
const Organization = lazy(() => import("./pages/Organizations/Organizations"));
const SBC = lazy(() => import("./pages/About/SBC"));
const DSA = lazy(() => import("./pages/About/DSA"));
const Site = lazy(() => import("./pages/More/Site"));
const Events = lazy(() => import("./pages/More/Events"));
const Committees = lazy(() => import("./pages/About/Committees"));
const SpiritCommittee = lazy(() => import("./pages/About/SpiritCommittee"));
const LsaTeamPage = lazy(() => import("./pages/About/LsaTeamPage"));
const LSAExplore = lazy(() => import("./pages/About/LSAExplore"));
const Registry = lazy(() => import("./pages/Registry/Registry"));
const NewClub = lazy(() => import("./pages/Clubs/club_resources/NewClub"));
const EventPlanning = lazy(() => import("./pages/Clubs/club_resources/EventPlanning"));
const Fundraising = lazy(() => import("./pages/Clubs/club_resources/Fundraising"));
const MockTrial = lazy(() => import("./pages/Organizations/MockTrial"));
const ShieldAndScroll = lazy(() => import("./pages/Organizations/ShieldAndScroll"));
const Archives = lazy(() => import("./pages/More/Archives"));
const More = lazy(() => import("./pages/More/More"));
const Forensic = lazy(() => import("./pages/Organizations/Forensic"));
const VideoLowell = lazy(() => import("./pages/Organizations/VideoLowell"));
const Cardinalympics = lazy(() => import("./pages/Cardinalympics"));
const ApplicationsOpen = lazy(() => import("./pages/ApplicationsOpen"));
const Announcements = lazy(() => import("./pages/Announcements"));

const SHEETS_COOKIE_TTL_DAYS = 1;
const SHEETS_CHECK_WINDOW_MS = 60 * 1000;
const SHEETS_LAST_CHECK_COOKIE = "lsa_sheets_last_check_ms_v1";
const SHEETS_RETRY_ATTEMPTS = 3;
const SHEETS_RETRY_DELAY_MS = 700;
/** Tab title in the spreadsheet is misspelled "Annoucements" (one n). */
const ANNOUNCEMENTS_ARCHIVE_SHEET_NAME = "Annoucements Archive";
const GOOGLE_API_KEY = "AIzaSyAgshc5Aqd8B149h5RpsenMh_SQAeb4AXc";
const MAIN_SPREADSHEET_ID = "1Kk7Bs58DAWZ9pHvqD-RFvoV1ePeThQ1Yr9c5RsDeAq4";
const WEBSITE_INFO_SHEET = "Website Info";
const OFFICERS_SHEET = "Officers";
const ELECTIONS_SHEET = "Elections";
const CARDINALYMPICS_SPREADSHEET_ID = "1Q4BWb9A2S9qRvn4HZhMpRnDseSmnlp36T4N7SGF-JF4";
const CARDINALYMPICS_SCORE_SHEET = "Sp, 25";
const CARDINALYMPICS_SCOREBOARD_GID = 525997941;
const CARDINALYMPICS_EVENTS_SHEET = "Cardinalympics Events";
const CARDINALYMPICS_POLL_MS = 30_000;

/** Live Cardinalympics sheet fetch + polling only on routes that show scores or events from the sheet. */
function routeWantsCardinalympicsLiveFetch(pathname) {
  const p = pathname || "/";
  if (p === "/") return true;
  return p === "/Cardinalympics" || p.startsWith("/Cardinalympics/");
}

/** Home preview + ApplicationsOpen page need live applications sheet data. */
function routeWantsApplicationsLiveFetch(pathname) {
  const p = pathname || "/";
  if (p === "/") return true;
  return p === "/ApplicationsOpen";
}

function readCookie(name) {
  if (typeof document === "undefined") return null;
  const key = `${name}=`;
  const parts = document.cookie ? document.cookie.split("; ") : [];
  for (const part of parts) {
    if (part.startsWith(key)) {
      return part.slice(key.length);
    }
  }
  return null;
}

function readJsonCookie(name) {
  try {
    const raw = readCookie(name);
    if (!raw) return null;
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

function writeCookie(name, value, days = SHEETS_COOKIE_TTL_DAYS) {
  if (typeof document === "undefined") return;
  const next = encodeURIComponent(String(value));
  const current = readCookie(name);
  if (current === next) return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${next}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function writeJsonCookie(name, value, days = SHEETS_COOKIE_TTL_DAYS) {
  if (typeof document === "undefined") return;
  const next = encodeURIComponent(JSON.stringify(value));
  const current = readCookie(name);
  if (current === next) return; // avoid rewriting the same value every visit
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${next}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function reserveSheetsRefreshWindow() {
  const now = Date.now();
  const lastRaw = readCookie(SHEETS_LAST_CHECK_COOKIE);
  const last = lastRaw ? parseInt(decodeURIComponent(lastRaw), 10) : 0;
  if (!Number.isNaN(last) && now - last < SHEETS_CHECK_WINDOW_MS) {
    return false;
  }
  writeCookie(SHEETS_LAST_CHECK_COOKIE, now);
  return true;
}

const SHOULD_CHECK_SHEETS_NOW = reserveSheetsRefreshWindow();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Build an A1 range for values:batchGet / values.get.
 * values:batchGet rejects a tab-only string like 'My Tab' (400 "Unable to parse range").
 * Use explicit column span: A:ZZ is valid; A:ZZZ and huge rectangles like A1:ZZ100000 are not.
 */
function tabNameToValuesRangeA1(tabName) {
  const s = String(tabName ?? "").trim();
  if (!s) return "";
  if (s.includes("!")) return s;
  const escaped = s.replace(/'/g, "''");
  return `'${escaped}'!A:ZZ`;
}

/** One HTTP request for multiple tabs on the same spreadsheet (saves quota vs. separate values.get calls). */
async function fetchSheetBatchGetWithRetry(spreadsheetId, rangeNames, apiKey, options = {}) {
  const attempts = options.attempts ?? SHEETS_RETRY_ATTEMPTS;
  const delayMs = options.delayMs ?? SHEETS_RETRY_DELAY_MS;
  let lastError = null;

  for (let i = 0; i < attempts; i++) {
    try {
      const params = new URLSearchParams();
      params.set("key", apiKey);
      for (const r of rangeNames) {
        const range = tabNameToValuesRangeA1(r);
        if (range) params.append("ranges", range);
      }
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${params.toString()}`;
      const res = await fetch(url, options.fetchOptions);
      const json = await res.json().catch(() => ({}));
      const httpStatus = res.status;
      const apiMessage = json?.error?.message;

      if (!res.ok || json?.error) {
        lastError = apiMessage || res.statusText || `HTTP ${httpStatus}`;
        const retryable = httpStatus === 429 || httpStatus >= 500 || httpStatus === 0;
        if (!retryable) {
          break;
        }
      } else if (Array.isArray(json?.valueRanges)) {
        return { valueRanges: json.valueRanges, error: null };
      } else {
        lastError = "No data returned";
      }
    } catch (error) {
      lastError = error?.message || "Network error";
    }

    if (i < attempts - 1) {
      await delay(delayMs);
    }
  }

  return { valueRanges: null, error: lastError || "Failed to fetch sheet data" };
}

/** Read values directly from a gid/sheetId without relying on tab title. */
async function fetchSheetByGidWithRetry(spreadsheetId, gid, apiKey, options = {}) {
  const attempts = options.attempts ?? SHEETS_RETRY_ATTEMPTS;
  const delayMs = options.delayMs ?? SHEETS_RETRY_DELAY_MS;
  const targetGid = Number(gid);
  if (!Number.isFinite(targetGid)) return { values: null, error: "Invalid gid" };
  let lastError = null;

  for (let i = 0; i < attempts; i++) {
    try {
      const params = new URLSearchParams();
      params.set("key", apiKey);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGetByDataFilter?${params.toString()}`;
      const body = {
        dataFilters: [{ gridRange: { sheetId: targetGid } }],
        majorDimension: "ROWS",
      };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        ...options.fetchOptions,
      });
      const json = await res.json().catch(() => ({}));
      const httpStatus = res.status;
      const apiMessage = json?.error?.message;

      if (!res.ok || json?.error) {
        lastError = apiMessage || res.statusText || `HTTP ${httpStatus}`;
        const retryable = httpStatus === 429 || httpStatus >= 500 || httpStatus === 0;
        if (!retryable) break;
      } else {
        const values = json?.valueRanges?.[0]?.valueRange?.values;
        if (Array.isArray(values)) return { values, error: null };
        return { values: null, error: `No values for gid ${targetGid}` };
      }
    } catch (error) {
      lastError = error?.message || "Network error";
    }

    if (i < attempts - 1) {
      await delay(delayMs);
    }
  }

  return { values: null, error: lastError || "Failed to fetch sheet by gid" };
}

function arrayCleanUp(array) {
  return array.reduce((cleaned, value) => {
    const parsed = parseInt(value, 10);
    if (value !== "" && !Number.isNaN(parsed)) cleaned.push(parsed);
    return cleaned;
  }, []);
}

function processSheetData(data) {
  if (!data?.length) return [];
  const [headers, ...rows] = data;
  return rows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index] || ""]))
  );
}

function processApplicationsSheetData(data) {
  if (!data?.length) return [];
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(data.length, 5); i++) {
    const row = data[i];
    if (
      Array.isArray(row) &&
      row.some((cell) => {
        const value = String(cell || "").trim();
        return value === "Status" || value === "Name of Org/Club";
      })
    ) {
      headerRowIndex = i;
      break;
    }
  }

  const headers = data[headerRowIndex];
  return data.slice(headerRowIndex + 1).map((row) =>
    Object.fromEntries(
      headers.map((header, index) => [
        String(header ?? "").trim() || `Column${index}`,
        row[index] != null ? String(row[index]) : "",
      ])
    )
  );
}

function App() {
    const location = useLocation();
    const [clubData, setClubData] = useState([]);
    const [officerData, setOfficerData] = useState([]);

    const [cardinalympicsData, setCardinalympicsData] = useState([0, 0, 0, 0]);
    const [scoreboardRows, setScoreboardRows] = useState([]);
    const [cardinalympicsEvents, setCardinalympicsEvents] = useState([]);

    const [electionSheetValues, setElectionSheetValues] = useState(null);
    const [newsData, setNewsData] = useState([]);
    const [newsLoading, setNewsLoading] = useState(true);

    // which clubs/orgs have applications open right now
    const [applicationsData, setApplicationsData] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(true);
    const [applicationsError, setApplicationsError] = useState(null);
    const shouldCheckSheetsNow = SHOULD_CHECK_SHEETS_NOW;

    // Website Info + Officers + Elections + announcements archive: one batchGet per refresh (4 tabs -> 1 API call).
    // Elections tab loads on every route because Layout/Navbar/banner use electionsConfigResolved (sheet merge), not only /Elections.
    useEffect(() => {
      async function fetchCoreSheetsAndAnnouncements() {
        const clubCookieKey = "lsa_sheet_website_info_v1";
        const officerCookieKey = "lsa_sheet_officers_v1";
        const electionCookieKey = "lsa_sheet_elections_v1";
        const announcementsCookieKey = "lsa_sheet_home_announcements_v1";
        const cachedClubValues = readJsonCookie(clubCookieKey);
        const cachedOfficerValues = readJsonCookie(officerCookieKey);
        const cachedElectionValues = readJsonCookie(electionCookieKey);
        const cachedAnnouncementsValues = readJsonCookie(announcementsCookieKey);

        if (cachedClubValues?.length) {
          setClubData(processSheetData(cachedClubValues));
        }
        if (cachedOfficerValues?.length) {
          setOfficerData(processSheetData(cachedOfficerValues));
        }
        if (cachedElectionValues?.length) {
          setElectionSheetValues(cachedElectionValues);
        }
        if (cachedAnnouncementsValues?.length) {
          setNewsData(parseAnnouncementsSheet(cachedAnnouncementsValues));
        }

        const skipNetwork =
          !shouldCheckSheetsNow &&
          cachedClubValues?.length &&
          cachedOfficerValues?.length &&
          cachedElectionValues?.length &&
          cachedAnnouncementsValues?.length;
        if (skipNetwork) {
          setNewsLoading(false);
          return;
        }

        try {
          const batchTabNames = [
            WEBSITE_INFO_SHEET,
            OFFICERS_SHEET,
            ELECTIONS_SHEET,
            ANNOUNCEMENTS_ARCHIVE_SHEET_NAME,
          ];
          const batch = await fetchSheetBatchGetWithRetry(
            MAIN_SPREADSHEET_ID,
            batchTabNames,
            GOOGLE_API_KEY
          );
          if (batch.error || !batch.valueRanges?.length) {
            console.warn("Main spreadsheet batch:", batch.error);
            return;
          }
          const vr = batch.valueRanges;
          const clubVals = vr[0]?.values;
          const officerVals = vr[1]?.values;
          const electionVals = vr[2]?.values;
          const announcementVals = vr[3]?.values;

          if (clubVals?.length) {
            setClubData(processSheetData(clubVals));
            writeJsonCookie(clubCookieKey, clubVals);
          } else {
            console.warn("Website Info sheet: empty or missing");
          }
          if (officerVals?.length) {
            setOfficerData(processSheetData(officerVals));
            writeJsonCookie(officerCookieKey, officerVals);
          } else {
            console.warn("Officers sheet: empty or missing");
          }
          if (electionVals?.length) {
            setElectionSheetValues(electionVals);
            writeJsonCookie(electionCookieKey, electionVals);
          } else {
            console.warn("Elections sheet: empty or missing");
          }
          if (announcementVals?.length) {
            const parsed = parseAnnouncementsSheet(announcementVals);
            if (parsed.length) {
              setNewsData(parsed);
              writeJsonCookie(announcementsCookieKey, announcementVals);
            } else {
              console.warn("Announcements archive tab: no parsed rows");
            }
          } else {
            console.warn("Announcements archive sheet: empty or missing");
          }
        } catch (error) {
          console.log(error);
        } finally {
          setNewsLoading(false);
        }
      }
      fetchCoreSheetsAndAnnouncements();
    }, [shouldCheckSheetsNow]);

    const electionsConfigResolved = useMemo(
      () => mergeElectionConfigWithSheet(site.elections, electionSheetValues),
      [electionSheetValues]
    );

    const {
      showScoresAndScoreboard,
      showScoreBreakdown,
      showWinningChances,
      showEvents,
      showHomeEventsSignupNow,
      displayMode: cardinalympicsDisplayMode,
    } = cardinalympicsConfig;
    const needsCardinalympicsEventsData = showEvents || showHomeEventsSignupNow;

    useEffect(() => {
      if (!showScoresAndScoreboard) {
        setCardinalympicsData([0, 0, 0, 0]);
        setScoreboardRows([]);
      }
      if (!needsCardinalympicsEventsData) {
        setCardinalympicsEvents([]);
      }

      if (!showScoresAndScoreboard && !needsCardinalympicsEventsData) {
        return undefined;
      }

      function applyCardinalympicsValues(values) {
        if (!Array.isArray(values) || values.length === 0) return;
        const scoreFromCell = (cell) => {
          const n = parseInt(String(cell ?? "").replace(/[^0-9-]/g, ""), 10);
          return Number.isNaN(n) ? null : n;
        };
        const spiritTotalsRow = [...values].reverse().find((row) =>
          String(row?.[0] ?? "").toUpperCase().includes("SPIRIT WEEK TOTALS")
        );
        let classTotals = [];
        if (spiritTotalsRow) {
          classTotals = [4, 5, 6, 7]
            .map((idx) => scoreFromCell(spiritTotalsRow[idx]))
            .filter((n) => n != null);
        }
        if (classTotals.length !== 4) {
          const totals = arrayCleanUp(values[0]);
          classTotals = totals.length >= 5 ? totals.slice(-4) : totals.slice(0, 4);
        }
        setCardinalympicsData(classTotals);
        setScoreboardRows(values.map((row) => (Array.isArray(row) ? [...row] : row)));
      }

      function applyCardinalympicsEventsValues(values) {
        if (!Array.isArray(values) || values.length === 0) return;
        setCardinalympicsEvents(parseCardinalympicsEventsSheet(values));
      }

      const cardinalympicsRouteActive = routeWantsCardinalympicsLiveFetch(location.pathname);
      if (!cardinalympicsRouteActive) {
        const cardinalympicsCookieKey = "lsa_sheet_cardinalympics_v1";
        const eventsCookieKey = "lsa_sheet_cardinalympics_events_v1";
        const cachedValues = readJsonCookie(cardinalympicsCookieKey);
        const cachedEventsValues = readJsonCookie(eventsCookieKey);
        if (showScoresAndScoreboard && cachedValues?.length) applyCardinalympicsValues(cachedValues);
        if (needsCardinalympicsEventsData && cachedEventsValues?.length) applyCardinalympicsEventsValues(cachedEventsValues);
        return undefined;
      }

      async function fetchCardinalympicsData() {
        const cardinalympicsCookieKey = "lsa_sheet_cardinalympics_v1";
        const eventsCookieKey = "lsa_sheet_cardinalympics_events_v1";
        const cachedValues = readJsonCookie(cardinalympicsCookieKey);
        const cachedEventsValues = readJsonCookie(eventsCookieKey);

        if (showScoresAndScoreboard && cachedValues?.length) {
          applyCardinalympicsValues(cachedValues);
        }
        if (needsCardinalympicsEventsData && cachedEventsValues?.length) {
          applyCardinalympicsEventsValues(cachedEventsValues);
        }

        const skipNetwork =
          !reserveSheetsRefreshWindow() &&
          (!showScoresAndScoreboard || cachedValues?.length) &&
          (!needsCardinalympicsEventsData || cachedEventsValues?.length);
        if (skipNetwork) return;

        try {
          const fetchOpts = { fetchOptions: { cache: "no-store" } };
          const tasks = [];
          if (showScoresAndScoreboard) {
            tasks.push(
              fetchSheetByGidWithRetry(
                CARDINALYMPICS_SPREADSHEET_ID,
                CARDINALYMPICS_SCOREBOARD_GID,
                GOOGLE_API_KEY,
                fetchOpts
              )
                .then((gidResult) => {
                  if (gidResult.values?.length) {
                    return {
                      kind: "scores",
                      batch: { valueRanges: [{ values: gidResult.values }], error: null },
                    };
                  }
                  return fetchSheetBatchGetWithRetry(
                    CARDINALYMPICS_SPREADSHEET_ID,
                    [CARDINALYMPICS_SCORE_SHEET],
                    GOOGLE_API_KEY,
                    fetchOpts
                  ).then((batch) => ({ kind: "scores", batch }));
                })
            );
          }
          if (needsCardinalympicsEventsData) {
            tasks.push(
              fetchSheetBatchGetWithRetry(
                MAIN_SPREADSHEET_ID,
                [CARDINALYMPICS_EVENTS_SHEET],
                GOOGLE_API_KEY,
                fetchOpts
              ).then(
                (batch) => ({ kind: "events", batch })
              )
            );
          }
          const results = await Promise.all(tasks);
          for (const { kind, batch } of results) {
            if (kind === "scores") {
              const scoreVals = batch.valueRanges?.[0]?.values;
              if (scoreVals?.length) {
                applyCardinalympicsValues(scoreVals);
                writeJsonCookie(cardinalympicsCookieKey, scoreVals);
              } else {
                console.warn(
                  "Cardinalympics scoreboard sheet:",
                  batch.error || "empty or missing"
                );
              }
            } else {
              const eventVals = batch.valueRanges?.[0]?.values;
              if (eventVals?.length) {
                applyCardinalympicsEventsValues(eventVals);
                writeJsonCookie(eventsCookieKey, eventVals);
              } else {
                console.warn(
                  "Cardinalympics Events sheet:",
                  batch.error || "empty or missing"
                );
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      const hasCachedCardinalympics = Boolean(readJsonCookie("lsa_sheet_cardinalympics_v1")?.length);
      const hasCachedEvents = Boolean(readJsonCookie("lsa_sheet_cardinalympics_events_v1")?.length);
      const shouldInitialFetch =
        shouldCheckSheetsNow ||
        (showScoresAndScoreboard && !hasCachedCardinalympics) ||
        (needsCardinalympicsEventsData && !hasCachedEvents);

      if (shouldInitialFetch) {
        fetchCardinalympicsData();
      } else {
        const cachedValues = readJsonCookie("lsa_sheet_cardinalympics_v1");
        const cachedEventsValues = readJsonCookie("lsa_sheet_cardinalympics_events_v1");
        if (showScoresAndScoreboard && cachedValues?.length) applyCardinalympicsValues(cachedValues);
        if (needsCardinalympicsEventsData && cachedEventsValues?.length) applyCardinalympicsEventsValues(cachedEventsValues);
      }

      let pollId = null;
      const armPolling = () => {
        if (pollId != null) {
          clearInterval(pollId);
          pollId = null;
        }
        pollId = window.setInterval(fetchCardinalympicsData, CARDINALYMPICS_POLL_MS);
      };

      const onVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
          if (pollId != null) {
            clearInterval(pollId);
            pollId = null;
          }
        } else {
          void fetchCardinalympicsData();
          armPolling();
        }
      };

      if (typeof document !== "undefined") {
        if (!document.hidden) {
          armPolling();
        }
        document.addEventListener("visibilitychange", onVisibilityChange);
      }

      return () => {
        if (typeof document !== "undefined") {
          document.removeEventListener("visibilitychange", onVisibilityChange);
        }
        if (pollId != null) {
          clearInterval(pollId);
        }
      };
    }, [
      shouldCheckSheetsNow,
      showScoresAndScoreboard,
      showEvents,
      showHomeEventsSignupNow,
      needsCardinalympicsEventsData,
      location.pathname,
    ]);

    useEffect(() => {
      async function fetchApplicationsData() {
        setApplicationsError(null);
        setApplicationsLoading(true);
        const configuredSpreadsheetId = String(applicationsSheetConfig?.spreadsheetId ?? "").trim();
        if (!configuredSpreadsheetId) {
          // Explicitly treat blank config as "feature off": no API calls, no error state.
          setApplicationsData([]);
          setApplicationsLoading(false);
          return;
        }
        const appsCookieKey = "lsa_sheet_applications_v1";
        const cachedApplicationsValues = readJsonCookie(appsCookieKey);
        if (cachedApplicationsValues?.length) {
          setApplicationsData(processApplicationsSheetData(cachedApplicationsValues));
        }
        if (!routeWantsApplicationsLiveFetch(location.pathname)) {
          setApplicationsLoading(false);
          return;
        }
        if (!shouldCheckSheetsNow && cachedApplicationsValues?.length) {
          setApplicationsLoading(false);
          return;
        }

        try {
          const { spreadsheetId, sheetName, sheetNames } = applicationsSheetConfig;
          const names = sheetNames?.length
            ? sheetNames
            : [sheetName].filter(Boolean);

          let lastError = null;
          const batch = await fetchSheetBatchGetWithRetry(
            spreadsheetId,
            names,
            GOOGLE_API_KEY
          );
          if (!batch.error && batch.valueRanges?.length) {
            for (let i = 0; i < names.length; i++) {
              const vals = batch.valueRanges[i]?.values;
              if (!vals?.length) continue;
              setApplicationsData(processApplicationsSheetData(vals));
              writeJsonCookie(appsCookieKey, vals);
              return;
            }
            lastError = "No non-empty applications tab";
          } else {
            lastError = batch.error || "Unknown API error";
            console.warn("Applications sheet batch:", lastError);
          }

          if (cachedApplicationsValues?.length) {
            setApplicationsError(
              `Live applications data unavailable (${lastError || "Could not load applications tab"}). Showing last saved data.`
            );
          } else {
            setApplicationsData([]);
            setApplicationsError(
              lastError || "Could not load the applications spreadsheet tab."
            );
          }
        } catch (error) {
          console.warn(error);
          if (cachedApplicationsValues?.length) {
            setApplicationsError(
              `Network error loading applications (${error?.message || "Unknown error"}). Showing last saved data.`
            );
          } else {
            setApplicationsData([]);
            setApplicationsError(error?.message || "Network error loading applications.");
          }
        } finally {
          setApplicationsLoading(false);
        }
      }
      fetchApplicationsData();
    }, [shouldCheckSheetsNow, location.pathname]);


  return (
    <>
        <ScrollToTop />
        <Routes>
          <Route
            element={
              <ElectionTimingProvider config={electionsConfigResolved}>
                <Layout
                  clubData={clubData}
                  electionsEnabled={site.electionsEnabled}
                  electionsConfig={electionsConfigResolved}
                />
              </ElectionTimingProvider>
            }
          >
            <Route path="/" element={<Home cardinalympicsData={cardinalympicsData} cardinalympicsEvents={cardinalympicsEvents} newsData={newsData} clubData={clubData} applicationsData={applicationsData} showCardinalympicsScores={cardinalympicsConfig.showScoresAndScoreboard} showCardinalympicsSignupNow={cardinalympicsConfig.showHomeEventsSignupNow} cardinalympicsDisplayMode={cardinalympicsDisplayMode} electionsConfig={electionsConfigResolved} />} />
            <Route path="Elections" element={<Outlet />}>
              <Route index element={<Elections electionsEnabled={site.electionsEnabled} electionsConfig={electionsConfigResolved} />} />
              <Route path=":boardSlug" element={<ElectionBoard electionsConfig={electionsConfigResolved} />} />
              <Route path="Results" element={<ElectionResults electionsEnabled={site.electionsEnabled} electionsConfig={electionsConfigResolved} />} />
            </Route>
            
            <Route path="LSA" element={<Outlet />}>
              <Route index element={<AboutLSA/>} />
              <Route path="SBC" element={<SBC officerData={officerData}/>} />
              <Route path="DSA" element={<DSA />} />
              <Route path="Charter" element={<Charter />}/>
              <Route path="Commitees" element={<Committees />} />
              <Route path="Spirit Committee" element={<SpiritCommittee />} />
              <Route path=":BoardName" element={<LsaTeamPage officerData={officerData} />} />
              
            </Route>

            <Route path="Organizations" element = {<Outlet />}>
              <Route index element={<Organization />} />
              <Route path="MockTrial" element={<MockTrial />} />
              <Route path="ShieldAndScroll" element={<ShieldAndScroll />} />
              <Route path="Forensic" element={<Forensic />} />
              <Route path="VideoLowell" element={<VideoLowell />} />
            </Route>

            <Route path="Clubs" element={<Outlet />}>
              <Route index element={<Clubs clubData={clubData}/>} />
              <Route path="ClubResources" element={<ClubResources />} />
              <Route path=":ClubName" element={<Club clubData={clubData}/>}/>
              <Route path="NewClub" element={<NewClub />} />
              <Route path="EventPlanning" element={<EventPlanning />} />
              <Route path="Fundraising" element={<Fundraising />} />
            </Route>

            <Route
              path="ApplicationsOpen"
              element={
                <ApplicationsOpen
                  applicationsData={applicationsData}
                  applicationsLoading={applicationsLoading}
                  applicationsError={applicationsError}
                />
              }
            />
            <Route
              path="Announcements"
              element={<Announcements announcements={newsData} loading={newsLoading} />}
            />
            <Route path="Resources" element={<Outlet />}>
              <Route index element={<Resources />} />
              <Route
                path="ApplicationsOpen"
                element={<Navigate to="/ApplicationsOpen" replace />}
              />
              <Route path="Wellness" element={<Wellness />} />
              <Route path="TitleIX" element={<TitleIX />} />
            </Route>
            <Route path="LSA-EXPLORE" element={<LSAExplore />} />
            <Route path="Wellness" element={<Navigate to="/Resources/Wellness" replace />} />
            <Route path="TitleIX" element={<Navigate to="/Resources/TitleIX" replace />} />
            
            <Route path="FreshmenCorner" element= {<FreshMenCorner />} />
            <Route path="Registry" element={<Registry />} />
            <Route path="Events" element={<Events />} />
            <Route path="AboutSite" element={<Site />} />
            <Route path="Archives" element={<Archives />} />
            <Route path="Cardinalympics" element={<Cardinalympics cardinalympicsData={cardinalympicsData} scoreboardRows={scoreboardRows} cardinalympicsEvents={cardinalympicsEvents} showScoresAndScoreboard={showScoresAndScoreboard} showScoreBreakdown={showScoreBreakdown} showWinningChances={showWinningChances} showEvents={showEvents} cardinalympicsDisplayMode={cardinalympicsDisplayMode} />} />  
            <Route path="More" element={<More />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
    </>
  )
}

export default App
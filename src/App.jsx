import { lazy, useState, useEffect, useMemo } from "react";
import "./App.scss";
import { Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import ScrollToTop from "./components/ScrollToTop";
import { site } from "./config/site.config.js";
import { mergeElectionConfigWithSheet } from "./utils/electionCandidatesFromSheet.js";
import { parseCardinalympicsEventsSheet } from "./utils/cardinalympicsEventsFromSheet.js";
import { ElectionTimingProvider } from "./utils/electionVotingWindow.js";
import cardinalympicsConfig from "./config/cardinalympics.config.js";
import NotFound from "./pages/NotFound";

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
const Registry = lazy(() => import("./pages/Registry/Registry"));
const NewClub = lazy(() => import("./pages/Clubs/club_resources/NewClub"));
const EventPlanning = lazy(
  () => import("./pages/Clubs/club_resources/EventPlanning"),
);
const Fundraising = lazy(
  () => import("./pages/Clubs/club_resources/Fundraising"),
);
const MockTrial = lazy(() => import("./pages/Organizations/MockTrial"));
const ShieldAndScroll = lazy(
  () => import("./pages/Organizations/ShieldAndScroll"),
);
const Archives = lazy(() => import("./pages/More/Archives"));
const More = lazy(() => import("./pages/More/More"));
const Forensic = lazy(() => import("./pages/Organizations/Forensic"));
const VideoLowell = lazy(() => import("./pages/Organizations/VideoLowell"));
const Csf = lazy(() => import("./pages/Organizations/Csf"));
const PeerResources = lazy(() => import("./pages/Organizations/PeerResources"));
const Song = lazy(() => import("./pages/Organizations/Song"));
const Lsrp = lazy(() => import("./pages/Organizations/Lsrp"));
const Jrotc = lazy(() => import("./pages/Organizations/Jrotc"));
const CardinalBotics = lazy(
  () => import("./pages/Organizations/CardinalBotics"),
);
const Sac = lazy(() => import("./pages/Organizations/Sac"));
const Cardinalympics = lazy(() => import("./pages/Cardinalympics"));
const SHEETS_COOKIE_TTL_DAYS = 1;
const SHEETS_CHECK_WINDOW_MS = 60 * 1000;
const SHEETS_LAST_CHECK_COOKIE = "lsa_sheets_last_check_ms_v1";
const SHEETS_RETRY_ATTEMPTS = 3;
const SHEETS_RETRY_DELAY_MS = 700;
const GOOGLE_API_KEY = "AIzaSyAgshc5Aqd8B149h5RpsenMh_SQAeb4AXc";
const MAIN_SPREADSHEET_ID = "1Kk7Bs58DAWZ9pHvqD-RFvoV1ePeThQ1Yr9c5RsDeAq4";
const WEBSITE_INFO_SHEET = "Website Info";
const OFFICERS_SHEET = "Officers";
const ELECTIONS_SHEET = site.elections.sheet || "Elections";
const ELECTION_SHEET_COOKIE = `lsa_sheet_elections_${site.elections.mode || "normal"}`;
const CARDINALYMPICS_SPREADSHEET_ID =
  "1Q4BWb9A2S9qRvn4HZhMpRnDseSmnlp36T4N7SGF-JF4";
const CARDINALYMPICS_SCORE_SHEET = "Sp, 25";
const CARDINALYMPICS_SCOREBOARD_GID = 525997941;
const CARDINALYMPICS_EVENTS_SHEET = "Cardinalympics Events";
const CARDINALYMPICS_POLL_MS = 30_000;
const CARDINALYMPICS_SCORES_COOKIE = "lsa_sheet_cardinalympics_v1";
const CARDINALYMPICS_EVENTS_COOKIE = "lsa_sheet_cardinalympics_events_v1";
const CARDINALYMPICS_LIVE_FLAG_COOKIE = "lsa_sheet_cardinalympics_live_v1";

function parseCardinalympicsEnableLiveCount(values) {
  if (!Array.isArray(values)) return true;
  const row = values.find((entry) =>
    String(entry?.[0] ?? "")
      .toUpperCase()
      .includes("ENABLE LIVE COUNT"),
  );
  if (!row) return true;
  const raw = String(row[2] ?? row[1] ?? "")
    .trim()
    .toUpperCase();
  return raw === "TRUE" || raw === "YES" || raw === "1";
}

function readCardinalympicsLiveFlag() {
  const raw = String(readCookie(CARDINALYMPICS_LIVE_FLAG_COOKIE) || "")
    .trim()
    .toLowerCase();
  if (raw === "true" || raw === "1") return true;
  if (raw === "false" || raw === "0") return false;
  return null;
}

function writeCardinalympicsLiveFlag(enabled) {
  writeCookie(CARDINALYMPICS_LIVE_FLAG_COOKIE, enabled ? "true" : "false");
}

/** Live Cardinalympics sheet fetch + polling only on routes that show scores or events from the sheet. */
function routeWantsCardinalympicsLiveFetch(pathname) {
  const p = pathname || "/";
  if (p === "/") return true;
  return p === "/Cardinalympics" || p.startsWith("/Cardinalympics/");
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

// Election rows don't fit in a cookie, so a cookie read always misses and the page flashes empty.
function readElectionSheetCache() {
  if (typeof localStorage === "undefined") return null;
  try {
    const parsed = JSON.parse(localStorage.getItem(ELECTION_SHEET_COOKIE) || "null");
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

function writeElectionSheetCache(values) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(ELECTION_SHEET_COOKIE, JSON.stringify(values));
  } catch {
    // quota or private mode
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
async function fetchSheetBatchGetWithRetry(
  spreadsheetId,
  rangeNames,
  apiKey,
  options = {},
) {
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
        const retryable =
          httpStatus === 429 || httpStatus >= 500 || httpStatus === 0;
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

  return {
    valueRanges: null,
    error: lastError || "Failed to fetch sheet data",
  };
}

/** Read values directly from a gid/sheetId without relying on tab title. */
async function fetchSheetByGidWithRetry(
  spreadsheetId,
  gid,
  apiKey,
  options = {},
) {
  const attempts = options.attempts ?? SHEETS_RETRY_ATTEMPTS;
  const delayMs = options.delayMs ?? SHEETS_RETRY_DELAY_MS;
  const targetGid = Number(gid);
  if (!Number.isFinite(targetGid))
    return { values: null, error: "Invalid gid" };
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
        const retryable =
          httpStatus === 429 || httpStatus >= 500 || httpStatus === 0;
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
    Object.fromEntries(
      headers.map((header, index) => [header, row[index] || ""]),
    ),
  );
}

function App() {
  const location = useLocation();
  const [clubData, setClubData] = useState([]);
  const [officerData, setOfficerData] = useState([]);

  const [cardinalympicsData, setCardinalympicsData] = useState([0, 0, 0, 0]);
  const [scoreboardRows, setScoreboardRows] = useState([]);
  const [cardinalympicsEvents, setCardinalympicsEvents] = useState([]);

  const [electionSheetValues, setElectionSheetValues] = useState(readElectionSheetCache);
  const shouldCheckSheetsNow = SHOULD_CHECK_SHEETS_NOW;

  // Website Info + Officers + Elections: one batchGet per refresh.
  // Elections tab loads on every route because Layout/Navbar/banner use electionsConfigResolved (sheet merge), not only /Elections.
  useEffect(() => {
    async function fetchCoreSheets() {
      const clubCookieKey = "lsa_sheet_website_info_v2";
      const officerCookieKey = "lsa_sheet_officers_v1";
      const cachedClubValues = readJsonCookie(clubCookieKey);
      const cachedOfficerValues = readJsonCookie(officerCookieKey);
      const cachedElectionValues = readElectionSheetCache();

      if (cachedClubValues?.length) {
        setClubData(processSheetData(cachedClubValues));
      }
      if (cachedOfficerValues?.length) {
        setOfficerData(processSheetData(cachedOfficerValues));
      }
      const skipNetwork =
        !shouldCheckSheetsNow &&
        cachedClubValues?.length &&
        cachedOfficerValues?.length &&
        cachedElectionValues?.length;
      if (skipNetwork) return;

      try {
        const batchTabNames = [
          WEBSITE_INFO_SHEET,
          OFFICERS_SHEET,
          ELECTIONS_SHEET,
        ];
        const batch = await fetchSheetBatchGetWithRetry(
          MAIN_SPREADSHEET_ID,
          batchTabNames,
          GOOGLE_API_KEY,
        );
        if (batch.error || !batch.valueRanges?.length) {
          console.warn("Main spreadsheet batch:", batch.error);
          return;
        }
        const vr = batch.valueRanges;
        const clubVals = vr[0]?.values;
        const officerVals = vr[1]?.values;
        const electionVals = vr[2]?.values;

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
          writeElectionSheetCache(electionVals);
        } else {
          console.warn("Elections sheet: empty or missing");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchCoreSheets();
  }, [shouldCheckSheetsNow]);

  const electionsConfigResolved = useMemo(
    () => mergeElectionConfigWithSheet(site.elections, electionSheetValues),
    [electionSheetValues],
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
      if (!Array.isArray(values) || values.length === 0) return true;
      const scoreFromCell = (cell) => {
        const n = parseInt(String(cell ?? "").replace(/[^0-9-]/g, ""), 10);
        return Number.isNaN(n) ? null : n;
      };
      const spiritTotalsRow = [...values].reverse().find((row) =>
        String(row?.[0] ?? "")
          .toUpperCase()
          .includes("SPIRIT WEEK TOTALS"),
      );
      let classTotals = [];
      if (spiritTotalsRow) {
        classTotals = [4, 5, 6, 7]
          .map((idx) => scoreFromCell(spiritTotalsRow[idx]))
          .filter((n) => n != null);
      }
      if (classTotals.length !== 4) {
        const totals = arrayCleanUp(values[0]);
        classTotals =
          totals.length >= 5 ? totals.slice(-4) : totals.slice(0, 4);
      }
      setCardinalympicsData(classTotals);
      setScoreboardRows(
        values.map((row) => (Array.isArray(row) ? [...row] : row)),
      );
      return parseCardinalympicsEnableLiveCount(values);
    }

    function applyCardinalympicsEventsValues(values) {
      if (!Array.isArray(values) || values.length === 0) return;
      setCardinalympicsEvents(parseCardinalympicsEventsSheet(values));
    }

    const cardinalympicsRouteActive = routeWantsCardinalympicsLiveFetch(
      location.pathname,
    );

    if (!cardinalympicsRouteActive) {
      const cachedValues = readJsonCookie(CARDINALYMPICS_SCORES_COOKIE);
      const cachedEventsValues = readJsonCookie(CARDINALYMPICS_EVENTS_COOKIE);
      if (showScoresAndScoreboard && cachedValues?.length)
        applyCardinalympicsValues(cachedValues);
      if (needsCardinalympicsEventsData && cachedEventsValues?.length)
        applyCardinalympicsEventsValues(cachedEventsValues);
      return undefined;
    }

    let liveCountEnabled = readCardinalympicsLiveFlag();
    if (liveCountEnabled == null) {
      const cachedForFlag = readJsonCookie(CARDINALYMPICS_SCORES_COOKIE);
      liveCountEnabled = cachedForFlag?.length
        ? parseCardinalympicsEnableLiveCount(cachedForFlag)
        : true;
    }

    async function fetchScoreSheetValues() {
      const fetchOpts = { fetchOptions: { cache: "no-store" } };
      const gidResult = await fetchSheetByGidWithRetry(
        CARDINALYMPICS_SPREADSHEET_ID,
        CARDINALYMPICS_SCOREBOARD_GID,
        GOOGLE_API_KEY,
        fetchOpts,
      );
      if (gidResult.values?.length) return gidResult.values;
      const batch = await fetchSheetBatchGetWithRetry(
        CARDINALYMPICS_SPREADSHEET_ID,
        [CARDINALYMPICS_SCORE_SHEET],
        GOOGLE_API_KEY,
        fetchOpts,
      );
      return batch.valueRanges?.[0]?.values || null;
    }

    /**
     * @param {"check"|"poll"} mode
     * check = page load/refresh/visibility: always re-read Enable Live Count
     * poll = background refresh: only when live is already on
     */
    async function fetchCardinalympicsData(mode = "check") {
      const cachedValues = readJsonCookie(CARDINALYMPICS_SCORES_COOKIE);
      const cachedEventsValues = readJsonCookie(CARDINALYMPICS_EVENTS_COOKIE);

      if (showScoresAndScoreboard && cachedValues?.length) {
        applyCardinalympicsValues(cachedValues);
      }
      if (needsCardinalympicsEventsData && cachedEventsValues?.length) {
        applyCardinalympicsEventsValues(cachedEventsValues);
      }

      // Background polls never run while live count is off.
      if (mode === "poll" && !liveCountEnabled) {
        return false;
      }

      if (mode === "poll" && !reserveSheetsRefreshWindow()) {
        return liveCountEnabled;
      }

      try {
        if (showScoresAndScoreboard) {
          const scoreVals = await fetchScoreSheetValues();
          if (scoreVals?.length) {
            const sheetLive = parseCardinalympicsEnableLiveCount(scoreVals);
            writeCardinalympicsLiveFlag(sheetLive);
            liveCountEnabled = sheetLive;

            if (sheetLive) {
              // Live on: accept the latest scores.
              applyCardinalympicsValues(scoreVals);
              writeJsonCookie(CARDINALYMPICS_SCORES_COOKIE, scoreVals);
            } else if (!cachedValues?.length) {
              // Live off and no prior snapshot: seed one frozen copy.
              applyCardinalympicsValues(scoreVals);
              writeJsonCookie(CARDINALYMPICS_SCORES_COOKIE, scoreVals);
            }
            // Live off + existing cache: keep the frozen scores on screen.
          } else {
            console.warn("Cardinalympics scoreboard sheet: empty or missing");
          }
        }

        if (needsCardinalympicsEventsData) {
          const shouldFetchEvents =
            mode === "check" ||
            !cachedEventsValues?.length ||
            reserveSheetsRefreshWindow();
          if (shouldFetchEvents) {
            const batch = await fetchSheetBatchGetWithRetry(
              MAIN_SPREADSHEET_ID,
              [CARDINALYMPICS_EVENTS_SHEET],
              GOOGLE_API_KEY,
              { fetchOptions: { cache: "no-store" } },
            );
            const eventVals = batch.valueRanges?.[0]?.values;
            if (eventVals?.length) {
              applyCardinalympicsEventsValues(eventVals);
              writeJsonCookie(CARDINALYMPICS_EVENTS_COOKIE, eventVals);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }

      return liveCountEnabled;
    }

    let pollId = null;
    const stopPolling = () => {
      if (pollId != null) {
        clearInterval(pollId);
        pollId = null;
      }
    };
    const armPolling = () => {
      stopPolling();
      if (!liveCountEnabled) return;
      pollId = window.setInterval(() => {
        void fetchCardinalympicsData("poll").then((enabled) => {
          liveCountEnabled = enabled;
          if (!enabled) stopPolling();
        });
      }, CARDINALYMPICS_POLL_MS);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopPolling();
        return;
      }
      void fetchCardinalympicsData("check").then((enabled) => {
        liveCountEnabled = enabled;
        if (enabled) armPolling();
        else stopPolling();
      });
    };

    const boot = async () => {
      liveCountEnabled = await fetchCardinalympicsData("check");
      if (typeof document !== "undefined") {
        if (!document.hidden && liveCountEnabled) {
          armPolling();
        }
        document.addEventListener("visibilitychange", onVisibilityChange);
      }
    };

    void boot();

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
      stopPolling();
    };
  }, [
    showScoresAndScoreboard,
    showEvents,
    showHomeEventsSignupNow,
    needsCardinalympicsEventsData,
    location.pathname,
  ]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          element={
            <ElectionTimingProvider config={electionsConfigResolved}>
              <Layout
                clubData={clubData}
                officerData={officerData}
                cardinalympicsEvents={cardinalympicsEvents}
                electionsEnabled={site.electionsEnabled}
                electionsConfig={electionsConfigResolved}
              />
            </ElectionTimingProvider>
          }
        >
          <Route
            path="/"
            element={
              <Home
                cardinalympicsData={cardinalympicsData}
                cardinalympicsEvents={cardinalympicsEvents}
                clubData={clubData}
                showCardinalympicsScores={
                  cardinalympicsConfig.showScoresAndScoreboard
                }
                showCardinalympicsSignupNow={
                  cardinalympicsConfig.showHomeEventsSignupNow
                }
                cardinalympicsDisplayMode={cardinalympicsDisplayMode}
                electionsConfig={electionsConfigResolved}
              />
            }
          />
          <Route path="Elections" element={<Outlet />}>
            <Route
              index
              element={
                <Elections
                  electionsEnabled={site.electionsEnabled}
                  electionsConfig={electionsConfigResolved}
                />
              }
            />
            <Route
              path=":boardSlug"
              element={
                <ElectionBoard electionsConfig={electionsConfigResolved} />
              }
            />
            <Route
              path="Results"
              element={
                <ElectionResults
                  electionsEnabled={site.electionsEnabled}
                  electionsConfig={electionsConfigResolved}
                />
              }
            />
          </Route>

          <Route path="LSA" element={<Outlet />}>
            <Route index element={<AboutLSA />} />
            <Route path="SBC" element={<SBC officerData={officerData} />} />
            <Route path="DSA" element={<DSA />} />
            <Route path="Charter" element={<Charter />} />
            <Route path="Commitees" element={<Committees />} />
            <Route path="Spirit Committee" element={<SpiritCommittee />} />
            <Route
              path=":BoardName"
              element={<LsaTeamPage officerData={officerData} />}
            />
          </Route>

          <Route path="Organizations" element={<Outlet />}>
            <Route index element={<Organization />} />
            <Route path="MockTrial" element={<MockTrial />} />
            <Route path="ShieldAndScroll" element={<ShieldAndScroll />} />
            <Route path="Forensic" element={<Forensic />} />
            <Route path="VideoLowell" element={<VideoLowell />} />
            <Route path="Csf" element={<Csf />} />
            <Route path="PeerResources" element={<PeerResources />} />
            <Route path="Song" element={<Song />} />
            <Route path="Lsrp" element={<Lsrp />} />
            <Route path="Jrotc" element={<Jrotc />} />
            <Route path="CardinalBotics" element={<CardinalBotics />} />
            <Route path="Sac" element={<Sac />} />
          </Route>

          <Route path="Clubs" element={<Outlet />}>
            <Route index element={<Clubs clubData={clubData} />} />
            <Route
              path="ClubResources"
              element={<ClubResources officerData={officerData} />}
            />
            <Route path=":ClubName" element={<Club clubData={clubData} />} />
            <Route
              path="NewClub"
              element={<NewClub officerData={officerData} />}
            />
            <Route
              path="EventPlanning"
              element={<EventPlanning officerData={officerData} />}
            />
            <Route
              path="Fundraising"
              element={<Fundraising officerData={officerData} />}
            />
          </Route>

          <Route path="Resources" element={<Outlet />}>
            <Route index element={<Resources />} />
            <Route path="Wellness" element={<Wellness />} />
            <Route path="TitleIX" element={<TitleIX />} />
          </Route>
          <Route
            path="LSA-EXPLORE"
            element={<Navigate to="/LSA" replace />}
          />
          <Route
            path="Wellness"
            element={<Navigate to="/Resources/Wellness" replace />}
          />
          <Route
            path="TitleIX"
            element={<Navigate to="/Resources/TitleIX" replace />}
          />

          <Route path="FreshmenCorner" element={<FreshMenCorner />} />
          <Route path="Registry" element={<Registry />} />
          <Route path="Events" element={<Events />} />
          <Route path="AboutSite" element={<Site />} />
          <Route path="Archives" element={<Archives />} />
          <Route
            path="Cardinalympics"
            element={
              <Cardinalympics
                cardinalympicsData={cardinalympicsData}
                scoreboardRows={scoreboardRows}
                cardinalympicsEvents={cardinalympicsEvents}
                showScoresAndScoreboard={showScoresAndScoreboard}
                showScoreBreakdown={showScoreBreakdown}
                showWinningChances={showWinningChances}
                showEvents={showEvents}
                cardinalympicsDisplayMode={cardinalympicsDisplayMode}
              />
            }
          />
          <Route path="More" element={<More />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

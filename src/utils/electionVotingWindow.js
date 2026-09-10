import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
} from "react";
import PropTypes from "prop-types";
import {
  areElectionResultsReleased,
  parseResultsReleaseAtMs,
} from "./electionAccess.js";

const ElectionNowContext = createContext(null);
let electionDateTimeFormatter = null;

function parseVotingOpensAtMs(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  const ms = Date.parse(s);
  return Number.isNaN(ms) ? null : ms;
}

function formatElectionDate(ms) {
  try {
    electionDateTimeFormatter ??= new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
    return electionDateTimeFormatter.format(new Date(ms));
  } catch {
    return new Date(ms).toLocaleString();
  }
}

function scheduleDeadlineTicks(tick, deadlines) {
  return deadlines.reduce((timeoutIds, deadline) => {
    if (deadline != null && deadline > Date.now()) {
      timeoutIds.push(
        window.setTimeout(tick, Math.min(deadline - Date.now() + 400, 86_400_000))
      );
    }
    return timeoutIds;
  }, []);
}

function getElectionTimingPhase(config, now) {
  return [
    isElectionVotingLive(config, now),
    isElectionVotingMessagingLive(config, now),
    areElectionResultsReleased(config, now),
  ].join(":");
}

export function ElectionTimingProvider({ config, children }) {
  const votingOpensAt = String(config?.votingOpensAt ?? "").trim();
  const resultsReleaseAt = String(config?.resultsReleaseAt ?? "").trim();
  const [timing, setTiming] = useState(() => {
    const now = Date.now();
    return { now, phase: getElectionTimingPhase(config, now) };
  });

  useEffect(() => {
    const tick = () => {
      const nextNow = Date.now();
      const nextPhase = getElectionTimingPhase(config, nextNow);
      setTiming((current) =>
        nextPhase === current.phase
          ? current
          : { now: nextNow, phase: nextPhase }
      );
    };
    tick();
    const intervalId = window.setInterval(tick, 30_000);
    const timeoutIds = scheduleDeadlineTicks(tick, [
      parseVotingOpensAtMs(votingOpensAt),
      parseResultsReleaseAtMs(resultsReleaseAt),
    ]);
    return () => {
      window.clearInterval(intervalId);
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [config, votingOpensAt, resultsReleaseAt]);

  return createElement(ElectionNowContext.Provider, { value: timing.now }, children);
}

ElectionTimingProvider.propTypes = {
  config: PropTypes.object,
  children: PropTypes.node.isRequired,
};

function useElectionNow(config) {
  const sharedNow = useContext(ElectionNowContext);
  const hasSharedClock = sharedNow != null;
  const votingOpensAt = String(config?.votingOpensAt ?? "").trim();
  const resultsReleaseAt = String(config?.resultsReleaseAt ?? "").trim();
  const [localNow, setLocalNow] = useState(Date.now);

  useEffect(() => {
    if (hasSharedClock) return undefined;
    const tick = () => setLocalNow(Date.now());
    const intervalId = window.setInterval(tick, 30_000);
    const timeoutIds = scheduleDeadlineTicks(tick, [
      parseVotingOpensAtMs(votingOpensAt),
      parseResultsReleaseAtMs(resultsReleaseAt),
    ]);
    return () => {
      window.clearInterval(intervalId);
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [hasSharedClock, votingOpensAt, resultsReleaseAt]);

  return sharedNow ?? localNow;
}

/**
 * True when votingFormUrl is set and (votingOpensAt is empty/invalid OR now >= votingOpensAt).
 * votingOpensAt: ISO 8601 recommended, e.g. 2026-04-27T10:20:00-07:00
 */
export function isElectionVotingLive(config, now = Date.now()) {
  const url = String(config?.votingFormUrl ?? "").trim();
  if (!url) return false;
  const ms = parseVotingOpensAtMs(config?.votingOpensAt);
  if (ms == null) return true;
  return now >= ms;
}

/**
 * True once voting should be announced (subtitle/banner copy): after votingOpensAt if set,
 * otherwise same moment as form links go live (URL with no schedule).
 */
export function isElectionVotingMessagingLive(config, now = Date.now()) {
  const ms = parseVotingOpensAtMs(config?.votingOpensAt);
  if (ms != null) return now >= ms;
  return isElectionVotingLive(config, now);
}

/** Human-readable open time in the user's locale (for "Voting opens …" copy). */
export function formatElectionVotingOpensAt(config) {
  const ms = parseVotingOpensAtMs(config?.votingOpensAt);
  if (ms == null) return "";
  return formatElectionDate(ms);
}

/**
 * Re-computes when voting opens (interval + one shot at open time) so CTAs appear without refresh.
 */
export function useElectionVotingLive(config) {
  const now = useElectionNow(config);
  return isElectionVotingLive(config, now);
}

export function useElectionVotingMessagingLive(config) {
  const now = useElectionNow(config);
  return isElectionVotingMessagingLive(config, now);
}

/** Human-readable release time for election results (same pattern as voting opens). */
export function formatElectionResultsReleaseAt(config) {
  const ms = parseResultsReleaseAtMs(config?.resultsReleaseAt);
  if (ms == null) return "";
  return formatElectionDate(ms);
}

/** Subtitle + optional detail for candidate view during results embargo (`resultsReleaseAt` not reached). */
export function getResultsEmbargoCopy(config) {
  const whenLabel = formatElectionResultsReleaseAt(config);
  const subtitle = config?.resultsPendingTitle ?? "Results go live soon";
  const detailRaw =
    String(config?.resultsPendingSubtitle ?? "").trim() ||
    (whenLabel ? `Detailed results will be posted ${whenLabel}.` : "");
  return {
    subtitle,
    detail: detailRaw || undefined,
  };
}

/**
 * Re-computes when results unlock (interval + one shot at release time) so the page updates without refresh.
 */
export function useElectionResultsReleased(config) {
  const now = useElectionNow(config);
  return areElectionResultsReleased(config, now);
}

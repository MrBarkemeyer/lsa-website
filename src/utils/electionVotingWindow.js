import { useState, useEffect } from "react";
import {
  areElectionResultsReleased,
  parseResultsReleaseAtMs,
} from "./electionAccess.js";

function parseVotingOpensAtMs(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  const ms = Date.parse(s);
  return Number.isNaN(ms) ? null : ms;
}

/**
 * True when votingFormUrl is set and (votingOpensAt is empty/invalid OR now >= votingOpensAt).
 * votingOpensAt: ISO 8601 recommended, e.g. 2026-04-27T10:20:00-07:00
 */
export function isElectionVotingLive(config) {
  const url = String(config?.votingFormUrl ?? "").trim();
  if (!url) return false;
  const ms = parseVotingOpensAtMs(config?.votingOpensAt);
  if (ms == null) return true;
  return Date.now() >= ms;
}

/**
 * True once voting should be announced (subtitle/banner copy): after votingOpensAt if set,
 * otherwise same moment as form links go live (URL with no schedule).
 */
export function isElectionVotingMessagingLive(config) {
  const ms = parseVotingOpensAtMs(config?.votingOpensAt);
  if (ms != null) return Date.now() >= ms;
  return isElectionVotingLive(config);
}

/** Human-readable open time in the user's locale (for "Voting opens …" copy). */
export function formatElectionVotingOpensAt(config) {
  const ms = parseVotingOpensAtMs(config?.votingOpensAt);
  if (ms == null) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toLocaleString();
  }
}

/**
 * Re-computes when voting opens (interval + one shot at open time) so CTAs appear without refresh.
 */
export function useElectionVotingLive(config) {
  const url = String(config?.votingFormUrl ?? "").trim();
  const opensAtKey = String(config?.votingOpensAt ?? "").trim();

  const snapshot = { votingFormUrl: url, votingOpensAt: opensAtKey || undefined };
  const [live, setLive] = useState(() => isElectionVotingLive(snapshot));

  useEffect(() => {
    const snap = { votingFormUrl: url, votingOpensAt: opensAtKey || undefined };
    const tick = () => setLive(isElectionVotingLive(snap));
    tick();
    const intervalId = window.setInterval(tick, 30_000);
    const openMs = parseVotingOpensAtMs(opensAtKey);
    let timeoutId = null;
    if (openMs != null && openMs > Date.now()) {
      const delay = Math.min(openMs - Date.now() + 400, 86_400_000);
      timeoutId = window.setTimeout(tick, delay);
    }
    return () => {
      window.clearInterval(intervalId);
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, [url, opensAtKey]);

  return live;
}

export function useElectionVotingMessagingLive(config) {
  const url = String(config?.votingFormUrl ?? "").trim();
  const opensAtKey = String(config?.votingOpensAt ?? "").trim();

  const snapshot = { votingFormUrl: url, votingOpensAt: opensAtKey || undefined };
  const [live, setLive] = useState(() => isElectionVotingMessagingLive(snapshot));

  useEffect(() => {
    const snap = { votingFormUrl: url, votingOpensAt: opensAtKey || undefined };
    const tick = () => setLive(isElectionVotingMessagingLive(snap));
    tick();
    const intervalId = window.setInterval(tick, 30_000);
    const openMs = parseVotingOpensAtMs(opensAtKey);
    let timeoutId = null;
    if (openMs != null && openMs > Date.now()) {
      const delay = Math.min(openMs - Date.now() + 400, 86_400_000);
      timeoutId = window.setTimeout(tick, delay);
    }
    return () => {
      window.clearInterval(intervalId);
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, [url, opensAtKey]);

  return live;
}

/** Human-readable release time for election results (same pattern as voting opens). */
export function formatElectionResultsReleaseAt(config) {
  const ms = parseResultsReleaseAtMs(config?.resultsReleaseAt);
  if (ms == null) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toLocaleString();
  }
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
  const releaseAtKey = String(config?.resultsReleaseAt ?? "").trim();
  const [released, setReleased] = useState(() =>
    areElectionResultsReleased({ resultsReleaseAt: releaseAtKey || undefined })
  );

  useEffect(() => {
    const snap = { resultsReleaseAt: releaseAtKey || undefined };
    const tick = () => setReleased(areElectionResultsReleased(snap));
    tick();
    const intervalId = window.setInterval(tick, 30_000);
    const releaseMs = parseResultsReleaseAtMs(releaseAtKey);
    let timeoutId = null;
    if (releaseMs != null && releaseMs > Date.now()) {
      const delay = Math.min(releaseMs - Date.now() + 400, 86_400_000);
      timeoutId = window.setTimeout(tick, delay);
    }
    return () => {
      window.clearInterval(intervalId);
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, [releaseAtKey]);

  return released;
}

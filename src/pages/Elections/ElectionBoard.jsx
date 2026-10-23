import { useParams, Link, Navigate, useSearchParams } from "react-router-dom";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import electionsConfig from "../../config/elections.config.js";
import LoadingTruck from "../../components/LoadingTruck";
import SafeImage from "../../components/SafeImage";
import { driveThumbnailCandidates } from "../../utils/driveMedia.js";
import { areElectionBoardsPublic } from "../../utils/electionAccess.js";
import {
  useElectionVotingLive,
  useElectionVotingMessagingLive,
  formatElectionVotingOpensAt,
} from "../../utils/electionVotingWindow.js";
import {
  ElectionMediaModal,
  extractYouTubeVideoId,
  buildYouTubeElectionCardEmbedSrc,
  boardHasYouTubeCandidate,
  videoSourceCandidates,
  kickYoutubeAudible,
  silenceYoutubePreview,
} from "./electionMediaShared.jsx";
import {
  ELECTIONS_BASE,
  ELECTIONS_HUB,
  isElectionsHubSlug,
} from "./electionsPaths.js";
import ElectionViewSelect from "./ElectionViewSelect.jsx";
import "./ElectionsBoard.scss";

const DESKTOP_CARDS_PER_ROW_MIN = 2;
const DESKTOP_CARDS_PER_ROW_MAX = 4;
const TABLET_CARDS_PER_ROW_MIN = 1;
const TABLET_CARDS_PER_ROW_MAX = 2;
// iPad / tablet band where the slider is visible (hidden below 700px in CSS)
const TABLET_MEDIA_QUERY = "(min-width: 701px) and (max-width: 1024px)";

function useMatchMedia(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

function normalizeDevCandidate(c) {
  if (typeof c === "string") {
    return { name: c, description: "", pfp: "", video: "" };
  }
  return {
    name: String(c?.name ?? "").trim(),
    description: String(c?.description ?? "").trim(),
    pfp: String(c?.pfp ?? "").trim(),
    video: String(c?.video ?? "").trim(),
  };
}

function petitionTeaser(description) {
  const text = String(description || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  if (text.length <= 90) return text;
  return `${text.slice(0, 87).trim()}…`;
}

function useCandidateMediaPreview(video) {
  const youtubeVideoId = useMemo(() => extractYouTubeVideoId(video), [video]);
  const isYouTube = Boolean(youtubeVideoId);
  const playableVideoSources = useMemo(
    () => videoSourceCandidates(video),
    [video],
  );
  const youtubeEmbedSrc = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return buildYouTubeElectionCardEmbedSrc(youtubeVideoId, origin);
  }, [youtubeVideoId]);

  const [previewMounted, setPreviewMounted] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [videoSourceIndex, setVideoSourceIndex] = useState(0);
  const youtubeRef = useRef(null);
  const fileVideoRef = useRef(null);
  const videoSrc = playableVideoSources[videoSourceIndex] || video || "";
  const hasVideo = Boolean(video);

  useEffect(() => {
    setVideoSourceIndex(0);
    setPreviewMounted(false);
    setPreviewVisible(false);
  }, [video]);

  const handleMouseEnter = () => {
    if (!hasVideo) return;
    setPreviewMounted(true);
    setPreviewVisible(true);
    window.requestAnimationFrame(() => {
      if (isYouTube) kickYoutubeAudible(youtubeRef.current, true);
      else {
        const el = fileVideoRef.current;
        if (!el) return;
        el.muted = false;
        el.play().catch(() => {
          el.muted = true;
          el.play().catch(() => {});
        });
      }
    });
  };

  const handleMouseLeave = () => {
    if (!hasVideo) return;
    setPreviewVisible(false);
    if (isYouTube) silenceYoutubePreview(youtubeRef.current);
    else {
      const el = fileVideoRef.current;
      if (el) {
        el.muted = true;
        el.pause();
      }
    }
  };

  return {
    hasVideo,
    isYouTube,
    youtubeEmbedSrc,
    previewMounted,
    previewVisible,
    videoSrc,
    playableVideoSources,
    setVideoSourceIndex,
    youtubeRef,
    fileVideoRef,
    handleMouseEnter,
    handleMouseLeave,
  };
}

function DevCandidateCard({
  candidate,
  role,
  accentColor,
  index,
  priority = false,
  onOpenMedia,
  showVoteButton,
  votingFormUrl,
  voteButtonText,
}) {
  const { name, description, pfp, video } = candidate;
  const flyerSources = useMemo(
    () => (pfp ? driveThumbnailCandidates(pfp, "w800") : []),
    [pfp],
  );
  const loadedFlyerRef = useRef("");
  const media = useCandidateMediaPreview(video);

  const openCard = () =>
    onOpenMedia({
      ...candidate,
      role,
      resolvedPfp: loadedFlyerRef.current,
    });

  return (
    <article
      className="elections-dev-card"
      style={{
        "--card-accent": accentColor || "var(--lowell-red)",
        "--card-delay": `${Math.min(index, 11) * 40}ms`,
      }}
      onMouseEnter={media.handleMouseEnter}
      onMouseLeave={media.handleMouseLeave}
      onClick={(event) => {
        if (event.target.closest("a")) return;
        openCard();
      }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openCard();
      }}
      tabIndex={0}
    >
      <div className="elections-dev-card__media">
        {media.hasVideo ? (
          <span
            className="elections-dev-card__video-tag"
            aria-label="Has campaign video"
          >
            VIDEO
          </span>
        ) : null}
        {flyerSources.length ? (
          <SafeImage
            className="elections-dev-card__image"
            src={flyerSources}
            alt=""
            variant="club"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            onLoad={(event) => {
              const url = event.currentTarget.currentSrc || "";
              if (url && !url.startsWith("data:")) loadedFlyerRef.current = url;
            }}
          />
        ) : (
          <div className="elections-dev-card__placeholder" aria-hidden="true">
            <span className="elections-dev-card__placeholder-mark">
              {(name || "?").charAt(0)}
            </span>
          </div>
        )}
        {media.previewMounted && media.isYouTube ? (
          <iframe
            ref={media.youtubeRef}
            title={`${name} campaign video preview`}
            className={`elections-dev-card__preview${media.previewVisible ? " elections-dev-card__preview--visible" : ""}`}
            src={media.youtubeEmbedSrc}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        ) : null}
        {media.previewMounted && !media.isYouTube && media.hasVideo ? (
          <video
            ref={media.fileVideoRef}
            className={`elections-dev-card__preview${media.previewVisible ? " elections-dev-card__preview--visible" : ""}`}
            src={media.videoSrc || undefined}
            muted={!media.previewVisible}
            loop
            playsInline
            preload="metadata"
            onError={() => {
              media.setVideoSourceIndex((i) =>
                i < media.playableVideoSources.length - 1 ? i + 1 : i,
              );
            }}
          />
        ) : null}
        <div className="elections-dev-card__media-bar" aria-hidden>
          {media.hasVideo
            ? media.previewVisible
              ? "PLAYING PREVIEW"
              : "HOVER TO PLAY VIDEO"
            : "CLICK TO OPEN"}
        </div>
      </div>
      <div className="elections-dev-card__body">
        {role ? (
          <span className="elections-dev-card__category">{role}</span>
        ) : null}
        <h3 className="elections-dev-card__name">{name}</h3>
        {description ? (
          <p className="elections-dev-card__meta">
            {petitionTeaser(description)}
          </p>
        ) : null}
        <span className="elections-dev-card__cta" aria-hidden="true">
          View petition
          <FontAwesomeIcon
            icon={faArrowRight}
            className="elections-dev-card__cta-icon"
          />
        </span>
        {showVoteButton && votingFormUrl ? (
          <a
            href={votingFormUrl}
            className="elections-dev-card__vote"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            {voteButtonText}
          </a>
        ) : null}
      </div>
    </article>
  );
}

DevCandidateCard.propTypes = {
  candidate: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    pfp: PropTypes.string,
    video: PropTypes.string,
  }).isRequired,
  role: PropTypes.string,
  accentColor: PropTypes.string,
  index: PropTypes.number,
  priority: PropTypes.bool,
  onOpenMedia: PropTypes.func.isRequired,
  showVoteButton: PropTypes.bool,
  votingFormUrl: PropTypes.string,
  voteButtonText: PropTypes.string,
};

function ClassicDevCandidateCard({
  candidate,
  role,
  accentColor,
  priority = false,
  onOpenMedia,
  showVoteButton,
  votingFormUrl,
  voteButtonText,
}) {
  const { name, description, pfp, video } = candidate;
  const flyerSources = useMemo(
    () => (pfp ? driveThumbnailCandidates(pfp, "w800") : []),
    [pfp],
  );
  const loadedFlyerRef = useRef("");
  const media = useCandidateMediaPreview(video);

  const openCard = () =>
    onOpenMedia({
      ...candidate,
      role,
      resolvedPfp: loadedFlyerRef.current,
    });

  return (
    <article
      className="elections-dev-classic-card"
      style={{
        "--card-accent": accentColor || "var(--lowell-red)",
      }}
      onMouseEnter={media.handleMouseEnter}
      onMouseLeave={media.handleMouseLeave}
      onClick={(event) => {
        if (event.target.closest("a")) return;
        openCard();
      }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openCard();
      }}
      tabIndex={0}
    >
      <div className="elections-dev-classic-card__media">
        {media.hasVideo ? (
          <span
            className="elections-dev-classic-card__video-tag"
            aria-label="Has campaign video"
          >
            VIDEO
          </span>
        ) : null}
        {flyerSources.length ? (
          <SafeImage
            className="elections-dev-classic-card__image"
            src={flyerSources}
            alt={name}
            variant="club"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            onLoad={(event) => {
              const url = event.currentTarget.currentSrc || "";
              if (url && !url.startsWith("data:")) loadedFlyerRef.current = url;
            }}
          />
        ) : (
          <div
            className="elections-dev-classic-card__placeholder"
            aria-hidden="true"
          >
            <span className="elections-dev-classic-card__placeholder-mark">
              {(name || "?").charAt(0)}
            </span>
          </div>
        )}
        {media.previewMounted && media.isYouTube ? (
          <iframe
            ref={media.youtubeRef}
            title={`${name} campaign video preview`}
            className={`elections-dev-classic-card__preview${media.previewVisible ? " elections-dev-classic-card__preview--visible" : ""}`}
            src={media.youtubeEmbedSrc}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        ) : null}
        {media.previewMounted && !media.isYouTube && media.hasVideo ? (
          <video
            ref={media.fileVideoRef}
            className={`elections-dev-classic-card__preview${media.previewVisible ? " elections-dev-classic-card__preview--visible" : ""}`}
            src={media.videoSrc || undefined}
            muted={!media.previewVisible}
            loop
            playsInline
            preload="metadata"
            onError={() => {
              media.setVideoSourceIndex((i) =>
                i < media.playableVideoSources.length - 1 ? i + 1 : i,
              );
            }}
          />
        ) : null}
        <div className="elections-dev-classic-card__media-bar" aria-hidden>
          {media.hasVideo
            ? media.previewVisible
              ? "PLAYING PREVIEW"
              : "HOVER TO PLAY VIDEO"
            : "CLICK TO OPEN"}
        </div>
      </div>
      <div className="elections-dev-classic-card__body">
        {role ? (
          <span className="elections-dev-classic-card__category">{role}</span>
        ) : null}
        <h3 className="elections-dev-classic-card__name">{name}</h3>
        {description ? (
          <p className="elections-dev-classic-card__description">
            {description}
          </p>
        ) : null}
        <span className="elections-dev-classic-card__cta" aria-hidden="true">
          View petition
          <FontAwesomeIcon
            icon={faArrowRight}
            className="elections-dev-classic-card__cta-icon"
          />
        </span>
        {showVoteButton && votingFormUrl ? (
          <a
            href={votingFormUrl}
            className="elections-dev-classic-card__vote"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            {voteButtonText}
          </a>
        ) : null}
      </div>
    </article>
  );
}

ClassicDevCandidateCard.propTypes = {
  candidate: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    pfp: PropTypes.string,
    video: PropTypes.string,
  }).isRequired,
  role: PropTypes.string,
  accentColor: PropTypes.string,
  priority: PropTypes.bool,
  onOpenMedia: PropTypes.func.isRequired,
  showVoteButton: PropTypes.bool,
  votingFormUrl: PropTypes.string,
  voteButtonText: PropTypes.string,
};

export default function ElectionBoard({
  electionsConfig: config = electionsConfig,
  boardSlug: boardSlugProp = "",
  resultsEmbargo = null,
}) {
  const { boardSlug: boardSlugParam } = useParams();
  const boardSlug = boardSlugProp || boardSlugParam;
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMedia, setActiveMedia] = useState(null);
  const filterListRef = useRef(null);
  const [filterFade, setFilterFade] = useState({ left: false, right: false });
  const isTablet = useMatchMedia(TABLET_MEDIA_QUERY);
  const cardsPerRowMin = isTablet
    ? TABLET_CARDS_PER_ROW_MIN
    : DESKTOP_CARDS_PER_ROW_MIN;
  const cardsPerRowMax = isTablet
    ? TABLET_CARDS_PER_ROW_MAX
    : DESKTOP_CARDS_PER_ROW_MAX;
  const [cardsPerRowSlider, setCardsPerRowSlider] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      if (window.matchMedia(TABLET_MEDIA_QUERY).matches) {
        return TABLET_CARDS_PER_ROW_MIN;
      }
    }
    return DESKTOP_CARDS_PER_ROW_MIN;
  });
  const votingLive = useElectionVotingLive(config);
  const messagingLive = useElectionVotingMessagingLive(config);

  useEffect(() => {
    setCardsPerRowSlider((prev) => {
      if (isTablet) {
        if (
          prev < TABLET_CARDS_PER_ROW_MIN ||
          prev > TABLET_CARDS_PER_ROW_MAX
        ) {
          return TABLET_CARDS_PER_ROW_MIN;
        }
        return Math.round(prev);
      }
      if (prev < DESKTOP_CARDS_PER_ROW_MIN) {
        return DESKTOP_CARDS_PER_ROW_MIN;
      }
      return Math.min(DESKTOP_CARDS_PER_ROW_MAX, Math.round(prev));
    });
  }, [isTablet]);

  const cardsPerRow = Math.min(
    cardsPerRowMax,
    Math.max(cardsPerRowMin, Math.round(cardsPerRowSlider)),
  );
  // Classic side-by-side only on desktop; iPad uses 1–2 column club cards
  const isClassic = !isTablet && cardsPerRow === 2;

  const handleOpenElectionMedia = useCallback((payload) => {
    setActiveMedia(payload);
  }, []);

  const handleCloseElectionMedia = useCallback(() => {
    setActiveMedia(null);
  }, []);

  const { board, prevSlug, nextSlug, boardCount } = useMemo(() => {
    const contenders = config?.contenders ?? [];
    const list = contenders.filter((b) => b.slug != null);
    const index = list.findIndex((b) => b.slug === boardSlug);
    const boardData = index >= 0 ? list[index] : null;
    return {
      board: boardData,
      prevSlug: index > 0 ? list[index - 1].slug : null,
      nextSlug:
        index >= 0 && index < list.length - 1 ? list[index + 1].slug : null,
      boardCount: list.length,
    };
  }, [config, boardSlug]);

  const hasYoutubeOnBoard = useMemo(
    () => boardHasYouTubeCandidate(board),
    [board],
  );

  useEffect(() => {
    if (!hasYoutubeOnBoard) return undefined;
    const hrefs = ["https://www.youtube.com", "https://i.ytimg.com"];
    const created = [];
    for (const href of hrefs) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = href;
      document.head.appendChild(link);
      created.push(link);
    }
    return () => {
      created.forEach((el) => el.remove());
    };
  }, [hasYoutubeOnBoard]);

  const roleQuery = searchParams.get("role") || "";
  const nameQueryRaw = (searchParams.get("q") || "").trim().toLowerCase();
  const deferredNameQuery = useDeferredValue(nameQueryRaw);

  const roles = useMemo(
    () => (board?.roles ?? []).map((group) => group.role).filter(Boolean),
    [board],
  );

  const updateFilterFade = useCallback(() => {
    const el = filterListRef.current;
    if (!el) {
      setFilterFade({ left: false, right: false });
      return;
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    setFilterFade({
      left: el.scrollLeft > 2,
      right: maxScroll > 2 && el.scrollLeft < maxScroll - 2,
    });
  }, []);

  useEffect(() => {
    const el = filterListRef.current;
    if (!el) return undefined;
    updateFilterFade();
    const onScroll = () => updateFilterFade();
    el.addEventListener("scroll", onScroll, { passive: true });
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateFilterFade())
        : null;
    observer?.observe(el);
    window.addEventListener("resize", updateFilterFade);
    return () => {
      el.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      window.removeEventListener("resize", updateFilterFade);
    };
  }, [updateFilterFade, roles.length, roleQuery, nameQueryRaw, isTablet]);

  const sections = useMemo(() => {
    if (!board) return [];
    return (board.roles ?? []).flatMap((roleGroup) => {
      if (roleQuery && roleGroup.role !== roleQuery) return [];
      const candidates = (roleGroup.candidates ?? [])
        .map(normalizeDevCandidate)
        .filter((candidate) => candidate.name)
        .filter(
          (candidate) =>
            !deferredNameQuery ||
            candidate.name.toLowerCase().includes(deferredNameQuery),
        );
      if (candidates.length === 0) return [];
      return [{ role: roleGroup.role, candidates }];
    });
  }, [board, roleQuery, deferredNameQuery]);

  const flatCandidates = useMemo(
    () =>
      sections.flatMap((section) =>
        section.candidates.map((candidate) => ({
          ...candidate,
          role: section.role,
        })),
      ),
    [sections],
  );

  const totalCandidates = flatCandidates.length;
  const roleFilterActive = Boolean(roleQuery);

  const setElectionQuery = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params, { replace: true });
  };

  if (isElectionsHubSlug(boardSlug)) {
    return <Navigate to={ELECTIONS_HUB} replace />;
  }

  if (!areElectionBoardsPublic(config)) {
    return <Navigate to="/Elections" replace />;
  }

  if (!board) {
    return <LoadingTruck />;
  }

  const accentColor = board.color || "var(--lowell-red)";
  const votingFormUrl = String(config?.votingFormUrl ?? "").trim();
  const voteButtonText =
    String(config?.voteButtonText ?? "Vote now").trim() || "Vote now";
  const showVoteNowButtons =
    Boolean(votingFormUrl) && votingLive && !messagingLive;
  const votingOpensHint =
    !messagingLive && String(config?.votingOpensAt ?? "").trim()
      ? formatElectionVotingOpensAt(config)
      : "";
  const votingLiveReminder = String(
    config?.votingLivePollingSubtitle ?? "",
  ).trim();

  const cardSharedProps = {
    accentColor,
    onOpenMedia: handleOpenElectionMedia,
    showVoteButton: showVoteNowButtons,
    votingFormUrl,
    voteButtonText,
  };

  const renderCard = (candidate, index) =>
    isClassic ? (
      <ClassicDevCandidateCard
        key={`${candidate.role}-${candidate.name}`}
        candidate={candidate}
        role={candidate.role}
        priority={index < 2}
        {...cardSharedProps}
      />
    ) : (
      <DevCandidateCard
        key={`${candidate.role}-${candidate.name}`}
        candidate={candidate}
        role={candidate.role}
        index={index}
        priority={index < 2}
        {...cardSharedProps}
      />
    );

  const gridClassName = isClassic
    ? "elections-dev__classic-grid"
    : "elections-dev__grid";
  const gridStyle = isClassic
    ? undefined
    : { "--elections-dev-cols": String(cardsPerRow) };

  const renderCandidateList = () => {
    if (totalCandidates === 0) {
      return (
        <div className="elections-dev__empty">
          <h2 className="elections-dev__empty-title">No candidates match</h2>
          <p className="elections-dev__empty-text">
            Try adjusting your search or role filter.
          </p>
        </div>
      );
    }

    if (roleFilterActive) {
      return (
        <div className={gridClassName} style={gridStyle}>
          {flatCandidates.map((candidate, index) =>
            renderCard(candidate, index),
          )}
        </div>
      );
    }

    let runningIndex = 0;
    return sections.map((section) => {
      const sectionItems = section.candidates.map((candidate) => ({
        ...candidate,
        role: section.role,
      }));
      if (!sectionItems.length) return null;
      const startIndex = runningIndex;
      runningIndex += sectionItems.length;
      return (
        <div key={section.role} className="elections-dev__role-section">
          <h2 className="elections-dev__role-title">{section.role}</h2>
          <div className={gridClassName} style={gridStyle}>
            {sectionItems.map((candidate, index) =>
              renderCard(candidate, startIndex + index),
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <section
      className={`elections-dev${isClassic ? " elections-dev--classic" : " elections-dev--grid"}`}
      style={{ "--board-accent": accentColor }}
    >
      <ElectionMediaModal
        media={activeMedia}
        onClose={handleCloseElectionMedia}
      />
      <div className="elections-dev__hero elections-dev__hero--board">
        {boardCount > 1 ? (
          <Link to={ELECTIONS_HUB} className="elections-dev__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            All boards
          </Link>
        ) : null}
        <h1>{board.board}</h1>
        <p className="elections-dev__tagline">Meet the candidates</p>
        {messagingLive && votingLiveReminder ? (
          <p className="elections-dev__hint">{votingLiveReminder}</p>
        ) : votingOpensHint ? (
          <p className="elections-dev__hint">Voting opens {votingOpensHint}.</p>
        ) : null}
        {resultsEmbargo ? (
          <p className="elections-dev__hint">
            {resultsEmbargo.subtitle}
            {resultsEmbargo.detail ? ` ${resultsEmbargo.detail}` : ""}
          </p>
        ) : null}
        <ElectionViewSelect config={config} view="candidates" />
      </div>

      <div className="elections-dev__filters">
        <div className="elections-dev__filters-row">
          <div className="elections-dev__search">
            <label
              className="elections-dev__search-label"
              htmlFor="elections-dev-search"
            >
              Search candidates
            </label>
            <input
              id="elections-dev-search"
              type="search"
              className="elections-dev__search-input"
              placeholder="Search by name..."
              value={searchParams.get("q") || ""}
              onChange={(event) => setElectionQuery("q", event.target.value)}
            />
          </div>

          <p className="elections-dev__filter-scroll-hint">
            Swipe or scroll sideways for all roles
          </p>
          <div className="elections-dev__filters-tools">
            <div
              ref={filterListRef}
              className={[
                "elections-dev__filter-list",
                filterFade.left ? "elections-dev__filter-list--fade-left" : "",
                filterFade.right ? "elections-dev__filter-list--fade-right" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              role="group"
              aria-label="Filter by role"
            >
              <button
                type="button"
                className={`elections-dev__filter-btn${!roleQuery ? " elections-dev__filter-btn--active" : ""}`}
                style={{ "--filter-color": accentColor }}
                aria-pressed={!roleQuery}
                onClick={() => setElectionQuery("role", "")}
              >
                All
              </button>
              {roles.map((role) => (
                <button
                  type="button"
                  key={role}
                  className={`elections-dev__filter-btn${roleQuery === role ? " elections-dev__filter-btn--active" : ""}`}
                  style={{ "--filter-color": accentColor }}
                  aria-pressed={roleQuery === role}
                  onClick={() =>
                    setElectionQuery("role", roleQuery === role ? "" : role)
                  }
                >
                  {role}
                </button>
              ))}
            </div>

            <div
              className="elections-dev__layout-group"
              style={{
                "--filter-color": accentColor,
                "--slider-progress": `${
                  ((cardsPerRowSlider - cardsPerRowMin) /
                    Math.max(1, cardsPerRowMax - cardsPerRowMin)) *
                  100
                }%`,
              }}
            >
              <label
                className="elections-dev__layout-label"
                htmlFor="elections-dev-cards-per-row"
              >
                Cards per row
                <span className="elections-dev__layout-value">{cardsPerRow}</span>
              </label>
              <input
                id="elections-dev-cards-per-row"
                type="range"
                className="elections-dev__layout-slider"
                min={cardsPerRowMin}
                max={cardsPerRowMax}
                step={0.01}
                value={Math.min(
                  cardsPerRowMax,
                  Math.max(cardsPerRowMin, cardsPerRowSlider),
                )}
                aria-valuemin={cardsPerRowMin}
                aria-valuemax={cardsPerRowMax}
                aria-valuenow={cardsPerRow}
                aria-valuetext={`${cardsPerRow} cards`}
                onChange={(event) => {
                  setCardsPerRowSlider(Number(event.target.value));
                }}
                onPointerUp={(event) => {
                  const snapped = Math.min(
                    cardsPerRowMax,
                    Math.max(
                      cardsPerRowMin,
                      Math.round(Number(event.currentTarget.value)),
                    ),
                  );
                  setCardsPerRowSlider(snapped);
                }}
                onBlur={(event) => {
                  const snapped = Math.min(
                    cardsPerRowMax,
                    Math.max(
                      cardsPerRowMin,
                      Math.round(Number(event.currentTarget.value)),
                    ),
                  );
                  setCardsPerRowSlider(snapped);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <p className="elections-dev__result-count" aria-live="polite">
        {totalCandidates}{" "}
        {totalCandidates === 1 ? "candidate" : "candidates"}
      </p>

      <div className="elections-dev__main">{renderCandidateList()}</div>

      {boardCount > 1 ? (
        <nav className="elections-dev__nav" aria-label="Board navigation">
          {prevSlug ? (
            <Link
              to={`${ELECTIONS_BASE}/${prevSlug}`}
              className="elections-dev__nav-btn"
            >
              <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
              Last board
            </Link>
          ) : (
            <span className="elections-dev__nav-btn elections-dev__nav-btn--disabled">
              Last board
            </span>
          )}
          <Link to={ELECTIONS_HUB} className="elections-dev__nav-btn">
            All boards
          </Link>
          {nextSlug ? (
            <Link
              to={`${ELECTIONS_BASE}/${nextSlug}`}
              className="elections-dev__nav-btn"
            >
              Next board
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </Link>
          ) : (
            <span className="elections-dev__nav-btn elections-dev__nav-btn--disabled">
              Next board
            </span>
          )}
        </nav>
      ) : null}
    </section>
  );
}

ElectionBoard.propTypes = {
  boardSlug: PropTypes.string,
  resultsEmbargo: PropTypes.shape({
    subtitle: PropTypes.string.isRequired,
    detail: PropTypes.string,
  }),
  electionsConfig: PropTypes.shape({
    votingFormUrl: PropTypes.string,
    votingOpensAt: PropTypes.string,
    votingLivePollingSubtitle: PropTypes.string,
    voteButtonText: PropTypes.string,
    contenders: PropTypes.arrayOf(
      PropTypes.shape({
        slug: PropTypes.string,
        board: PropTypes.string,
        color: PropTypes.string,
        roles: PropTypes.arrayOf(
          PropTypes.shape({
            role: PropTypes.string,
            candidates: PropTypes.array,
          }),
        ),
      }),
    ),
  }),
};

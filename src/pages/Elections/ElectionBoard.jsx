import { useParams, Link, Navigate, useSearchParams } from "react-router-dom";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import electionsConfig from "../../config/elections.config.js";
import LoadingTruck from "../../components/LoadingTruck";
import SafeImage from "../../components/SafeImage";
import Logo from "../../assets/LSA-Logo.png";
import "../More/Events.scss";
import { areElectionBoardsPublic } from "../../utils/electionAccess.js";
import {
  useElectionVotingLive,
  useElectionVotingMessagingLive,
  formatElectionVotingOpensAt,
} from "../../utils/electionVotingWindow.js";
import "./ElectionBoard.scss";

const MEDIA_GLOW_CACHE_KEY = "lsa_election_media_glow_v2";
let mediaGlowCacheMem = null;

function readMediaGlowCache() {
  if (mediaGlowCacheMem) return mediaGlowCacheMem;
  try {
    const raw = localStorage.getItem(MEDIA_GLOW_CACHE_KEY);
    mediaGlowCacheMem = raw ? JSON.parse(raw) : {};
  } catch {
    mediaGlowCacheMem = {};
  }
  return mediaGlowCacheMem;
}

function writeMediaGlowCache(cache) {
  mediaGlowCacheMem = cache;
  try {
    localStorage.setItem(MEDIA_GLOW_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore storage quota/private mode errors
  }
}

function rgbToCss(r, g, b) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function isGoogleDriveUrl(urlRaw) {
  const url = String(urlRaw ?? "").trim();
  return /(^https?:\/\/)?(drive|docs)\.google\.com\//i.test(url);
}

function getAverageColorFromImageUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const sampleW = 48;
        const sampleH = 48;
        const canvas = document.createElement("canvas");
        canvas.width = sampleW;
        canvas.height = sampleH;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          reject(new Error("No canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, sampleW, sampleH);
        const { data } = ctx.getImageData(0, 0, sampleW, sampleH);
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 16) continue;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        if (count === 0) {
          reject(new Error("No opaque pixels"));
          return;
        }
        resolve(rgbToCss(r / count, g / count, b / count));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

// I HATE GOOGLE DRIVE SO FRIGGIN MUCH THIS ENTIRE FILE TOOK FOREVER TO PROGRAM ALOT OF SWEAT TEARS AND HAIR LOSS CAME FROM GOOGLE DRIVE BEING A PAIN - Gavin Z.
async function getAverageColorWithFallback(url) {
  if (isGoogleDriveUrl(url)) {
    // Drive image endpoints usually block CORS for canvas reads.
    // Skip sampling to avoid noisy console CORS errors.
    throw new Error("Drive URL color sampling skipped");
  }
  try {
    return await getAverageColorFromImageUrl(url);
  } catch {
    // Some hosts (esp. Drive links) block canvas sampling by CORS.
    // In that case we skip glow color instead of spamming failed proxy requests.
    throw new Error("Image color sampling unavailable");
  }
}

function postYoutubeIframeCommand(iframe, func, args = []) {
  if (!iframe?.contentWindow) return;
  try {
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func,
        args: Array.isArray(args) ? args : [],
      }),
      "*",
    );
  } catch {
    // ignore
  }
}

function hideYoutubeCaptions(iframe) {
  postYoutubeIframeCommand(iframe, "unloadModule", ["captions"]);
  postYoutubeIframeCommand(iframe, "setOption", ["captions", "track", {}]);
}

function kickYoutubeAudible(iframe, hideCaptions = false) {
  const kick = () => {
    postYoutubeIframeCommand(iframe, "unMute");
    postYoutubeIframeCommand(iframe, "playVideo");
    if (hideCaptions) hideYoutubeCaptions(iframe);
  };
  kick();
  window.setTimeout(kick, 200);
  if (hideCaptions) window.setTimeout(() => hideYoutubeCaptions(iframe), 800);
}

function silenceYoutubePreview(iframe) {
  postYoutubeIframeCommand(iframe, "pauseVideo");
  postYoutubeIframeCommand(iframe, "mute");
}

let dialogVideoHost = null;
const dialogVideoHostListeners = new Set();

function setDialogVideoHost(node) {
  dialogVideoHost = node;
  dialogVideoHostListeners.forEach((fn) => fn());
}

function useDialogVideoHost() {
  const [host, setHost] = useState(null);
  useEffect(() => {
    const sync = () => setHost(dialogVideoHost);
    dialogVideoHostListeners.add(sync);
    sync();
    return () => dialogVideoHostListeners.delete(sync);
  }, []);
  return host;
}

// one candidate: photo (hover = video), name, bio, vote button
function ElectionCandidateCard({
  candidate,
  accentColor,
  onOpenMedia,
  showVoteButton = true,
  votingFormUrl = "",
  voteButtonText = "Vote now",
  activeMedia = null,
  role = "",
}) {
  const { name, description, pfp, video } = candidate;
  const youtubeVideoId = useMemo(() => extractYouTubeVideoId(video), [video]);
  const isYouTubeVideo = Boolean(youtubeVideoId);
  const youtubeCardEmbedSrc = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return buildYouTubeElectionCardEmbedSrc(youtubeVideoId, origin);
  }, [youtubeVideoId]);
  const flyerSources = useMemo(() => imageSourceCandidates(pfp), [pfp]);
  const playableVideoSources = useMemo(
    () => videoSourceCandidates(video),
    [video],
  );
  const hasVideo = Boolean(video);
  const [isHoverPreviewVisible, setIsHoverPreviewVisible] = useState(false);
  const [cardGlowColor, setCardGlowColor] = useState("transparent");
  const [videoSourceIndex, setVideoSourceIndex] = useState(0);
  const articleRef = useRef(null);
  const loadedFlyerRef = useRef("");
  const youtubeIframeRef = useRef(null);
  const youtubeIframeHomeRef = useRef(null);
  const fileVideoRef = useRef(null);
  const fileVideoHomeRef = useRef(null);
  const videoSrc = playableVideoSources[videoSourceIndex] || video || "";
  const myMediaKey = electionCandidateMediaKey(candidate);
  const isThisModalOpen =
    Boolean(activeMedia) &&
    electionCandidateMediaKey(activeMedia) === myMediaKey;

  const [youtubeSlotEl, setYoutubeSlotEl] = useState(null);
  const [fileSlotEl, setFileSlotEl] = useState(null);
  const dialogHost = useDialogVideoHost();
  const inDialog = Boolean(isThisModalOpen && dialogHost);
  const youtubeTarget = inDialog ? dialogHost : youtubeSlotEl;
  const fileTarget = inDialog ? dialogHost : fileSlotEl;

  useEffect(() => {
    if (!isThisModalOpen || inDialog) return undefined;
    silenceYoutubePreview(youtubeIframeRef.current);
    const v = fileVideoRef.current;
    if (v) {
      v.pause();
      v.muted = true;
    }
    return undefined;
  }, [isThisModalOpen, inDialog]);

  useEffect(() => {
    if (!inDialog) return undefined;
    const iframe = youtubeIframeRef.current;
    if (iframe && isYouTubeVideo) {
      const src = String(iframe.getAttribute("src") || "");
      if (!youtubeVideoId || !src.includes(youtubeVideoId))
        iframe.src = youtubeCardEmbedSrc;
      postYoutubeIframeCommand(iframe, "unMute");
      postYoutubeIframeCommand(iframe, "playVideo");
      hideYoutubeCaptions(iframe);
    }
    const file = fileVideoRef.current;
    if (file && !isYouTubeVideo) {
      for (const track of file.textTracks || []) track.mode = "disabled";
      if (file.videoWidth) {
        file.style.aspectRatio = `${file.videoWidth} / ${file.videoHeight}`;
      }
      file.muted = false;
      file.play().catch(() => {
        file.muted = true;
        file.play().catch(() => {});
      });
    }
    return undefined;
  }, [
    inDialog,
    isYouTubeVideo,
    dialogHost,
    youtubeVideoId,
    youtubeCardEmbedSrc,
  ]);

  useLayoutEffect(() => {
    const el = youtubeIframeHomeRef.current;
    setYoutubeSlotEl((prev) => (prev === el ? prev : el));
  }, [isYouTubeVideo, video]);

  useLayoutEffect(() => {
    const el = fileVideoHomeRef.current;
    setFileSlotEl((prev) => (prev === el ? prev : el));
  }, [isYouTubeVideo, video]);

  useEffect(() => {
    setVideoSourceIndex(0);
  }, [video]);

  useEffect(() => {
    let cancelled = false;
    if (!pfp) {
      setCardGlowColor("transparent");
      return;
    }
    const cache = readMediaGlowCache();
    if (cache[pfp]) {
      setCardGlowColor(cache[pfp]);
      return;
    }
    getAverageColorWithFallback(pfp)
      .then((avg) => {
        if (cancelled) return;
        setCardGlowColor(avg);
        const next = { ...readMediaGlowCache(), [pfp]: avg };
        writeMediaGlowCache(next);
      })
      .catch(() => {
        if (cancelled) return;
        setCardGlowColor("transparent");
      });
    return () => {
      cancelled = true;
    };
  }, [pfp]);

  const hoverPreviewRef = useRef(false);

  const onYoutubePreviewIframeLoad = () => {
    const iframe = youtubeIframeRef.current;
    if (!iframe) return;
    if (iframe.classList.contains("election-dialog-video")) {
      postYoutubeIframeCommand(iframe, "unMute");
      postYoutubeIframeCommand(iframe, "playVideo");
      hideYoutubeCaptions(iframe);
      return;
    }
    if (hoverPreviewRef.current) kickYoutubeAudible(iframe, true);
    else silenceYoutubePreview(iframe);
  };

  const youtubeIframeNeedsSrc = useCallback(
    (frame) => {
      if (!frame || !youtubeCardEmbedSrc || !youtubeVideoId) return true;
      const src = String(frame.src || "");
      return !src || !src.includes(youtubeVideoId);
    },
    [youtubeCardEmbedSrc, youtubeVideoId],
  );

  useEffect(() => {
    if (!isYouTubeVideo || !youtubeCardEmbedSrc) return;
    const root = articleRef.current;
    if (!root) return;
    const frame = youtubeIframeRef.current;
    if (frame) {
      frame.src = "";
      frame.classList.remove("election-candidate-card-video--visible");
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        const f = youtubeIframeRef.current;
        if (!f || !entry) return;
        if (!root.contains(f)) return;
        if (entry.isIntersecting) {
          if (youtubeIframeNeedsSrc(f)) f.src = youtubeCardEmbedSrc;
        } else {
          f.src = "";
          f.classList.remove("election-candidate-card-video--visible");
        }
      },
      { root: null, rootMargin: "160px 0px 120px 0px", threshold: 0 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [isYouTubeVideo, youtubeCardEmbedSrc, youtubeIframeNeedsSrc]);

  function setMediaPreviewVisible(container, visible) {
    const videoEl = fileVideoRef.current;
    if (videoEl && !isYouTubeVideo) {
      videoEl.classList.toggle(
        "election-candidate-card-video--visible",
        visible,
      );
      if (typeof videoEl.play === "function") {
        if (visible) {
          for (const track of videoEl.textTracks || []) track.mode = "disabled";
          videoEl.muted = false;
          videoEl
            .play()
            .catch(() => {
              videoEl.muted = true;
              return videoEl.play();
            })
            .catch(() => {});
        } else {
          videoEl.muted = true;
          videoEl.pause();
        }
      }
    }
    const iframeEl = youtubeIframeRef.current;
    if (iframeEl && isYouTubeVideo) {
      iframeEl.classList.toggle(
        "election-candidate-card-video--visible",
        visible,
      );
      if (visible) {
        if (youtubeCardEmbedSrc && youtubeIframeNeedsSrc(iframeEl))
          iframeEl.src = youtubeCardEmbedSrc;
        kickYoutubeAudible(iframeEl, true);
      } else {
        silenceYoutubePreview(iframeEl);
      }
    }
  }

  const handleMouseEnter = (e) => {
    if (!hasVideo) return;
    hoverPreviewRef.current = true;
    setMediaPreviewVisible(e.currentTarget, true);
    setIsHoverPreviewVisible(true);
  };

  const handleMouseLeave = (e) => {
    if (!hasVideo) return;
    setMediaPreviewVisible(e.currentTarget, false);
    hoverPreviewRef.current = false;
    setIsHoverPreviewVisible(false);
  };

  const openCard = () =>
    onOpenMedia({
      ...candidate,
      role,
      resolvedPfp: loadedFlyerRef.current,
    });

  return (
    <article
      ref={articleRef}
      className="election-candidate-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
      style={{ "--card-glow-color": cardGlowColor }}
    >
      <div
        className="election-candidate-card-media"
        style={{ "--card-accent": accentColor || "var(--title-color)" }}
      >
        {hasVideo && (
          <span
            className="election-candidate-card-video-tag"
            aria-label="Has campaign video"
          >
            VIDEO
          </span>
        )}
        <SafeImage
          src={flyerSources}
          alt={name}
          className="election-candidate-card-pfp"
          loading="lazy"
          variant="club"
          onLoad={(event) => {
            const url = event.currentTarget.currentSrc || "";
            if (url && !url.startsWith("data:")) loadedFlyerRef.current = url;
          }}
        />
        {video && isYouTubeVideo && (
          <div
            ref={youtubeIframeHomeRef}
            className="election-candidate-card-preview-player-slot"
          >
            {youtubeTarget &&
              createPortal(
                <iframe
                  key={youtubeCardEmbedSrc || youtubeVideoId || "yt"}
                  ref={youtubeIframeRef}
                  title={`${name} campaign video preview`}
                  className={
                    inDialog
                      ? "election-dialog-video"
                      : "election-candidate-card-video election-candidate-card-youtube-preview election-candidate-card-video-preview"
                  }
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  onLoad={onYoutubePreviewIframeLoad}
                />,
                youtubeTarget,
              )}
          </div>
        )}
        {video && !isYouTubeVideo && (
          <div
            ref={fileVideoHomeRef}
            className="election-candidate-card-preview-player-slot"
          >
            {fileTarget &&
              createPortal(
                <video
                  key={videoSrc || video || "file"}
                  ref={fileVideoRef}
                  className={
                    inDialog
                      ? "election-dialog-video"
                      : "election-candidate-card-video election-candidate-card-video-preview"
                  }
                  src={videoSrc || undefined}
                  controls={inDialog}
                  muted={!inDialog && !isHoverPreviewVisible}
                  loop
                  playsInline
                  preload="metadata"
                  onError={() => {
                    setVideoSourceIndex((i) =>
                      i < playableVideoSources.length - 1 ? i + 1 : i,
                    );
                  }}
                />,
                fileTarget,
              )}
          </div>
        )}
        <div className="election-candidate-card-media-bar" aria-hidden>
          {video && (
            <span className="election-candidate-card-media-bar-text">
              {isHoverPreviewVisible
                ? "PLAYING PREVIEW"
                : "HOVER TO PLAY VIDEO"}
            </span>
          )}
          {!video && (
            <span className="election-candidate-card-media-bar-text">
              CLICK TO OPEN FLYER
            </span>
          )}
        </div>
      </div>
      <div className="election-candidate-card-body">
        <div className="election-candidate-card-name-wrap">
          <h3 className="election-candidate-card-name">{name}</h3>
          <span
            className="election-candidate-card-name-underline"
            style={{ backgroundColor: accentColor || "var(--title-color)" }}
            aria-hidden
          />
        </div>
        {description && (
          <p className="election-candidate-card-description">{description}</p>
        )}
        {showVoteButton && votingFormUrl && (
          <a
            href={votingFormUrl}
            className="election-candidate-card-vote-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            {voteButtonText}
          </a>
        )}
      </div>
    </article>
  );
}

ElectionCandidateCard.propTypes = {
  candidate: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    pfp: PropTypes.string,
    video: PropTypes.string,
  }).isRequired,
  accentColor: PropTypes.string,
  onOpenMedia: PropTypes.func.isRequired,
  showVoteButton: PropTypes.bool,
  votingFormUrl: PropTypes.string,
  voteButtonText: PropTypes.string,
  activeMedia: PropTypes.object,
  role: PropTypes.string,
};

// config sometimes gives us just a name string - turn it into a proper candidate object so we arent cooked
function normalizeCandidate(c) {
  if (typeof c === "string") {
    return {
      name: c,
      description: "",
      pfp: `https://i.pravatar.cc/400?u=${encodeURIComponent(c)}`,
      video: "",
    };
  }
  return {
    name: c.name ?? "",
    description: c.description ?? "",
    pfp:
      c.pfp ??
      `https://i.pravatar.cc/400?u=${encodeURIComponent(c.name || "c")}`,
    video: c.video ?? "",
  };
}

function electionCandidateMediaKey(c) {
  if (!c) return "";
  return `${String(c.name ?? "")}|||${String(c.video ?? "")}`;
}

function ElectionBoardCandidatesGrid({
  candidates,
  accentColor,
  onOpenMedia,
  showVoteButton,
  votingFormUrl,
  voteButtonText,
  activeMedia,
  role,
}) {
  return (
    <div className="election-board-candidates-grid">
      {candidates.map((c) => (
        <ElectionCandidateCard
          key={c.name}
          candidate={c}
          accentColor={accentColor}
          onOpenMedia={onOpenMedia}
          showVoteButton={showVoteButton}
          votingFormUrl={votingFormUrl}
          voteButtonText={voteButtonText}
          activeMedia={activeMedia}
          role={role}
        />
      ))}
    </div>
  );
}

ElectionBoardCandidatesGrid.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.object).isRequired,
  accentColor: PropTypes.string,
  onOpenMedia: PropTypes.func.isRequired,
  showVoteButton: PropTypes.bool,
  votingFormUrl: PropTypes.string,
  voteButtonText: PropTypes.string,
  activeMedia: PropTypes.object,
  role: PropTypes.string,
};

function extractDriveId(urlRaw) {
  const url = String(urlRaw ?? "").trim();
  if (!url) return "";
  const isDriveUrl = /(^https?:\/\/)?(drive|docs)\.google\.com\//i.test(url);
  if (!isDriveUrl) return "";
  const fromPath = url.match(/\/file\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/);
  const fromQuery = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return fromPath?.[1] || fromQuery?.[1] || "";
}

function extractYouTubeVideoId(urlRaw) {
  const raw = String(urlRaw ?? "").trim();
  if (!raw) return "";
  const tryParse = (href) => {
    try {
      return new URL(
        href.includes("://") ? href : `https://${href.replace(/^\/\//, "")}`,
      );
    } catch {
      return null;
    }
  };
  const u = tryParse(raw);
  if (!u) return "";
  const host = u.hostname.replace(/^www\./i, "").toLowerCase();
  if (host === "youtu.be") {
    const id = u.pathname.replace(/^\//, "").split("/")[0]?.split("?")[0] ?? "";
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : "";
  }
  if (
    host === "m.youtube.com" ||
    host === "youtube.com" ||
    host.endsWith(".youtube.com")
  ) {
    const parts = u.pathname.split("/").filter(Boolean);
    const vParam = u.searchParams.get("v");
    if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) return vParam;
    if (parts[0] === "embed" && parts[1]) {
      const id = parts[1].split("?")[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : "";
    }
    if (parts[0] === "shorts" && parts[1]) {
      const id = parts[1].split("?")[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : "";
    }
    if (parts[0] === "live" && parts[1]) {
      const id = parts[1].split("?")[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : "";
    }
  }
  return "";
}

/** Single card URL: always mute=1 for autoplay; use postMessage unMute/playVideo on hover (no src swap). */
function buildYouTubeElectionCardEmbedSrc(videoId, pageOrigin) {
  if (!videoId) return "";
  const originQ = pageOrigin ? `&origin=${encodeURIComponent(pageOrigin)}` : "";
  return `https://www.youtube.com/embed/${encodeURIComponent(
    videoId,
  )}?autoplay=1&mute=1&loop=1&playlist=${encodeURIComponent(
    videoId,
  )}&controls=0&showinfo=0&rel=0&disablekb=1&fs=0&playsinline=1&cc_load_policy=0&iv_load_policy=3&enablejsapi=1${originQ}`;
}

/** Modal: dedicated embed (not the card preview URL) so the iframe mounts with src immediately — no portal / ref delay. */
function buildYouTubeElectionModalEmbedSrc(videoId, pageOrigin) {
  if (!videoId) return "";
  const originQ = pageOrigin ? `&origin=${encodeURIComponent(pageOrigin)}` : "";
  return `https://www.youtube.com/embed/${encodeURIComponent(
    videoId,
  )}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1${originQ}`;
}

function boardHasYouTubeCandidate(boardData) {
  if (!boardData?.roles) return false;
  for (const rg of boardData.roles) {
    for (const c of rg.candidates || []) {
      const cand = normalizeCandidate(c);
      if (extractYouTubeVideoId(cand.video)) return true;
    }
  }
  return false;
}

// Dont even ask how the f**K this code works, I have no idea. - Gavin Z.
function imageSourceCandidates(srcRaw) {
  const src = String(srcRaw ?? "").trim();
  if (!src) return [];
  const id = extractDriveId(src);
  if (!id) return [src];
  const thumb = `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
  const loaded = `https://lh3.googleusercontent.com/d/${id}=s1600`;
  const file = `https://drive.google.com/uc?export=view&id=${id}`;
  const proxy = `https://images.weserv.nl/?url=${encodeURIComponent(file.replace(/^https?:\/\//i, ""))}&w=1400&h=1400&fit=inside`;
  return [thumb, loaded, proxy, src];
}

function videoSourceCandidates(srcRaw) {
  const src = String(srcRaw ?? "").trim();
  if (!src) return [];
  const id = extractDriveId(src);
  if (!id) return [src];
  return [
    `https://drive.google.com/uc?export=view&id=${id}`,
    `https://drive.usercontent.google.com/uc?id=${id}&export=view`,
    `https://drive.google.com/uc?export=download&id=${id}`,
    `https://docs.google.com/uc?export=view&id=${id}`,
    src,
  ];
}

function IgChevron({ dir }) {
  const points = dir === "left" ? "15 5 8 12 15 19" : "9 5 16 12 9 19";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ElectionMediaModal({ media, onClose }) {
  const videoRaw = media?.video;
  const hasVideo = Boolean(String(videoRaw ?? "").trim());
  const hasFlyer = Boolean(String(media?.pfp ?? "").trim());
  const slideCount = (hasFlyer ? 1 : 0) + (hasVideo ? 1 : 0);
  const [slide, setSlide] = useState(0);
  const showingVideo = hasVideo && (!hasFlyer || slide === 1);
  const youtubeVideoId = useMemo(
    () => extractYouTubeVideoId(videoRaw),
    [videoRaw],
  );
  const isYouTube = Boolean(youtubeVideoId);
  const pageOrigin =
    typeof window !== "undefined" ? window.location.origin : "";
  const modalYoutubeSrc = useMemo(
    () =>
      youtubeVideoId
        ? buildYouTubeElectionModalEmbedSrc(youtubeVideoId, pageOrigin)
        : "",
    [youtubeVideoId, pageOrigin],
  );
  const [upgradeReady, setUpgradeReady] = useState(false);
  const closeRef = useRef(null);
  const modalYoutubeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const flyerSources = useMemo(() => {
    const ready = String(media?.resolvedPfp ?? "").trim();
    if (ready) return [ready];
    return imageSourceCandidates(media?.pfp);
  }, [media?.resolvedPfp, media?.pfp]);

  useEffect(() => {
    setUpgradeReady(false);
    setSlide(0);
  }, [videoRaw, media?.pfp, media?.name]);

  useEffect(() => {
    if (!media) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(event) {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSlide((index) => Math.max(0, index - 1));
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSlide((index) => Math.min(slideCount - 1, index + 1));
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [media, slideCount]);

  const revealUpgrade = useCallback(() => {
    setUpgradeReady((ready) => {
      if (ready) return ready;
      const warm = dialogVideoHost?.querySelector("iframe, video");
      if (warm?.tagName === "IFRAME") silenceYoutubePreview(warm);
      else if (warm) {
        warm.pause();
        warm.muted = true;
      }
      kickYoutubeAudible(modalYoutubeRef.current);
      return true;
    });
  }, []);

  const onModalYoutubeLoad = useCallback(() => {
    modalYoutubeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "listening", id: "election-dialog", channel: "widget" }),
      "*",
    );
  }, []);

  useEffect(() => {
    if (!showingVideo || !isYouTube) return undefined;
    function onMessage(event) {
      if (event.source !== modalYoutubeRef.current?.contentWindow) return;
      let data = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (data?.event === "onStateChange" && Number(data.info) === 1) revealUpgrade();
    }
    window.addEventListener("message", onMessage);
    const fallback = window.setTimeout(revealUpgrade, 2500);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(fallback);
    };
  }, [showingVideo, isYouTube, revealUpgrade]);

  if (!media) return null;

  const dialog = (
    <div className="ig-backdrop" role="presentation" onClick={onClose}>
      <div
        className="ig-dialog ig-dialog--election"
        role="dialog"
        aria-modal="true"
        aria-label={media.name}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="ig-close"
          aria-label="Close"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
            <path
              d="M18 6 6 18M6 6l12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="ig-media">
          {showingVideo ? (
            <>
              <div
                ref={setDialogVideoHost}
                className="election-dialog-video-host"
              />
              {isYouTube && (
                <iframe
                  ref={modalYoutubeRef}
                  key={youtubeVideoId}
                  src={modalYoutubeSrc}
                  title={`${media.name} campaign video`}
                  className={`election-dialog-video-upgrade${upgradeReady ? " is-ready" : ""}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onLoad={onModalYoutubeLoad}
                />
              )}
            </>
          ) : (
            <SafeImage
              src={flyerSources}
              alt={`${media.name} flyer`}
              variant="club"
              decoding="sync"
            />
          )}
          {slideCount > 1 && slide > 0 && (
            <button
              type="button"
              className="ig-arrow ig-arrow--prev"
              aria-label="Previous"
              onClick={() => setSlide((index) => index - 1)}
            >
              <IgChevron dir="left" />
            </button>
          )}
          {slideCount > 1 && slide < slideCount - 1 && (
            <button
              type="button"
              className="ig-arrow ig-arrow--next"
              aria-label="Next"
              onClick={() => setSlide((index) => index + 1)}
            >
              <IgChevron dir="right" />
            </button>
          )}
          {slideCount > 1 && (
            <div className="ig-dots">
              {Array.from({ length: slideCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`ig-dot${index === slide ? " is-active" : ""}`}
                  aria-label={`Slide ${index + 1} of ${slideCount}`}
                  aria-current={index === slide ? "true" : undefined}
                  onClick={() => setSlide(index)}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="ig-side">
          <header className="ig-head">
            <SafeImage
              className="ig-avatar"
              src={flyerSources.length ? flyerSources : Logo}
              alt=""
              variant="user"
            />
            <span className="ig-user">{media.name}</span>
          </header>
          <div className="ig-scroll">
            <div className="ig-comment">
              <SafeImage
                className="ig-avatar"
                src={flyerSources.length ? flyerSources : Logo}
                alt=""
                variant="user"
              />
              <div>
                <div className="ig-copy">
                  <span className="ig-user">{media.name}</span>
                  {media.description ? ` ${media.description}` : ""}
                </div>
                {media.role ? (
                  <span className="ig-time">{media.role}</span>
                ) : null}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

ElectionMediaModal.propTypes = {
  media: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    role: PropTypes.string,
    pfp: PropTypes.string,
    resolvedPfp: PropTypes.string,
    video: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default function ElectionBoard({
  electionsConfig: config = electionsConfig,
}) {
  const { boardSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMedia, setActiveMedia] = useState(null);
  const votingLive = useElectionVotingLive(config);
  const messagingLive = useElectionVotingMessagingLive(config);

  const handleOpenElectionMedia = useCallback((payload) => {
    setActiveMedia(payload);
  }, []);

  const handleCloseElectionMedia = useCallback(() => {
    setActiveMedia(null);
  }, []);

  const { board, prevSlug, nextSlug } = useMemo(() => {
    const contenders = config?.contenders ?? [];
    const list = contenders.filter((b) => b.slug != null);
    const index = list.findIndex((b) => b.slug === boardSlug);
    const boardData = index >= 0 ? list[index] : null;
    return {
      board: boardData,
      prevSlug: index > 0 ? list[index - 1].slug : null,
      nextSlug:
        index >= 0 && index < list.length - 1 ? list[index + 1].slug : null,
    };
  }, [config, boardSlug]);

  const hasYoutubeOnBoard = useMemo(
    () => boardHasYouTubeCandidate(board),
    [board],
  );

  useEffect(() => {
    if (!hasYoutubeOnBoard) return;
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

  if (!areElectionBoardsPublic(config)) {
    return <Navigate to="/Elections" replace />;
  }

  if (!board) {
    return <LoadingTruck />;
  }

  const accentColor = board.color || "var(--title-color)";
  const roleQuery = searchParams.get("role") || "";
  const nameQuery = (searchParams.get("q") || "").trim().toLowerCase();
  const roles = (board.roles ?? []).map((group) => group.role).filter(Boolean);
  const sections = (board.roles ?? []).flatMap((roleGroup) => {
    if (roleQuery && roleGroup.role !== roleQuery) return [];
    const candidates = (roleGroup.candidates ?? [])
      .map(normalizeCandidate)
      .filter(
        (candidate) =>
          !nameQuery || candidate.name.toLowerCase().includes(nameQuery),
      );
    if (candidates.length === 0) return [];
    return [{ role: roleGroup.role, candidates }];
  });
  const setElectionQuery = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params, { replace: true });
  };
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
  const boardCount = (config?.contenders ?? []).filter((b) => b?.slug).length;
  const boardNav = (
    <>
      {prevSlug ? (
        <Link
          to={`/Elections/${prevSlug}`}
          className="election-board-nav-btn election-board-nav-btn--prev"
        >
          &larr; Last board
        </Link>
      ) : (
        <span className="election-board-nav-btn election-board-nav-btn--disabled">
          &larr; Last board
        </span>
      )}
      <Link to="/Elections" className="election-board-nav-btn">
        All boards
      </Link>
      {nextSlug ? (
        <Link
          to={`/Elections/${nextSlug}`}
          className="election-board-nav-btn election-board-nav-btn--next"
        >
          Next board &rarr;
        </Link>
      ) : (
        <span className="election-board-nav-btn election-board-nav-btn--disabled">
          Next board &rarr;
        </span>
      )}
    </>
  );

  return (
    <div
      className="election-board-page"
      style={{ "--board-accent": accentColor }}
    >
      <ElectionMediaModal
        media={activeMedia}
        onClose={handleCloseElectionMedia}
      />
      <header className="election-board-hero">
        <h1 className="election-board-hero-title">{board.board}</h1>
        <p className="election-board-hero-subtitle">Meet the candidates</p>
        {messagingLive && votingLiveReminder ? (
          <p className="election-board-hero-voting-hint">
            {votingLiveReminder}
          </p>
        ) : votingOpensHint ? (
          <p className="election-board-hero-voting-hint">
            Voting opens {votingOpensHint}.
          </p>
        ) : null}
      </header>
      {boardCount > 1 ? (
        <nav className="election-board-nav election-board-nav--top">
          {boardNav}
        </nav>
      ) : null}

      <main className="election-board-main">
        <div className="election-board-tools">
          <input
            type="search"
            className="election-board-search"
            placeholder="Search candidates"
            aria-label="Search candidates"
            value={searchParams.get("q") || ""}
            onChange={(event) => setElectionQuery("q", event.target.value)}
          />
          <div className="election-board-roles" role="group" aria-label="Filter by role">
            <button
              type="button"
              className={`election-board-role-btn${roleQuery ? "" : " election-board-role-btn--active"}`}
              aria-pressed={!roleQuery}
              onClick={() => setElectionQuery("role", "")}
            >
              All
            </button>
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                className={`election-board-role-btn${roleQuery === role ? " election-board-role-btn--active" : ""}`}
                aria-pressed={roleQuery === role}
                onClick={() =>
                  setElectionQuery("role", roleQuery === role ? "" : role)
                }
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        {sections.length === 0 ? (
          <p className="election-board-empty">No candidates match.</p>
        ) : (
          sections.map((section) => (
            <section
              key={section.role}
              className="election-board-role-section"
            >
              <h2
                className="election-board-role-title"
                style={{ borderLeftColor: accentColor }}
              >
                {section.role}
              </h2>
              <ElectionBoardCandidatesGrid
                key={`${boardSlug}-${section.role}`}
                candidates={section.candidates}
                accentColor={accentColor}
                role={section.role}
                onOpenMedia={handleOpenElectionMedia}
                showVoteButton={showVoteNowButtons}
                votingFormUrl={votingFormUrl}
                voteButtonText={voteButtonText}
                activeMedia={activeMedia}
              />
            </section>
          ))
        )}
      </main>

      {boardCount > 1 ? (
        <nav className="election-board-nav">{boardNav}</nav>
      ) : null}
    </div>
  );
}

ElectionBoard.propTypes = {
  electionsConfig: PropTypes.shape({
    votingFormUrl: PropTypes.string,
    votingOpensAt: PropTypes.string,
    votingLivePollingSubtitle: PropTypes.string,
    voteButtonText: PropTypes.string,
    showVoteNowButtons: PropTypes.bool,
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

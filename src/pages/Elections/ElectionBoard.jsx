import { useParams, Link, Navigate } from "react-router-dom";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import electionsConfig from "../../config/elections.config.js";
import LoadingTruck from "../../components/LoadingTruck";
import SafeImage from "../../components/SafeImage";
import { areElectionBoardsPublic } from "../../utils/electionAccess.js";
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

const ELECTION_CANDIDATE_MEDIA_COLUMN_HEIGHT_PX = (300 * 4) / 3;


function postYoutubeIframeCommand(iframe, func, args = []) {
  if (!iframe?.contentWindow) return;
  try {
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func,
        args: Array.isArray(args) ? args : [],
      }),
      "*"
    );
  } catch {
    // ignore
  }
}

function kickYoutubeAudible(iframe) {
  postYoutubeIframeCommand(iframe, "unMute");
  postYoutubeIframeCommand(iframe, "playVideo");
  window.setTimeout(() => {
    postYoutubeIframeCommand(iframe, "unMute");
    postYoutubeIframeCommand(iframe, "playVideo");
  }, 200);
}

function silenceYoutubePreview(iframe) {
  postYoutubeIframeCommand(iframe, "pauseVideo");
  postYoutubeIframeCommand(iframe, "mute");
}

// one candidate: photo (hover = video), name, bio, vote button
function ElectionCandidateCard({
  candidate,
  accentColor,
  onOpenMedia,
  showVoteButton = true,
  activeMedia = null,
}) {
  const { name, description, pfp, video } = candidate;
  const youtubeVideoId = useMemo(() => extractYouTubeVideoId(video), [video]);
  const isYouTubeVideo = Boolean(youtubeVideoId);
  const youtubeCardEmbedSrc = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return buildYouTubeElectionCardEmbedSrc(youtubeVideoId, origin);
  }, [youtubeVideoId]);
  const flyerSources = useMemo(() => imageSourceCandidates(pfp), [pfp]);
  const playableVideoSources = useMemo(() => videoSourceCandidates(video), [video]);
  const hasVideo = Boolean(video);
  const [isHoverPreviewVisible, setIsHoverPreviewVisible] = useState(false);
  const [cardGlowColor, setCardGlowColor] = useState("transparent");
  const [videoSourceIndex, setVideoSourceIndex] = useState(0);
  const articleRef = useRef(null);
  const youtubeIframeRef = useRef(null);
  const youtubeIframeHomeRef = useRef(null);
  const fileVideoRef = useRef(null);
  const fileVideoHomeRef = useRef(null);
  const videoSrc = playableVideoSources[videoSourceIndex] || video || "";
  const myMediaKey = electionCandidateMediaKey(candidate);
  const isThisModalOpen =
    Boolean(activeMedia) && electionCandidateMediaKey(activeMedia) === myMediaKey;

  const [youtubeSlotEl, setYoutubeSlotEl] = useState(null);
  const [fileSlotEl, setFileSlotEl] = useState(null);

  useEffect(() => {
    if (!isThisModalOpen) return undefined;
    silenceYoutubePreview(youtubeIframeRef.current);
    const v = fileVideoRef.current;
    if (v) {
      v.pause();
      v.muted = true;
    }
    return undefined;
  }, [isThisModalOpen]);

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
    if (hoverPreviewRef.current) kickYoutubeAudible(iframe);
    else silenceYoutubePreview(iframe);
  };

  const youtubeIframeNeedsSrc = useCallback(
    (frame) => {
      if (!frame || !youtubeCardEmbedSrc || !youtubeVideoId) return true;
      const src = String(frame.src || "");
      return !src || !src.includes(youtubeVideoId);
    },
    [youtubeCardEmbedSrc, youtubeVideoId]
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
      { root: null, rootMargin: "160px 0px 120px 0px", threshold: 0 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, [isYouTubeVideo, youtubeCardEmbedSrc, youtubeIframeNeedsSrc]);

  function setMediaPreviewVisible(container, visible) {
    const videoEl = fileVideoRef.current;
    if (videoEl && !isYouTubeVideo) {
      videoEl.classList.toggle("election-candidate-card-video--visible", visible);
      if (typeof videoEl.play === "function") {
        if (visible) {
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
      iframeEl.classList.toggle("election-candidate-card-video--visible", visible);
      if (visible) {
        if (youtubeCardEmbedSrc && youtubeIframeNeedsSrc(iframeEl)) iframeEl.src = youtubeCardEmbedSrc;
        kickYoutubeAudible(iframeEl);
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

  const handleMediaClick = () => {
    onOpenMedia(candidate);
  };

  return (
    <article
      ref={articleRef}
      className="election-candidate-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ "--card-glow-color": cardGlowColor }}
    >
      <div
        className="election-candidate-card-media"
        onClick={handleMediaClick}
        style={{ "--card-accent": accentColor || "var(--title-color)" }}
      >
        {hasVideo && (
          <span className="election-candidate-card-video-tag" aria-label="Has campaign video">
            VIDEO
          </span>
        )}
        <SafeImage
          src={flyerSources}
          alt={name}
          className="election-candidate-card-pfp"
          loading="lazy"
          variant="club"
        />
        {video && isYouTubeVideo && (
          <div ref={youtubeIframeHomeRef} className="election-candidate-card-preview-player-slot">
            {youtubeSlotEl &&
              createPortal(
                <iframe
                  key={youtubeCardEmbedSrc || youtubeVideoId || "yt"}
                  ref={youtubeIframeRef}
                  title={`${name} campaign video preview`}
                  className="election-candidate-card-video election-candidate-card-youtube-preview election-candidate-card-video-preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  onLoad={onYoutubePreviewIframeLoad}
                />,
                youtubeSlotEl
              )}
          </div>
        )}
        {video && !isYouTubeVideo && (
          <div ref={fileVideoHomeRef} className="election-candidate-card-preview-player-slot">
            {fileSlotEl &&
              createPortal(
                <video
                  key={videoSrc || video || "file"}
                  ref={fileVideoRef}
                  className="election-candidate-card-video election-candidate-card-video-preview"
                  src={videoSrc || undefined}
                  controls={false}
                  muted={!isHoverPreviewVisible}
                  loop
                  playsInline
                  preload="metadata"
                  onError={() => {
                    setVideoSourceIndex((i) => (i < playableVideoSources.length - 1 ? i + 1 : i));
                  }}
                />,
                fileSlotEl
              )}
          </div>
        )}
        <div className="election-candidate-card-media-bar" aria-hidden>
          {video && (
            <span className="election-candidate-card-media-bar-text">
              {isHoverPreviewVisible ? "PLAYING PREVIEW" : "HOVER TO PLAY VIDEO"}
            </span>
          )}
          {!video && (
            <span className="election-candidate-card-media-bar-text">CLICK TO OPEN FLYER</span>
          )}
        </div>
      </div>
      <div className="election-candidate-card-body">
        <div className="election-candidate-card-name-wrap">
          <h3 className="election-candidate-card-name">{name}</h3>
          <span className="election-candidate-card-name-underline" style={{ backgroundColor: accentColor || "var(--title-color)" }} aria-hidden />
        </div>
        {description && (
          <p className="election-candidate-card-description">{description}</p>
        )}
        {showVoteButton && (
          <button type="button" className="election-candidate-card-vote-btn">
            VOTE NOW
          </button>
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
  activeMedia: PropTypes.object,
};

// config sometimes gives us just a name string - turn it into a proper candidate object so we arent cooked
function normalizeCandidate(c) {
  if (typeof c === "string") {
    return { name: c, description: "", pfp: `https://i.pravatar.cc/400?u=${encodeURIComponent(c)}`, video: "" };
  }
  return {
    name: c.name ?? "",
    description: c.description ?? "",
    pfp: c.pfp ?? `https://i.pravatar.cc/400?u=${encodeURIComponent(c.name || "c")}`,
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
  activeMedia,
}) {
  const gridRef = useRef(null);
  const stackedLatchRef = useRef(false);
  const [stacked, setStacked] = useState(false);

  const candidatesKey = `${showVoteButton ? "1" : "0"};;${candidates
    .map((c) => `${c.name}|${c.description ?? ""}|${c.pfp ?? ""}|${c.video ?? ""}`)
    .join(";;")}`;

  useLayoutEffect(() => {
    stackedLatchRef.current = false;
    setStacked(false);

    const grid = gridRef.current;
    if (!grid) return;

    const measure = () => {
      if (stackedLatchRef.current) return;
      const cardEls = grid.querySelectorAll(".election-candidate-card");
      for (const el of cardEls) {
        if (el.getBoundingClientRect().height > ELECTION_CANDIDATE_MEDIA_COLUMN_HEIGHT_PX + 0.5) {
          stackedLatchRef.current = true;
          setStacked(true);
          return;
        }
      }
    };

    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    grid.querySelectorAll(".election-candidate-card").forEach((el) => ro.observe(el));
    measure();

    return () => ro.disconnect();
  }, [candidatesKey]);

  return (
    <div
      ref={gridRef}
      className={`election-board-candidates-grid${stacked ? " election-board-candidates-grid--stacked" : ""}`}
    >
      {candidates.map((c, i) => (
        <ElectionCandidateCard
          key={i}
          candidate={c}
          accentColor={accentColor}
          onOpenMedia={onOpenMedia}
          showVoteButton={showVoteButton}
          activeMedia={activeMedia}
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
  activeMedia: PropTypes.object,
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
      return new URL(href.includes("://") ? href : `https://${href.replace(/^\/\//, "")}`);
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
  if (host === "m.youtube.com" || host === "youtube.com" || host.endsWith(".youtube.com")) {
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
    videoId
  )}?autoplay=1&mute=1&loop=1&playlist=${encodeURIComponent(
    videoId
  )}&controls=0&showinfo=0&rel=0&disablekb=1&fs=0&playsinline=1&enablejsapi=1${originQ}`;
}

/** Modal: dedicated embed (not the card preview URL) so the iframe mounts with src immediately — no portal / ref delay. */
function buildYouTubeElectionModalEmbedSrc(videoId, pageOrigin) {
  if (!videoId) return "";
  const originQ = pageOrigin ? `&origin=${encodeURIComponent(pageOrigin)}` : "";
  return `https://www.youtube.com/embed/${encodeURIComponent(
    videoId
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
  const proxy = (u) =>
    `https://images.weserv.nl/?url=${encodeURIComponent(u.replace(/^https?:\/\//i, ""))}&w=1400&h=1400&fit=inside`;
  const u1 = `https://drive.google.com/uc?export=view&id=${id}`;
  const u2 = `https://drive.usercontent.google.com/uc?id=${id}&export=view`;
  const u3 = `https://lh3.googleusercontent.com/d/${id}=s1600`;
  const u4 = `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
  return [
    u1,
    proxy(u1),
    u2,
    proxy(u2),
    u3,
    proxy(u3),
    u4,
    proxy(u4),
    src,
  ];
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

function ElectionMediaModal({ media, onClose }) {
  const videoRaw = media?.video;
  const hasVideo = Boolean(videoRaw);
  const youtubeVideoId = useMemo(() => extractYouTubeVideoId(videoRaw), [videoRaw]);
  const isYouTube = Boolean(youtubeVideoId);
  const pageOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const modalYoutubeSrc = useMemo(
    () => (youtubeVideoId ? buildYouTubeElectionModalEmbedSrc(youtubeVideoId, pageOrigin) : ""),
    [youtubeVideoId, pageOrigin]
  );
  const playableVideoSources = useMemo(() => videoSourceCandidates(videoRaw), [videoRaw]);
  const [fileSourceIndex, setFileSourceIndex] = useState(0);
  const modalYoutubeRef = useRef(null);
  const fileVideoSrc = playableVideoSources[fileSourceIndex] || videoRaw || "";

  const flyerSources = useMemo(() => imageSourceCandidates(media?.pfp), [media?.pfp]);

  useEffect(() => {
    setFileSourceIndex(0);
  }, [videoRaw]);

  useEffect(() => {
    if (!media) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [media]);

  const onModalYoutubeLoad = useCallback(() => {
    kickYoutubeAudible(modalYoutubeRef.current);
  }, []);

  if (!media) return null;

  return (
    <div className="election-media-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className={`election-media-modal ${
          hasVideo ? "election-media-modal--video" : "election-media-modal--image"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="election-media-modal-close" onClick={onClose} aria-label="Close media">
          x
        </button>
        <h3 className="election-media-modal-title">{media.name}</h3>
        <div className="election-media-modal-content">
          {hasVideo ? (
            isYouTube ? (
              <iframe
                ref={modalYoutubeRef}
                key={youtubeVideoId}
                src={modalYoutubeSrc}
                title={`${media.name} campaign video`}
                className="election-media-modal-video election-media-modal-frame"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                fetchPriority="high"
                onLoad={onModalYoutubeLoad}
              />
            ) : (
              <video
                key={`${fileVideoSrc}-modal`}
                className="election-media-modal-video"
                src={fileVideoSrc || undefined}
                controls
                playsInline
                preload="auto"
                onError={() => {
                  setFileSourceIndex((i) => (i < playableVideoSources.length - 1 ? i + 1 : i));
                }}
              />
            )
          ) : (
            <SafeImage
              src={flyerSources}
              alt={`${media.name} flyer`}
              className="election-media-modal-image"
              variant="club"
            />
          )}
        </div>
      </div>
    </div>
  );
}

ElectionMediaModal.propTypes = {
  media: PropTypes.shape({
    name: PropTypes.string,
    pfp: PropTypes.string,
    video: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default function ElectionBoard({ electionsConfig: config = electionsConfig }) {
  const { boardSlug } = useParams();
  const [activeMedia, setActiveMedia] = useState(null);

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
      nextSlug: index >= 0 && index < list.length - 1 ? list[index + 1].slug : null,
    };
  }, [config, boardSlug]);

  const hasYoutubeOnBoard = useMemo(() => boardHasYouTubeCandidate(board), [board]);

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
  const showVoteNowButtons = config?.showVoteNowButtons !== false;
  const boardNav = (
    <>
      {prevSlug ? (
        <Link to={`/Elections/${prevSlug}`} className="election-board-nav-btn election-board-nav-btn--prev">
          &larr; Last board
        </Link>
      ) : (
        <span className="election-board-nav-btn election-board-nav-btn--disabled">&larr; Last board</span>
      )}
      <Link to="/Elections" className="election-board-nav-btn">
        All boards
      </Link>
      {nextSlug ? (
        <Link to={`/Elections/${nextSlug}`} className="election-board-nav-btn election-board-nav-btn--next">
          Next board &rarr;
        </Link>
      ) : (
        <span className="election-board-nav-btn election-board-nav-btn--disabled">Next board &rarr;</span>
      )}
    </>
  );

  return (
    <div className="election-board-page" style={{ "--board-accent": accentColor }}>
      <ElectionMediaModal media={activeMedia} onClose={handleCloseElectionMedia} />
      <header className="election-board-hero">
        <h1 className="election-board-hero-title">{board.board}</h1>
        <p className="election-board-hero-subtitle">Meet the candidates</p>
      </header>
      <nav className="election-board-nav election-board-nav--top">{boardNav}</nav>

      <main className="election-board-main">
        {(board.roles ?? []).map((roleGroup, roleIndex) => {
          const candidates = (roleGroup.candidates ?? []).map(normalizeCandidate);
          if (candidates.length === 0) return null;
          return (
            <section key={roleIndex} className="election-board-role-section">
              <h2 className="election-board-role-title" style={{ borderLeftColor: accentColor }}>
                {roleGroup.role}
              </h2>
              <ElectionBoardCandidatesGrid
                key={`${boardSlug}-${roleIndex}`}
                candidates={candidates}
                accentColor={accentColor}
                onOpenMedia={handleOpenElectionMedia}
                showVoteButton={showVoteNowButtons}
                activeMedia={activeMedia}
              />
            </section>
          );
        })}
      </main>

      <nav className="election-board-nav">{boardNav}</nav>
    </div>
  );
}

ElectionBoard.propTypes = {
  electionsConfig: PropTypes.shape({
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
          })
        ),
      })
    ),
  }),
};

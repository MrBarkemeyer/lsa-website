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
import SafeImage from "../../components/SafeImage";
import Logo from "../../assets/LSA-Logo.png";
import "../More/Events.scss";

const MEDIA_GLOW_CACHE_KEY = "lsa_election_media_glow_v2";
let mediaGlowCacheMem = null;

export function readMediaGlowCache() {
  if (mediaGlowCacheMem) return mediaGlowCacheMem;
  try {
    const raw = localStorage.getItem(MEDIA_GLOW_CACHE_KEY);
    mediaGlowCacheMem = raw ? JSON.parse(raw) : {};
  } catch {
    mediaGlowCacheMem = {};
  }
  return mediaGlowCacheMem;
}

export function writeMediaGlowCache(cache) {
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
export async function getAverageColorWithFallback(url) {
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

export function postYoutubeIframeCommand(iframe, func, args = []) {
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

export function hideYoutubeCaptions(iframe) {
  postYoutubeIframeCommand(iframe, "unloadModule", ["captions"]);
  postYoutubeIframeCommand(iframe, "setOption", ["captions", "track", {}]);
}

export function kickYoutubeAudible(iframe, hideCaptions = false) {
  const kick = () => {
    postYoutubeIframeCommand(iframe, "unMute");
    postYoutubeIframeCommand(iframe, "playVideo");
    if (hideCaptions) hideYoutubeCaptions(iframe);
  };
  kick();
  window.setTimeout(kick, 200);
  if (hideCaptions) window.setTimeout(() => hideYoutubeCaptions(iframe), 800);
}

export function silenceYoutubePreview(iframe) {
  postYoutubeIframeCommand(iframe, "pauseVideo");
  postYoutubeIframeCommand(iframe, "mute");
}

let dialogVideoHost = null;
let dialogVideoActive = false;
const dialogVideoHostListeners = new Set();

function notifyDialogVideoListeners() {
  dialogVideoHostListeners.forEach((fn) => fn());
}

export function setDialogVideoHost(node) {
  dialogVideoHost = node;
  notifyDialogVideoListeners();
}

export function setDialogVideoActive(active) {
  const next = Boolean(active);
  if (dialogVideoActive === next) return;
  dialogVideoActive = next;
  notifyDialogVideoListeners();
}

export function useDialogVideoHost() {
  const [host, setHost] = useState(null);
  const [active, setActive] = useState(false);
  useLayoutEffect(() => {
    const sync = () => {
      setHost(dialogVideoHost);
      setActive(dialogVideoActive);
    };
    dialogVideoHostListeners.add(sync);
    sync();
    return () => dialogVideoHostListeners.delete(sync);
  }, []);
  return active ? host : null;
}

// config sometimes gives us just a name string - turn it into a proper candidate object so we arent cooked
export function normalizeCandidate(c) {
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

export function electionCandidateMediaKey(c) {
  if (!c) return "";
  return `${String(c.name ?? "")}|||${String(c.video ?? "")}`;
}

function extractDriveId(urlRaw) {
  const url = String(urlRaw ?? "").trim();
  if (!url) return "";
  const isDriveUrl = /(^https?:\/\/)?(drive|docs)\.google\.com\//i.test(url);
  if (!isDriveUrl) return "";
  const fromPath = url.match(/\/file\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/);
  const fromQuery = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return fromPath?.[1] || fromQuery?.[1] || "";
}

export function extractYouTubeVideoId(urlRaw) {
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
export function buildYouTubeElectionCardEmbedSrc(videoId, pageOrigin) {
  if (!videoId) return "";
  const originQ = pageOrigin ? `&origin=${encodeURIComponent(pageOrigin)}` : "";
  return `https://www.youtube.com/embed/${encodeURIComponent(
    videoId,
  )}?autoplay=1&mute=1&loop=1&playlist=${encodeURIComponent(
    videoId,
  )}&controls=0&showinfo=0&rel=0&disablekb=1&fs=0&playsinline=1&cc_load_policy=0&iv_load_policy=3&enablejsapi=1${originQ}`;
}

/** Modal: dedicated embed (not the card preview URL) so the iframe mounts with src immediately — no portal / ref delay. */
export function buildYouTubeElectionModalEmbedSrc(videoId, pageOrigin) {
  if (!videoId) return "";
  const originQ = pageOrigin ? `&origin=${encodeURIComponent(pageOrigin)}` : "";
  return `https://www.youtube.com/embed/${encodeURIComponent(
    videoId,
  )}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1${originQ}`;
}

export function boardHasYouTubeCandidate(boardData) {
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
export function imageSourceCandidates(srcRaw) {
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

export function videoSourceCandidates(srcRaw) {
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

export function ElectionMediaModal({ media, onClose }) {
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

  useLayoutEffect(() => {
    // Publish before paint so the card can portal the warm preview into the
    // dialog on the same frame as Next — no empty black gap.
    setDialogVideoActive(Boolean(media && hasVideo && showingVideo));
  }, [media, hasVideo, showingVideo]);

  useLayoutEffect(() => {
    return () => {
      setDialogVideoActive(false);
      setDialogVideoHost(null);
    };
  }, []);

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
    const fallback = window.setTimeout(revealUpgrade, 400);
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

        <div
          className={`ig-media${showingVideo ? " is-showing-video" : " is-showing-flyer"}`}
        >
          {hasFlyer && !showingVideo && (
            <SafeImage
              src={flyerSources}
              alt={`${media.name} flyer`}
              variant="club"
              decoding="sync"
            />
          )}
          {hasVideo && (
            <>
              {/* Host stays mounted (parked under the flyer) so Next can portal
                  the warm preview immediately without a mount delay. */}
              <div
                ref={setDialogVideoHost}
                className={`election-dialog-video-host${showingVideo ? "" : " is-parked"}`}
                aria-hidden={!showingVideo}
              />
              {isYouTube && showingVideo && (
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

import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { extractDriveFileId } from "../utils/driveMedia.js";

// A photo that already painted, keyed by its URL and its Drive file id.
const loadedSrc = new Map();

function svgToDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function getFallbackDataUri(variant) {
  const lowellRed = "#861212";
  const bg = "#f0f0f0";

  if (variant === "club") {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <rect width="512" height="512" fill="${bg}"/>
        <path fill="${lowellRed}" d="M256 72 48 176v32l208-100 208 100v-32L256 72z"/>
        <path fill="${lowellRed}" d="M112 224h288v240H112V224z" opacity="0.25"/>
        <path fill="${lowellRed}" d="M176 248h160v216H176V248z" opacity="0.35"/>
        <path fill="${lowellRed}" d="M206 248h100v216H206V248z" opacity="0.55"/>
        <path fill="${lowellRed}" d="M214 200h84v48h-84v-48z"/>
      </svg>
    `;
    return svgToDataUri(svg);
  }

  // default: "user"
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <rect width="512" height="512" fill="${bg}"/>
      <circle cx="256" cy="208" r="76" fill="${lowellRed}" opacity="0.95"/>
      <path fill="${lowellRed}" d="M116 440c28-102 95-156 140-156s112 54 140 156H116z" opacity="0.95"/>
    </svg>
  `;

  return svgToDataUri(svg);
}

function sourceListOf(src) {
  if (Array.isArray(src)) {
    return src
      .filter((item) => typeof item === "string" && item.trim())
      .map((item) => item.trim());
  }
  const one = typeof src === "string" ? src.trim() : "";
  return one ? [one] : [];
}

function remember(list, url) {
  if (!url || url.startsWith("data:")) return;
  loadedSrc.set(url, url);
  for (const item of [url, ...list]) {
    const id = extractDriveFileId(item);
    if (id) loadedSrc.set(id, url);
  }
}

function remembered(list) {
  for (const url of list) {
    const id = extractDriveFileId(url);
    const known = (id && loadedSrc.get(id)) || loadedSrc.get(url);
    if (known) return known;
  }
  return "";
}

export default function SafeImage({
  src,
  alt = "",
  className,
  variant = "user",
  fallbackVariant,
  onLoad,
  decoding,
  ...rest
}) {
  const fallbackSrc = useMemo(() => {
    return getFallbackDataUri(fallbackVariant || variant);
  }, [variant, fallbackVariant]);

  const sourceKey = Array.isArray(src) ? src.join("\0") : String(src ?? "");
  const sourceList = useMemo(() => sourceListOf(src), [sourceKey]);
  const warmSrc = remembered(sourceList);

  const [currentSrc, setCurrentSrc] = useState(
    () => warmSrc || sourceList[0] || "",
  );
  const [sourceIndex, setSourceIndex] = useState(() => {
    const start = warmSrc || sourceList[0] || "";
    const index = sourceList.indexOf(start);
    return index === -1 ? 0 : index;
  });

  useEffect(() => {
    const start = remembered(sourceList) || sourceList[0] || fallbackSrc;
    const index = sourceList.indexOf(start);
    setSourceIndex(index === -1 ? 0 : index);
    setCurrentSrc(start);
  }, [sourceKey, fallbackSrc, sourceList]);

  useEffect(() => {
    const preferred = sourceList[0];
    if (!preferred || preferred === currentSrc || currentSrc === fallbackSrc) {
      return undefined;
    }
    let cancelled = false;
    const pre = new Image();
    pre.referrerPolicy = "no-referrer";
    pre.onload = () => {
      if (cancelled || pre.naturalWidth === 0) return;
      remember(sourceList, preferred);
      setSourceIndex(0);
      setCurrentSrc(preferred);
    };
    pre.src = preferred;
    return () => {
      cancelled = true;
    };
  }, [sourceKey, currentSrc, fallbackSrc, sourceList]);

  const handleError = () => {
    if (sourceIndex < sourceList.length - 1) {
      const nextIndex = sourceIndex + 1;
      setSourceIndex(nextIndex);
      setCurrentSrc(sourceList[nextIndex]);
      return;
    }
    // Avoid infinite loops if the fallback data URI ever fails.
    setCurrentSrc((prev) => (prev === fallbackSrc ? prev : fallbackSrc));
  };

  // A cached Drive hit can "load" as an empty bitmap. That is not the photo.
  const handleLoad = (event) => {
    const img = event.currentTarget;
    if (img.currentSrc && img.naturalWidth === 0 && currentSrc !== fallbackSrc) {
      handleError();
      return;
    }
    remember(sourceList, img.currentSrc || currentSrc);
    onLoad?.(event);
  };

  return (
    <img
      {...rest}
      src={currentSrc || fallbackSrc}
      alt={alt}
      className={className}
      decoding={warmSrc ? "sync" : decoding || "async"}
      referrerPolicy="no-referrer"
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}

SafeImage.propTypes = {
  src: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  alt: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["user", "club"]),
  fallbackVariant: PropTypes.oneOf(["user", "club"]),
  onLoad: PropTypes.func,
  decoding: PropTypes.string,
};

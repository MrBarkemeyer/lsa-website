import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

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

export default function SafeImage({
  src,
  alt = "",
  className,
  variant = "user",
  fallbackVariant,
  ...rest
}) {
  const fallbackSrc = useMemo(() => {
    return getFallbackDataUri(fallbackVariant || variant);
  }, [variant, fallbackVariant]);

  const [currentSrc, setCurrentSrc] = useState(src);
  const [sourceIndex, setSourceIndex] = useState(0);

  const sourceList = useMemo(() => {
    if (Array.isArray(src)) {
      return src.filter((s) => typeof s === "string" && s.trim() !== "");
    }
    return typeof src === "string" && src.trim() !== "" ? [src] : [];
  }, [src]);

  useEffect(() => {
    setSourceIndex(0);
    const first = sourceList[0];
    if (first) {
      setCurrentSrc(first);
    } else if (typeof src === "string" && src.trim()) {
      setCurrentSrc(src.trim());
    } else {
      setCurrentSrc(fallbackSrc);
    }
  }, [src, sourceList, fallbackSrc]);

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

  return (
    <img
      src={currentSrc || fallbackSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...rest}
    />
  );
}

SafeImage.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  alt: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["user", "club"]),
  fallbackVariant: PropTypes.oneOf(["user", "club"]),
};


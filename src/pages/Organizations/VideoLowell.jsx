import { useEffect } from "react";

const VIDEO_LOWELL_YOUTUBE = "https://www.youtube.com/@videolowell";

/** Redirect for /Organizations/VideoLowell bookmarks; main entry is the YouTube URL in config. */
export default function VideoLowell() {
  useEffect(() => {
    window.location.replace(VIDEO_LOWELL_YOUTUBE);
  }, []);
  return null;
}

import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useElectionVotingMessagingLive, useElectionResultsReleased } from "../utils/electionVotingWindow.js";

function normalizePath(p) {
  const s = String(p ?? "").trim();
  if (!s) return "";
  return s.replace(/\/+$/, "") || "/";
}

// Polling: uses `banner` + optional voting-live copy. Results: same red banner chrome as voting-live.
export default function ElectionBanner({ config }) {
  const location = useLocation();
  const state = config?.state ?? "pending";
  const messagingLive = useElectionVotingMessagingLive(config);
  const resultsReleased = useElectionResultsReleased(config ?? {});

  if (state === "results" && resultsReleased && config?.pollingBar?.enabled) {
    const title =
      String(config?.resultsBannerTitle ?? "").trim() || "Election results — LSA elections";
    const message =
      String(config?.resultsBannerMessage ?? "").trim() ||
      String(config?.pollingBar?.message ?? "").trim();
    if (!message) return null;

    const { resultsLabel, resultsPath } = config.pollingBar;
    const here = normalizePath(location.pathname);
    const dest = normalizePath(resultsPath);
    const showCta = Boolean(dest && here !== dest);

    return (
      <div className="election-banner">
        <div className="election-banner-inner">
          <h3 className="election-banner-title">{title}</h3>
          <p className="election-banner-message">{message}</p>
          {showCta ? (
            <Link to={resultsPath} className="election-banner-cta">
              {resultsLabel ?? "View results"}
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  if (state === "polling" && config?.banner?.enabled) {
    const { title, message, ctaText, ctaPath } = config.banner;
    const liveTitle = String(config?.votingLiveBannerTitle ?? "").trim();
    const liveMessage = String(config?.votingLiveBannerMessage ?? "").trim();
    const displayTitle = messagingLive && liveTitle ? liveTitle : title;
    const displayMessage = messagingLive && liveMessage ? liveMessage : message;

    return (
      <div className="election-banner">
        <div className="election-banner-inner">
          <h3 className="election-banner-title">{displayTitle}</h3>
          <p className="election-banner-message">{displayMessage}</p>
          {ctaText && ctaPath ? (
            <Link to={ctaPath} className="election-banner-cta">
              {ctaText}
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  return null;
}

ElectionBanner.propTypes = {
  config: PropTypes.shape({
    state: PropTypes.oneOf(["pending", "polling", "results"]),
    votingFormUrl: PropTypes.string,
    votingOpensAt: PropTypes.string,
    votingLiveBannerTitle: PropTypes.string,
    votingLiveBannerMessage: PropTypes.string,
    resultsBannerTitle: PropTypes.string,
    resultsBannerMessage: PropTypes.string,
    resultsReleaseAt: PropTypes.string,
    banner: PropTypes.shape({
      enabled: PropTypes.bool,
      title: PropTypes.string,
      message: PropTypes.string,
      ctaText: PropTypes.string,
      ctaPath: PropTypes.string,
    }),
    pollingBar: PropTypes.shape({
      enabled: PropTypes.bool,
      message: PropTypes.string,
      resultsLabel: PropTypes.string,
      resultsPath: PropTypes.string,
    }),
  }),
};

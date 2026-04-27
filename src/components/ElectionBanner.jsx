import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useElectionVotingMessagingLive } from "../utils/electionVotingWindow.js";

// big elections banner when state is polling
export default function ElectionBanner({ config }) {
  if (!config?.banner?.enabled) return null;

  const { title, message, ctaText, ctaPath } = config.banner;
  const messagingLive = useElectionVotingMessagingLive(config);
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

ElectionBanner.propTypes = {
  config: PropTypes.shape({
    votingFormUrl: PropTypes.string,
    votingOpensAt: PropTypes.string,
    votingLiveBannerTitle: PropTypes.string,
    votingLiveBannerMessage: PropTypes.string,
    banner: PropTypes.shape({
      enabled: PropTypes.bool,
      title: PropTypes.string,
      message: PropTypes.string,
      ctaText: PropTypes.string,
      ctaPath: PropTypes.string,
    }),
  }),
};

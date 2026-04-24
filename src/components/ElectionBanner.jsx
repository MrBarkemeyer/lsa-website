import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// big elections banner when state is polling
export default function ElectionBanner({ config }) {
  if (!config?.banner?.enabled) return null;

  const { title, message, ctaText, ctaPath } = config.banner;

  return (
    <div className="election-banner">
      <div className="election-banner-inner">
        <h3 className="election-banner-title">{title}</h3>
        <p className="election-banner-message">{message}</p>
        {ctaText && ctaPath && (
          <Link to={ctaPath} className="election-banner-cta">
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  );
}

ElectionBanner.propTypes = {
  config: PropTypes.shape({
    banner: PropTypes.shape({
      enabled: PropTypes.bool,
      title: PropTypes.string,
      message: PropTypes.string,
      ctaText: PropTypes.string,
      ctaPath: PropTypes.string,
    }),
  }),
};

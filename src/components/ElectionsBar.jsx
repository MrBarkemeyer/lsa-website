import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Site-wide strip when election results are live (Layout). On `/` the navbar spacer is
// only `ham-offset` (no height >1000px), so optional top margin matches `.off-set` nav clearance.
export default function ElectionsBar({ config, reserveNavClearance = false }) {
  if (!config?.pollingBar?.enabled) return null;

  const { message, resultsLabel, resultsPath } = config.pollingBar;

  return (
    <div
      className={[
        "elections-bar",
        reserveNavClearance ? "elections-bar--below-home-nav" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="elections-bar-inner">
        <span className="elections-bar-message">{message}</span>
        {resultsPath && (
          <Link to={resultsPath} className="elections-bar-link">
            {resultsLabel ?? "Results"}
          </Link>
        )}
      </div>
    </div>
  );
}

ElectionsBar.propTypes = {
  reserveNavClearance: PropTypes.bool,
  config: PropTypes.shape({
    pollingBar: PropTypes.shape({
      enabled: PropTypes.bool,
      message: PropTypes.string,
      resultsLabel: PropTypes.string,
      resultsPath: PropTypes.string,
    }),
  }),
};

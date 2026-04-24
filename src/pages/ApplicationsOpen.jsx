import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faClipboardList,
  faInbox,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  normalizeApplicationRow,
  isApplicationOpen,
  isLikelyDataRow,
  parseDateAdded,
} from "../utils/applicationsSheet.js";
import "./ApplicationsOpen.scss";

export default function ApplicationsOpen({
  applicationsData = [],
  applicationsLoading = false,
  applicationsError = null,
}) {
  const openRows = useMemo(() => {
    return (applicationsData || [])
      .map(normalizeApplicationRow)
      .filter((r) => r && isLikelyDataRow(r) && isApplicationOpen(r))
      .sort((a, b) => parseDateAdded(b.dateAdded) - parseDateAdded(a.dateAdded));
  }, [applicationsData]);

  return (
    <main className="applications-open">
      <header className="applications-open__hero">
        <h1>Applications open</h1>
        <p>
          Clubs and student organizations currently accepting applications. Use each
          card to open the official form or link when provided.
        </p>
        {!applicationsLoading && openRows.length > 0 && (
          <div className="applications-open__badge" aria-live="polite">
            {openRows.length} open now
          </div>
        )}
      </header>

      <div className="applications-open__content">
        <div className="applications-open__actions">
          <Link className="applications-open__link applications-open__link--primary" to="/Clubs">
            <FontAwesomeIcon icon={faClipboardList} aria-hidden />
            Browse all clubs
          </Link>
          <Link
            className="applications-open__link applications-open__link--ghost"
            to="/Resources"
          >
            Student resources
          </Link>
        </div>

        {applicationsLoading && (
          <div className="applications-open__loading" role="status" aria-live="polite">
            <FontAwesomeIcon icon={faSpinner} spin className="applications-open__loading-icon" />
            <p>Loading applications…</p>
          </div>
        )}

        {!applicationsLoading && applicationsError && (
          <div className="applications-open__error" role="alert">
            <p>Could not load listings.</p>
            <Link to="/Clubs" className="applications-open__link applications-open__link--primary">
              Browse clubs instead
            </Link>
          </div>
        )}

        {!applicationsLoading && !applicationsError && openRows.length === 0 && (
          <div className="applications-open__empty">
            <div className="applications-open__empty-icon" aria-hidden>
              <FontAwesomeIcon icon={faInbox} />
            </div>
            <h2>No applications open right now</h2>
            <p>
              Check back soon, or explore{" "}
              <Link to="/Clubs">all Lowell clubs and organizations</Link> to find
              something you love.
            </p>
          </div>
        )}

        {!applicationsLoading && !applicationsError && openRows.length > 0 && (
          <ul className="applications-open__grid" aria-label="Organizations with applications open">
            {openRows.map((item, index) => (
              <li key={`${item.name}-${item.link || "nolink"}-${index}`}>
                <article className="app-open-card">
                  <div className="app-open-card__header">
                    <span className="app-open-card__icon" aria-hidden>
                      <FontAwesomeIcon icon={faClipboardList} />
                    </span>
                    <h2 className="app-open-card__title">{item.name}</h2>
                  </div>
                  {item.dateAdded && (
                    <p className="app-open-card__meta">Added {item.dateAdded}</p>
                  )}
                  {item.notes && (
                    <p className="app-open-card__notes">{item.notes}</p>
                  )}
                  <div className="app-open-card__cta">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="app-open-card__button"
                      >
                        Apply
                        <FontAwesomeIcon icon={faArrowRight} aria-hidden />
                      </a>
                    ) : (
                      <span
                        className="app-open-card__button app-open-card__muted"
                        title="No application link was provided for this listing"
                      >
                        Link coming soon
                      </span>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

ApplicationsOpen.propTypes = {
  applicationsData: PropTypes.arrayOf(PropTypes.object),
  applicationsLoading: PropTypes.bool,
  applicationsError: PropTypes.string,
};

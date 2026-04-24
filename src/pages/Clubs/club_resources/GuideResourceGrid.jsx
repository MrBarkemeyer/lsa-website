import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";

export default function GuideResourceGrid({ items }) {
  return (
    <div className="club-guide-page__resource-grid">
      {items.map((item) => {
        const icon = item.icon || faFileLines;
        const inner = (
          <>
            <span className="club-guide-page__resource-icon" aria-hidden>
              <FontAwesomeIcon icon={icon} />
            </span>
            <h3 className="club-guide-page__resource-title">{item.title}</h3>
            <p className="club-guide-page__resource-desc">{item.description}</p>
          </>
        );

        if (item.href) {
          return (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="club-guide-page__resource-card club-guide-page__resource-card--link"
            >
              {inner}
              <span className="club-guide-page__resource-cta">
                Open
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
              </span>
            </a>
          );
        }

        return (
          <div
            key={item.title}
            className="club-guide-page__resource-card club-guide-page__resource-card--static"
          >
            {inner}
            <span className="club-guide-page__resource-hint">
              In Activities Google Classroom
            </span>
          </div>
        );
      })}
    </div>
  );
}

const itemShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string,
  icon: PropTypes.object,
});

GuideResourceGrid.propTypes = {
  items: PropTypes.arrayOf(itemShape).isRequired,
};

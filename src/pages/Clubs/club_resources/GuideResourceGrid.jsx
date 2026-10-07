import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function GuideResourceGrid({ items }) {
  return (
    <ul className="detail-rows">
      {items.map((item) => (
        <li key={item.title} className="detail-row detail-row--stack">
          <span className="detail-row__label">
            {item.href ? "Document" : "In Classroom"}
          </span>
          <div className="detail-row__value">
            {item.title}
            <span className="detail-row__desc">{item.description}</span>
            {item.href ? (
              <div className="detail-links detail-links--after">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-btn detail-btn--ghost"
                >
                  Open
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    aria-hidden="true"
                  />
                </a>
              </div>
            ) : (
              <span className="detail-row__meta">
                Available in Activities Google Classroom
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
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

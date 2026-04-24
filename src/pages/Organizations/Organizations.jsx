import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import "./Organizations.scss";
import organizationsConfig from "../../config/organizations.config.js";

function isExternalLink(link) {
  return typeof link === "string" && (link.startsWith("http://") || link.startsWith("https://"));
}

export default function Organization() {
  const organizations = organizationsConfig || [];

  return (
    <section className="organizations-page">
      <div className="organizations-page__hero">
        <h1>Organizations at Lowell</h1>
        <p className="organizations-page__tagline">
          Honor societies, publications, and programs that shape student life beyond the classroom.
        </p>
      </div>
      <div className="organizations-page__list">
        {organizations.map((organization, index) => (
          <article className="org-card" key={index}>
            <div className="org-card__body">
              <h2 className="org-card__title">{organization.name}</h2>
              <p className="org-card__description">{organization.description}</p>
              {isExternalLink(organization.link) ? (
                <a
                  href={organization.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="org-card__link"
                >
                  <span>Learn more</span>
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="org-card__icon" />
                </a>
              ) : (
                <Link to={organization.link} className="org-card__link">
                  <span>Learn more</span>
                  <FontAwesomeIcon icon={faArrowRight} className="org-card__icon" />
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

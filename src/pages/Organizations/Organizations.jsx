import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./Organizations.scss";
import organizationsConfig from "../../config/organizations.config.js";

function isExternalLink(link) {
  return (
    typeof link === "string" &&
    (link.startsWith("http://") || link.startsWith("https://"))
  );
}

const ORG_ACCENTS = [
  "#861212",
  "#1d2354",
  "#2e7d32",
  "#00695c",
  "#6a1b9a",
  "#1565c0",
  "#c62828",
  "#ef6c00",
  "#37474f",
];

export default function Organization() {
  const organizations = organizationsConfig || [];

  return (
    <section className="organizations-page">
      <div className="organizations-page__hero">
        <h1>Organizations</h1>
        <p className="organizations-page__tagline">
          Honor societies, publications, and programs that shape student life
          beyond the classroom.
        </p>
      </div>

      <p className="organizations-page__count" aria-live="polite">
        {organizations.length} organization
        {organizations.length === 1 ? "" : "s"}
      </p>

      <div className="organizations-page__grid">
        {organizations.map((organization, index) => {
          const external = isExternalLink(organization.link);
          const accent = ORG_ACCENTS[index % ORG_ACCENTS.length];
          const sharedProps = {
            className: "org-card",
            style: {
              "--org-accent": accent,
              "--org-delay": `${Math.min(index, 11) * 45}ms`,
            },
          };

          const body = (
            <>
              {organization.tag && (
                <span className="org-card__tag">{organization.tag}</span>
              )}
              <h2 className="org-card__title">{organization.name}</h2>
              <p className="org-card__description">
                {organization.description}
              </p>
              <span className="org-card__cta">
                {external ? "Visit site" : "Learn more"}
                <FontAwesomeIcon
                  icon={external ? faExternalLinkAlt : faArrowRight}
                  className="org-card__icon"
                  aria-hidden="true"
                />
              </span>
            </>
          );

          if (external) {
            return (
              <a
                key={organization.name}
                href={organization.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${organization.name} (opens in a new tab)`}
                {...sharedProps}
              >
                {body}
              </a>
            );
          }

          return (
            <Link
              key={organization.name}
              to={organization.link}
              {...sharedProps}
            >
              {body}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

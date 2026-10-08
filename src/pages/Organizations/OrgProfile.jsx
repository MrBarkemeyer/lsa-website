import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowLeft,
  faBook,
  faEnvelope,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import organizationsConfig from "../../config/organizations.config.js";
import "../Clubs/Club.scss";
import "./Organizations.scss";

function asList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function personValue(value) {
  const text = String(value);
  if (text.startsWith("@")) {
    return (
      <a
        href={`https://instagram.com/${text.slice(1)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    );
  }
  if (text.includes("@") && !text.includes(" ")) {
    return <a href={`mailto:${text}`}>{text}</a>;
  }
  return text;
}

function contactLinks(org) {
  const links = [];
  if (org.email) {
    links.push({
      href: `mailto:${org.email}`,
      label: org.email,
      icon: faEnvelope,
    });
  }
  if (org.instagram) {
    const handle = String(org.instagram).replace(/^@/, "");
    links.push({
      href: `https://instagram.com/${handle}`,
      label: `@${handle}`,
      icon: faInstagram,
      instagram: true,
    });
  }
  for (const link of org.links || []) {
    const href = link.href || "";
    links.push({
      ...link,
      icon: link.to
        ? faBook
        : href.includes("instagram.com")
          ? faInstagram
          : faGlobe,
      instagram: href.includes("instagram.com"),
    });
  }
  return links;
}

export function organizationByLink(link) {
  return organizationsConfig.find((item) => item.link === link);
}

export default function OrgProfile({
  slug,
  title,
  tag,
  accent = "#861212",
  glance = [],
  children,
}) {
  const org = organizationByLink(slug) || {};
  const heading = title || org.name;
  const officers = org.officers || [];
  const links = contactLinks(org);
  const sponsors = asList(org.sponsor);
  const partnerships = asList(org.partnerships);
  const showAside = links.length || sponsors.length || partnerships.length;
  const body = typeof children === "function" ? children(org) : children;

  return (
    <main className="club-page org-page" style={{ "--club-accent": accent }}>
      <header className="club-hero club-hero--no-banner">
        <div className="club-hero__content">
          <Link to="/Organizations" className="club-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            All organizations
          </Link>
          {(tag || org.tag) && (
            <p className="club-hero__category">{tag || org.tag}</p>
          )}
          <h1 className="club-hero__title">{heading}</h1>
        </div>
      </header>

      {glance.length > 0 && (
        <div className="club-glance" aria-label="At a glance">
          <div className="club-glance__inner">
            {glance.map((item) => (
              <div className="club-glance__item" key={item.label}>
                <FontAwesomeIcon
                  icon={item.icon}
                  className="club-glance__icon"
                  aria-hidden="true"
                />
                <div>
                  <span className="club-glance__label">{item.label}</span>
                  <span className="club-glance__value">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`club-content ${showAside ? "" : "club-content--single"}`}>
        <div className="club-content__main">
          {body}
          {typeof children !== "function" && officers.length > 0 && (
            <OrgPeople
              heading={org.officersHeading || "Officers"}
              rows={officers}
            />
          )}
        </div>
        {showAside ? (
          <aside className="club-content__aside" aria-label={`${heading} details`}>
            {links.length > 0 && <OrgLinks links={links} />}
            {sponsors.length > 0 && (
              <NameBlock heading="Sponsor" names={sponsors} />
            )}
            {partnerships.length > 0 && (
              <NameBlock
                heading={partnerships.length > 1 ? "Partnerships" : "Partnership"}
                names={partnerships}
              />
            )}
          </aside>
        ) : null}
      </div>
    </main>
  );
}

function NameBlock({ heading, names }) {
  return (
    <section className="club-block club-sponsor">
      <h2 className="club-block__heading">{heading}</h2>
      {names.length === 1 ? (
        <p className="club-sponsor__name">{names[0]}</p>
      ) : (
        <ul className="club-sponsor__list">
          {names.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function OrgLinks({ links }) {
  return (
    <section className="club-block club-connect">
      <h2 className="club-block__heading">Get involved</h2>
      <div className="club-connect__links">
        {links.map((link) => {
          const className = `club-connect__btn ${
            link.instagram
              ? "club-connect__btn--instagram"
              : "club-connect__btn--primary"
          }`;
          const content = (
            <>
              {link.icon ? (
                <FontAwesomeIcon icon={link.icon} aria-hidden="true" />
              ) : null}
              {link.label}
            </>
          );

          if (link.to) {
            return (
              <Link key={link.to} to={link.to} className={className}>
                {content}
              </Link>
            );
          }

          const external = !String(link.href).startsWith("mailto:");
          return (
            <a
              key={link.href}
              href={link.href}
              className={className}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {content}
            </a>
          );
        })}
      </div>
    </section>
  );
}

export function OrgPeople({ heading, rows }) {
  return (
    <section className="club-block club-leadership">
      {heading ? <h2 className="club-block__heading">{heading}</h2> : null}
      <ul className="club-leadership__list">
        {rows.map((row, index) => (
          <li className="club-leadership__row" key={`${row.role}-${index}`}>
            <span className="club-leadership__role">{row.role}</span>
            <span className="club-leadership__name">
              {typeof row.name === "string" ? personValue(row.name) : row.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

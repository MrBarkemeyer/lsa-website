import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../../styles/DetailPage.scss";

const LINKS = [
  {
    label: "Get oriented",
    title: "Virtual tour of Lowell",
    description:
      "Explore key campus spaces, important offices, and first-week tips.",
    to: "https://docs.google.com/document/d/1UVpp4I76UDjqJkYXNb01JueIAPk6tvpNC2a5KZwHOU0/edit?tab=t.0",
    cta: "Open tour",
    external: true,
  },
  {
    label: "Important document",
    title: "Master registry list",
    description:
      "Review the master list for clubs, resources, and class information.",
    to: "/Registry",
    cta: "View registry",
    external: false,
  },
  {
    label: "Stay updated",
    title: "Class Instagram",
    description: "Follow announcements, reminders, and class spirit updates.",
    to: "https://www.instagram.com/lsaboard2030",
    cta: "@lsaboard2030",
    external: true,
  },
  {
    label: "Get involved",
    title: "Class board candidates",
    description: "Learn about current elections and see who is running.",
    to: "/Elections",
    cta: "View elections",
    external: false,
  },
];

export default function FreshMenCorner() {
  return (
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <Link to="/More" className="detail-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            More from LSA
          </Link>
          <p className="detail-hero__eyebrow">Class of 2030</p>
          <h1 className="detail-hero__title">Freshmen Corner</h1>
          <p className="detail-hero__lead">
            Quick links and tools to help new Lowell students get started.
          </p>
        </div>
      </header>

      <div className="detail-content detail-content--single">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">Starter links</h2>
            <ul className="detail-rows">
              {LINKS.map((item) => (
                <li key={item.title} className="detail-row detail-row--stack">
                  <span className="detail-row__label">{item.label}</span>
                  <div className="detail-row__value">
                    {item.title}
                    <span className="detail-row__desc">{item.description}</span>
                    <div className="detail-links detail-links--after">
                      {item.external ? (
                        <a
                          href={item.to}
                          className="detail-btn detail-btn--primary"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.cta}
                        </a>
                      ) : (
                        <Link
                          to={item.to}
                          className="detail-btn detail-btn--primary"
                        >
                          {item.cta}
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

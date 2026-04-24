import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCalendarDays, faFire } from "@fortawesome/free-solid-svg-icons";
import "./About.scss";

const EVENT_COMMITTEES = [
  { name: "Senior Boat Committee", to: "2026 Senior Boat Committee" },
  { name: "Senior Prom", to: "2026 Senior Prom Committee" },
  { name: "2027 Junior Prom", to: "2027 Junior Prom Committee" },
  { name: "2025 Junior Escape", to: "2027 Junior Escape Committee" },
];

export default function Committees() {
  return (
    <main className="committees-landing">
      <header className="committees-landing__hero">
        <h1>Lowell committees</h1>
        <p>
          Class boards organize committees for dances, spirit week, and school-wide
          events. Explore each group below to learn who runs it and how to get involved.
        </p>
      </header>

      <section className="committees-landing__intro" aria-label="About committees">
        <div className="committees-landing__card">
          <h2>
            <FontAwesomeIcon icon={faCalendarDays} aria-hidden /> Event committees
          </h2>
          <p>
            Dance committees (prom, escape, boat) are chosen by class boards. They
            plan themes, logistics, and fundraising usually for about a year and a half.
          </p>
        </div>
        <div className="committees-landing__card committees-landing__card--accent">
          <h2>
            <FontAwesomeIcon icon={faFire} aria-hidden /> Spirit week
          </h2>
          <p>
            Spirit committees form once a year for Spirit Week: hall art, rally games,
            and the spirit dance. They meet roughly six weeks, with a busy weekend
            before the week kicks off.
          </p>
        </div>
      </section>

      <section className="committees-landing__section" aria-labelledby="committees-heading">
        <h2 id="committees-heading" className="committees-landing__section-title">
          Event committees
        </h2>
        <p className="committees-landing__section-lead">
          Committees listed here are planning events for the current school year. Open a
          card to see members and roles.
        </p>
        <ul className="committees-landing__grid">
          {EVENT_COMMITTEES.map((c) => (
            <li key={c.to}>
              <Link to={`/LSA/${encodeURIComponent(c.to)}`} className="committees-landing__tile">
                <span className="committees-landing__tile-title">{c.name}</span>
                <span className="committees-landing__tile-cta">
                  View committee <FontAwesomeIcon icon={faArrowRight} aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="committees-landing__spirit" aria-labelledby="spirit-heading">
        <div className="committees-landing__spirit-inner">
          <h2 id="spirit-heading">Spirit Committee</h2>
          <p>
            Hall art, rally games, and the spirit dance each class builds a team for
            Spirit Week. Learn how each subcommittee works and how to join.
          </p>
          <Link to="/LSA/Spirit Committee" className="committees-landing__spirit-btn">
            Spirit Committee overview
            <FontAwesomeIcon icon={faArrowRight} aria-hidden />
          </Link>
        </div>
      </section>

      <section className="committees-landing__footer">
        <Link to="/LSA" className="committees-landing__back">
          &larr; Back to About LSA
        </Link>
      </section>
    </main>
  );
}

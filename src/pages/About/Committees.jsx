import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "../../styles/DetailPage.scss";

const EVENT_COMMITTEES = [
  { name: "Senior Boat Committee", to: "2027 Senior Boat Committee" },
  { name: "Senior Prom", to: "2027 Senior Prom Committee" },
  { name: "2028 Junior Prom", to: "2028 Junior Prom Committee" },
  { name: "2028 Junior Escape", to: "2028 Junior Escape Committee" },
];

export default function Committees() {
  return (
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <Link to="/LSA" className="detail-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            About LSA
          </Link>
          <p className="detail-hero__eyebrow">Get involved</p>
          <h1 className="detail-hero__title">Lowell committees</h1>
          <p className="detail-hero__lead">
            Class boards organize committees for dances, spirit week, and
            school-wide events. Explore each group below to learn who runs it
            and how to get involved.
          </p>
        </div>
      </header>

      <div className="detail-content detail-content--single">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">About committees</h2>
            <ul className="detail-topics">
              <li className="detail-topic">
                <h3 className="detail-topic__title">Event committees</h3>
                <p className="detail-topic__text">
                  Dance committees (prom, escape, boat) are chosen by class
                  boards. They plan themes, logistics, and fundraising usually
                  for about a year and a half.
                </p>
              </li>
              <li className="detail-topic">
                <h3 className="detail-topic__title">Spirit week</h3>
                <p className="detail-topic__text">
                  Spirit committees form once a year for Spirit Week: hall art,
                  rally games, and the spirit dance. They meet roughly six
                  weeks, with a busy weekend before the week kicks off.
                </p>
              </li>
            </ul>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">Event committees</h2>
            <p className="detail-text">
              Committees listed here are planning events for the current school
              year. Open a row to see members and roles.
            </p>
            <ul className="detail-rows">
              {EVENT_COMMITTEES.map((c) => (
                <li key={c.to} className="detail-row">
                  <span className="detail-row__label">Committee</span>
                  <div className="detail-row__value">
                    <Link to={`/LSA/${encodeURIComponent(c.to)}`}>
                      {c.name}
                    </Link>
                    <span className="detail-row__meta">
                      View committee members and roles
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">Spirit Committee</h2>
            <p className="detail-text">
              Hall art, rally games, and the spirit dance each class builds a
              team for Spirit Week. Learn how each subcommittee works and how to
              join.
            </p>
            <div className="detail-links">
              <Link
                to="/LSA/Spirit Committee"
                className="detail-btn detail-btn--primary"
              >
                Spirit Committee overview
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

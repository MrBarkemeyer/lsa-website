import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../../styles/DetailPage.scss";

export default function MockTrial() {
  return (
    <main className="detail-page detail-page--navy">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <Link to="/Organizations" className="detail-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Organizations
          </Link>
          <p className="detail-hero__eyebrow">Competition</p>
          <h1 className="detail-hero__title">Lowell Mock Trial</h1>
          <p className="detail-hero__lead">
            Learn legal reasoning, advocacy, and public speaking through real
            courtroom simulation.
          </p>
        </div>
      </header>

      <div className="detail-content">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">About the program</h2>
            <p className="detail-text">
              Lowell Mock Trial helps students build a deeper understanding of
              law and the U.S. justice system. Each year, students prepare a
              simulated case from the Constitutional Rights Foundation and
              compete against other San Francisco high schools.
            </p>
            <p className="detail-text">
              Team members can participate as witnesses, prosecution or defense
              attorneys, bailiffs, or time clerks. The program strengthens
              critical thinking, teamwork, and confident speaking.
            </p>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">Why join</h2>
            <ul className="detail-topics">
              <li className="detail-topic">
                <h3 className="detail-topic__title">Build real skills</h3>
                <p className="detail-topic__text">
                  Practice argumentation, questioning, and persuasive speaking
                  in a structured, high-impact setting.
                </p>
              </li>
              <li className="detail-topic">
                <h3 className="detail-topic__title">Compete as a team</h3>
                <p className="detail-topic__text">
                  Represent Lowell in city/county competition and potentially
                  advance to California state finals.
                </p>
              </li>
              <li className="detail-topic">
                <h3 className="detail-topic__title">Open to all grades</h3>
                <p className="detail-topic__text">
                  Students interested in law, acting, debate, or public speaking
                  are encouraged to participate.
                </p>
              </li>
            </ul>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">Program highlights</h2>
            <p className="detail-text">
              Lowell won city championships in{" "}
              <strong>2012, 2014, 2016, 2018, 2019, and 2020</strong>, then
              advanced to the California State competition.
            </p>
          </section>
        </div>

        <aside className="detail-content__aside" aria-label="Coaches and contact">
          <section className="detail-block">
            <h2 className="detail-block__heading">Coaches</h2>
            <ul className="detail-rows">
              <li className="detail-row">
                <span className="detail-row__label">Coach</span>
                <span className="detail-row__value">
                  Michael Ungar
                  <span className="detail-row__meta">ungarm@sfusd.edu</span>
                </span>
              </li>
              <li className="detail-row">
                <span className="detail-row__label">Coach</span>
                <span className="detail-row__value">
                  Lisa Hathaway
                  <span className="detail-row__meta">lhathaway13@gmail.com</span>
                </span>
              </li>
              <li className="detail-row">
                <span className="detail-row__label">Coach</span>
                <span className="detail-row__value">
                  Lauretta Komlos
                  <span className="detail-row__meta">komlosl@sfusd.edu</span>
                </span>
              </li>
              <li className="detail-row">
                <span className="detail-row__label">Coach</span>
                <span className="detail-row__value">
                  Nikole Gorin
                  <span className="detail-row__meta">nikolegorin@gmail.com</span>
                </span>
              </li>
            </ul>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">Get involved</h2>
            <div className="detail-links detail-links--column">
              <a
                href="mailto:lowellhsmocktrial@gmail.com"
                className="detail-btn detail-btn--primary"
              >
                lowellhsmocktrial@gmail.com
              </a>
              <a
                href="https://www.instagram.com/lowellmocktrial"
                className="detail-btn detail-btn--dark"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                @lowellmocktrial
              </a>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../../styles/DetailPage.scss";

export default function TitleIX() {
  return (
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <Link to="/Resources" className="detail-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Student resources
          </Link>
          <p className="detail-hero__eyebrow">Support</p>
          <h1 className="detail-hero__title">Title IX Support</h1>
          <p className="detail-hero__lead">
            Know your rights and where to get help.
          </p>
        </div>
      </header>

      <div className="detail-content">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">What is Title IX</h2>
            <p className="detail-text">
              Title IX of the Education Amendments of 1972 prohibits sex
              discrimination in education, including K-12 schools. Title IX is a
              federal law that has been used to promote equity in education by
              ensuring that girls and women receive equal resources and treatment
              in the classroom and provides protections for students who are
              sexually harassed and discriminated against and/or bullied based on
              their gender.
            </p>
            <p className="detail-text">
              In addition to this federal law, the California Education code
              similarly prohibits schools discriminating against its students on
              the basis of sex (Education Codes 220-221.1).
            </p>
            <p className="detail-text">
              Sexual harassment is also in violation of San Francisco Unified
              School District Board and Administrative policies. These policies
              extend to the San Francisco County Office of Education, including
              community school programs and activities. All forms of sexual
              harassment, whether student to student, staff to student, or student
              to staff, are unlawful at SFUSD schools.
            </p>
            <div className="detail-links">
              <a
                className="detail-btn detail-btn--primary"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.sfusd.edu/know-your-rights/sexual-harassment-and-sex-discrimination-title-ix"
              >
                Learn more on SFUSD
              </a>
            </div>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">Resources and contacts</h2>
            <ul className="detail-rows">
              <li className="detail-row detail-row--stack">
                <span className="detail-row__label">SFUSD</span>
                <div className="detail-row__value">
                  <a
                    href="https://www.sfusd.edu/know-your-rights/sexual-harassment-and-sex-discrimination-title-ix"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    San Francisco Unified School District
                  </a>
                  <ul className="detail-list detail-list--inset">
                    <li>
                      <a
                        href="https://drive.google.com/file/d/1M2njXNeBJ00dUoiqypqifuSEQu8Uf81t/view"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Title IX Complaint Form
                      </a>
                    </li>
                    <li>Office of Equity</li>
                  </ul>
                  <span className="detail-row__meta">
                    Phone: 415-355-7334 · Email: equity@sfusd.edu
                  </span>
                </div>
              </li>
              <li className="detail-row detail-row--stack">
                <span className="detail-row__label">SFPD</span>
                <div className="detail-row__value">
                  <a
                    href="https://www.sanfranciscopolice.org/get-service/sexual-assault"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    San Francisco Police Department
                  </a>
                  <ul className="detail-list detail-list--inset">
                    <li>
                      <a
                        href="https://drive.google.com/file/d/1M2njXNeBJ00dUoiqypqifuSEQu8Uf81t/view"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Title IX Complaint Form
                      </a>
                    </li>
                    <li>Special Victims Unit</li>
                  </ul>
                  <span className="detail-row__meta">
                    Phone: 415-553-1361 · Email: sfpd.sexcrimes@sfgov.org
                  </span>
                </div>
              </li>
              <li className="detail-row detail-row--stack">
                <span className="detail-row__label">SFWAR</span>
                <div className="detail-row__value">
                  <a
                    href="https://sfwar.org/programs-services/advocacy-counseling/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    San Francisco Women Against Rape
                  </a>
                  <ul className="detail-list detail-list--inset">
                    <li>Advocacy & Counseling Program</li>
                  </ul>
                  <span className="detail-row__meta">
                    Phone: 415-861-2024 · Email: dac@sfwar.org
                  </span>
                </div>
              </li>
            </ul>
            <p className="detail-note">
              <strong>Title IX Coordinators:</strong> Ms. Liverpool
              (liverpoolk@sfusd.edu), Ms. Fong (fongc3@sfusd.edu)
            </p>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">Key forms</h2>
            <div className="detail-links">
              <a
                className="detail-btn detail-btn--primary"
                href="https://drive.google.com/file/d/1M2njXNeBJ00dUoiqypqifuSEQu8Uf81t/view"
                target="_blank"
                rel="noopener noreferrer"
              >
                SFUSD Title IX Complaint Form
              </a>
              <a
                className="detail-btn detail-btn--ghost"
                href="https://drive.google.com/file/d/1mLVM9x8aYIftEUHCQ_blYr6_djKaN5FE/view"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lowell Incident Report Form
              </a>
            </div>
            <p className="detail-note">
              tinyurl.com/titleixformalcomplaint · tinyurl.com/lhsincidentreport
            </p>
          </section>
        </div>

        <aside className="detail-content__aside" aria-label="Quick links">
          <section className="detail-block">
            <h2 className="detail-block__heading">Office of Equity</h2>
            <p className="detail-text">
              SFUSD guidance, processes, and district-level contact information.
            </p>
            <div className="detail-links detail-links--column">
              <a
                className="detail-btn detail-btn--ghost"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.sfusd.edu/departments/office-equity"
              >
                Visit Office of Equity
              </a>
            </div>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">Investigation resources</h2>
            <div className="detail-links detail-links--column">
              <a
                className="detail-btn detail-btn--ghost"
                target="_blank"
                rel="noopener noreferrer"
                href="https://drive.google.com/file/d/1Lb_elI3OHaRCE6htqcGOWVIkzjNiL8b8/view"
              >
                Investigation overview
              </a>
              <a
                className="detail-btn detail-btn--ghost"
                target="_blank"
                rel="noopener noreferrer"
                href="https://drive.google.com/file/d/1zcOlCWZxyqmgbFQ9JcD5jO2pnyxAFvXU/view"
              >
                Student & family FAQ
              </a>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

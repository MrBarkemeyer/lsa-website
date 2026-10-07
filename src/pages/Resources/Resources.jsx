import { Link } from "react-router-dom";
import "../../styles/DetailPage.scss";

export default function Resources() {
  return (
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <p className="detail-hero__eyebrow">Helpful links</p>
          <h1 className="detail-hero__title">Student Resources</h1>
          <p className="detail-hero__lead">
            Support, safety, and helpful links for Lowell students.
          </p>
        </div>
      </header>

      <div className="detail-content detail-content--single">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">Primary resources</h2>
            <ul className="detail-rows">
              <li className="detail-row detail-row--stack">
                <span className="detail-row__label">Wellness</span>
                <div className="detail-row__value">
                  Wellness Center
                  <span className="detail-row__desc">
                    Mental health and emotional support resources from the
                    Lowell wellness team.
                  </span>
                  <div className="detail-links detail-links--after">
                    <Link
                      to="/Resources/Wellness"
                      className="detail-btn detail-btn--primary"
                    >
                      Open wellness resources
                    </Link>
                  </div>
                </div>
              </li>
              <li className="detail-row detail-row--stack">
                <span className="detail-row__label">Title IX</span>
                <div className="detail-row__value">
                  Title IX Support
                  <span className="detail-row__desc">
                    Learn your rights, reporting options, and contact
                    information for help.
                  </span>
                  <div className="detail-links detail-links--after">
                    <Link
                      to="/Resources/TitleIX"
                      className="detail-btn detail-btn--primary"
                    >
                      Open Title IX resources
                    </Link>
                  </div>
                </div>
              </li>
            </ul>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">More helpful pages</h2>
            <div className="detail-links">
              <Link to="/Clubs" className="detail-btn detail-btn--ghost">
                Browse clubs
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

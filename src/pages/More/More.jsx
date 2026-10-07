import { Link } from "react-router-dom";
import "../../styles/DetailPage.scss";

export default function More() {
  return (
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <p className="detail-hero__eyebrow">Explore</p>
          <h1 className="detail-hero__title">More from LSA</h1>
          <p className="detail-hero__lead">
            Quick links to Events, Archives, and Freshmen Corner.
          </p>
        </div>
      </header>

      <div className="detail-content detail-content--single">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">Pages</h2>
            <ul className="detail-rows">
              <li className="detail-row detail-row--stack">
                <span className="detail-row__label">Events</span>
                <div className="detail-row__value">
                  Events
                  <span className="detail-row__desc">
                    Browse Lowell events by month.
                  </span>
                  <div className="detail-links detail-links--after">
                    <Link to="/Events" className="detail-btn detail-btn--primary">
                      Open events
                    </Link>
                  </div>
                </div>
              </li>
              <li className="detail-row detail-row--stack">
                <span className="detail-row__label">Archives</span>
                <div className="detail-row__value">
                  LSA Archives
                  <span className="detail-row__desc">
                    Archived boards and media by year.
                  </span>
                  <div className="detail-links detail-links--after">
                    <Link
                      to="/Archives"
                      className="detail-btn detail-btn--primary"
                    >
                      Open archives
                    </Link>
                  </div>
                </div>
              </li>
              <li className="detail-row detail-row--stack">
                <span className="detail-row__label">Freshmen</span>
                <div className="detail-row__value">
                  Freshmen Corner
                  <span className="detail-row__desc">
                    Start here for class resources and quick links.
                  </span>
                  <div className="detail-links detail-links--after">
                    <Link
                      to="/FreshmenCorner"
                      className="detail-btn detail-btn--primary"
                    >
                      Open Freshmen Corner
                    </Link>
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

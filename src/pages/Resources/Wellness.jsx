import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../../styles/DetailPage.scss";

export default function Wellness() {
  return (
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <Link to="/Resources" className="detail-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Student resources
          </Link>
          <p className="detail-hero__eyebrow">Support</p>
          <h1 className="detail-hero__title">Lowell Wellness Center</h1>
          <p className="detail-hero__lead">
            You are not alone. Support is available on and off campus.
          </p>
        </div>
      </header>

      <div className="detail-content">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">About wellness support</h2>
            <p className="detail-text">
              The Lowell Wellness Team supports students through stress, life
              changes, and day-to-day challenges. Whether you are overwhelmed,
              anxious, or just need someone to talk to, this is a safe place to
              check in.
            </p>
            <p className="detail-text">
              Wellness services are here to help you care for your mental
              health, develop coping strategies, and stay connected to trusted
              adults and resources.
            </p>
          </section>
        </div>

        <aside className="detail-content__aside" aria-label="Get support">
          <section className="detail-block">
            <h2 className="detail-block__heading">Need immediate support?</h2>
            <p className="detail-text">
              If there is an urgent safety concern, contact 911 right away.
            </p>
            <div className="detail-links detail-links--column">
              <a
                className="detail-btn detail-btn--primary"
                href="https://www.988lifeline.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                988 Crisis Lifeline
              </a>
            </div>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">Looking for school support?</h2>
            <p className="detail-text">
              Reach out to school counselors, wellness staff, or a trusted
              teacher for support and referrals.
            </p>
            <div className="detail-links detail-links--column">
              <a
                className="detail-btn detail-btn--ghost"
                href="https://www.sfusd.edu/school/lowell-high-school"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lowell school contacts
              </a>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

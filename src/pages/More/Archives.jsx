import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../../styles/DetailPage.scss";

export default function Archives() {
  return (
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <Link to="/More" className="detail-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            More from LSA
          </Link>
          <p className="detail-hero__eyebrow">History</p>
          <h1 className="detail-hero__title">LSA Archives</h1>
        </div>
      </header>

      <div className="detail-content detail-content--single">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">About the archives</h2>
            <p className="detail-text">
              The nature of high school lends it to being transitory-people come
              to Lowell for four years and move on to bigger and better things.
              The LSA Archives are a way to remember that high school experience.
              All boards, committees, and other elected officials are archived
              under the year in which they served. Photos and other media can be
              found on each board&apos;s respective social media pages. For full
              event albums, email lowellhssbc@gmail.com.
            </p>
            <p className="detail-note">Coming soon</p>
          </section>
        </div>
      </div>
    </main>
  );
}

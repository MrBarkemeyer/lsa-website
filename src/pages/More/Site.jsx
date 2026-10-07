import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../../styles/DetailPage.scss";

export default function Site() {
  return (
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <Link to="/More" className="detail-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            More from LSA
          </Link>
          <p className="detail-hero__eyebrow">About</p>
          <h1 className="detail-hero__title">About This Website</h1>
        </div>
      </header>

      <div className="detail-content detail-content--single">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">Maintained by LSA</h2>
            <p className="detail-text">
              This site is maintained by the Lowell Student Association (LSA).
              For questions or updates, contact lowellhssbc@gmail.com.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../../styles/DetailPage.scss";
import "./Registry.scss";

export default function Registry() {
  const SPREADSHEET_ID = "1A-_2bJtMrByR2uPgT4uAyXeEx3Q6IYwWzZ-YuWLg65U";
  const GID = "225032051";

  // I dont like Iframes but this our solution for now
  const iframeSrc = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/htmlview?gid=${GID}`;

  return (
    <main className="detail-page registry-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <Link to="/FreshmenCorner" className="detail-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Freshmen Corner
          </Link>
          <p className="detail-hero__eyebrow">Directory</p>
          <h1 className="detail-hero__title">Master registry list</h1>
          <p className="detail-hero__lead">
            View the registry list with its original formatting and
            color-coding.
          </p>
        </div>
      </header>

      <div className="detail-content detail-content--wide">
        <section
          className="detail-block registry-embed-section"
          aria-label="Registry list embed"
        >
          <div className="registry-embed">
            <iframe
              title="Master registry list"
              src={iframeSrc}
              loading="lazy"
            />
          </div>

          <p className="registry-open-note">
            If the embed doesn&apos;t load, open it directly in Google Sheets:{" "}
            <a
              href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?gid=${GID}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open registry
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import ClassroomCodeBlock from "./ClassroomCodeBlock.jsx";
import GuideResourceGrid from "./GuideResourceGrid.jsx";
import { sbcOfficerName } from "../../../utils/sbcOfficer.js";
import "../../../styles/DetailPage.scss";

const CLASSROOM_CODE = "q4h5rk2j";
const COORDINATOR_EMAIL = "lowelleventscoordinator@gmail.com";

/** Set `href` when you have public URLs; items without `href` show a Classroom hint. */
const EVENT_FORMS = [
  {
    title: "Event planning form",
    description: "Initial request to plan a club event (not a fundraiser).",
  },
  {
    title: "Event planning form (submit)",
    description: "Submission or follow-up step after drafting your event plan.",
  },
  {
    title: "Lowell facility usage form",
    description: "Reserve rooms or spaces on campus for your approved event.",
  },
];

const AFTER_APPROVAL = [
  {
    title: "Flier request form",
    description:
      "Request approval to post paper fliers around school after your event is cleared.",
  },
];

export default function EventPlanning({ officerData }) {
  const eventsCoordinator = sbcOfficerName(officerData, "Events Coordinator");

  return (
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <Link to="/Clubs/ClubResources" className="detail-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Club resources
          </Link>
          <p className="detail-hero__eyebrow">Events</p>
          <h1 className="detail-hero__title">Event planning resources</h1>
          <p className="detail-hero__lead">
            Forms and contacts for club events. Fundraisers use a separate
            process see fundraising resources.
          </p>
        </div>
      </header>

      <div className="detail-content">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">About this guide</h2>
            <p className="detail-text">
              Club <strong>events</strong> and <strong>fundraisers</strong>{" "}
              follow different rules. Use this page for performances, meetings,
              and other non-fundraising activities. For sales and donation
              drives, go to{" "}
              <Link to="/Clubs/Fundraising">Fundraising resources</Link>.
              Starting a new club? See{" "}
              <Link to="/Clubs/NewClub">How to start a club</Link>.
            </p>
          </section>

          <ClassroomCodeBlock code={CLASSROOM_CODE} />

          <section className="detail-block">
            <h2 className="detail-block__heading">Planning forms</h2>
            <p className="detail-text">
              Use these in order when your advisor and SBC expect them. If a
              link is not listed here yet, open the Activities Classroom the
              live file usually lives there first.
            </p>
            <GuideResourceGrid items={EVENT_FORMS} />
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">
              After your event is approved
            </h2>
            <p className="detail-text">
              You can promote on social media according to school guidelines.
              For printed fliers in hallways, submit the flier request form.
            </p>
            <GuideResourceGrid items={AFTER_APPROVAL} />
          </section>
        </div>

        <aside className="detail-content__aside" aria-label="Contact">
          <section className="detail-block">
            <h2 className="detail-block__heading">Events coordinator</h2>
            {eventsCoordinator ? (
              <p className="detail-text">
                <strong>{eventsCoordinator}</strong>
                <br />
                SBC Events Coordinator
              </p>
            ) : (
              <p className="detail-text">SBC Events Coordinator</p>
            )}
            <div className="detail-links detail-links--column">
              <a
                className="detail-btn detail-btn--primary"
                href={`mailto:${COORDINATOR_EMAIL}`}
              >
                <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
                {COORDINATOR_EMAIL}
              </a>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

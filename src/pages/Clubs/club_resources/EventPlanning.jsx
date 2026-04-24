import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./ClubResourceGuidePage.scss";
import ClassroomCodeBlock from "./ClassroomCodeBlock.jsx";
import GuideResourceGrid from "./GuideResourceGrid.jsx";

const CLASSROOM_CODE = "knmn6yuw";
const COORDINATOR_EMAIL = "lowelleventscoordinator@gmail.com";

/** Set `href` when you have public URLs; cards without `href` show a Classroom hint. */
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
    description: "Request approval to post paper fliers around school after your event is cleared.",
  },
];

export default function EventPlanning() {
  return (
    <section className="club-guide-page">
      <header className="club-guide-page__hero">
        <h1>Event planning resources</h1>
        <p className="club-guide-page__tagline">
          Forms and contacts for club events. Fundraisers use a separate
          process see fundraising resources.
        </p>
      </header>

      <div className="club-guide-page__main">
        <Link className="club-guide-page__back" to="/Clubs/ClubResources">
          <FontAwesomeIcon icon={faArrowLeft} aria-hidden />
          Back to club resources
        </Link>

        <p className="club-guide-page__lede">
          Club <strong>events</strong> and <strong>fundraisers</strong> follow
          different rules. Use this page for performances, meetings, and other
          non-fundraising activities. For sales and donation drives, go to{" "}
          <Link to="/Clubs/Fundraising">Fundraising resources</Link>. Starting a
          new club? See{" "}
          <Link to="/Clubs/NewClub">How to start a club</Link>.
        </p>

        <div className="club-guide-page__contact">
          <span className="club-guide-page__contact-label">Events coordinator</span>
          <span>Brandon Ho (SBC)</span>
          <span aria-hidden>·</span>
          <a
            className="club-guide-page__contact-mail"
            href={`mailto:${COORDINATOR_EMAIL}`}
          >
            {COORDINATOR_EMAIL}
          </a>
        </div>

        <ClassroomCodeBlock code={CLASSROOM_CODE} />

        <div className="club-guide-page__section">
          <h2 className="club-guide-page__section-title">Planning forms</h2>
          <p className="club-guide-page__section-intro">
            Use these in order when your advisor and SBC expect them. If a link
            is not listed here yet, open the Activities Classroom below the
            live file usually lives there first.
          </p>
          <GuideResourceGrid items={EVENT_FORMS} />
        </div>

        <div className="club-guide-page__next">
          <h2 className="club-guide-page__next-title">After your event is approved</h2>
          <p className="club-guide-page__next-body">
            You can promote on social media according to school guidelines. For
            printed fliers in hallways, submit the flier request form.
          </p>
          <GuideResourceGrid items={AFTER_APPROVAL} />
        </div>
      </div>
    </section>
  );
}

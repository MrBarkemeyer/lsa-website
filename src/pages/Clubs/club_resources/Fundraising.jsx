import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./ClubResourceGuidePage.scss";
import ClassroomCodeBlock from "./ClassroomCodeBlock.jsx";
import GuideResourceGrid from "./GuideResourceGrid.jsx";

const CLASSROOM_CODE = "knmn6yuw";
const COORDINATOR_EMAIL = "lowellsbc.treasurer@gmail.com";

/** Set `href` for public URLs; cards without `href` show a Classroom hint. */
const FUNDRAISING_RESOURCES = [
  {
    title: "Fundraising handbook",
    description: "Policies, restrictions, and how advertising for fundraisers must work.",
  },
  {
    title: "Pre-fundraising form",
    description: "Start here before you commit to a fundraiser idea or date.",
  },
  {
    title: "Before fundraising doc",
    description: "Checklist and details to complete before you collect money or goods.",
  },
  {
    title: "Fundraising request form",
    description: "Official request for SBC/treasurer approval of your fundraiser.",
  },
  {
    title: "Fundraising reconciliation doc",
    description: "Close out your fundraiser and account for funds afterward.",
  },
  {
    title: "SFUSD nutrition guidelines",
    description: "Required reading if food or beverages are part of your sale.",
  },
  {
    title: "Treasurer training",
    description: "Training materials or recording for club treasurers.",
  },
  {
    title: "After fundraising form",
    description: "Wrap-up paperwork once the fundraiser has ended.",
  },
  {
    title: "Form templates",
    description: "Blank templates you can adapt for your club.",
  },
  {
    title: "Form examples",
    description: "Sample completed forms for reference.",
  },
  {
    title: "Club budget sheet",
    description: "Same budget tool used across clubs; tie fundraising goals to your budget.",
  },
];

const PROMOTION = [
  {
    title: "Flier request form",
    description: "Request permission to hang promotional fliers after approval.",
  },
];

export default function Fundraising() {
  return (
    <section className="club-guide-page">
      <header className="club-guide-page__hero">
        <h1>Fundraising resources</h1>
        <p className="club-guide-page__tagline">
          Handbooks, approvals, and treasurer workflows for club fundraisers at
          Lowell.
        </p>
      </header>

      <div className="club-guide-page__main">
        <Link className="club-guide-page__back" to="/Clubs/ClubResources">
          <FontAwesomeIcon icon={faArrowLeft} aria-hidden />
          Back to club resources
        </Link>

        <p className="club-guide-page__lede">
          Club <strong>fundraisers</strong> are not the same as general{" "}
          <strong>events</strong>. Use this page for sales, drives, and
          donation-based activities. For non-fundraising events, use{" "}
          <Link to="/Clubs/EventPlanning">Event planning resources</Link>. New
          club setup lives under{" "}
          <Link to="/Clubs/NewClub">How to start a club</Link>.
        </p>

        <div className="club-guide-page__contact">
          <span className="club-guide-page__contact-label">SBC treasurer</span>
          <span>Kaitlyn Huey</span>
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
          <h2 className="club-guide-page__section-title">
            Documents &amp; forms
          </h2>
          <p className="club-guide-page__section-intro">
            Work with your advisor and the treasurer in the order your handbook
            describes. If something is not linked here yet, check the Activities
            Google Classroom first (join code above)-that is where forms are
            usually posted.
          </p>
          <GuideResourceGrid items={FUNDRAISING_RESOURCES} />
        </div>

        <div className="club-guide-page__next">
          <h2 className="club-guide-page__next-title">
            After your fundraiser is approved
          </h2>
          <p className="club-guide-page__next-body">
            Promote according to the fundraising handbook some kinds of
            advertising are restricted. For printed fliers at school, use the
            flier request form.
          </p>
          <GuideResourceGrid items={PROMOTION} />
        </div>
      </div>
    </section>
  );
}

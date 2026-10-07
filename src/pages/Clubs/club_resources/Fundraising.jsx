import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import ClassroomCodeBlock from "./ClassroomCodeBlock.jsx";
import GuideResourceGrid from "./GuideResourceGrid.jsx";
import { sbcOfficerName } from "../../../utils/sbcOfficer.js";
import "../../../styles/DetailPage.scss";

const CLASSROOM_CODE = "q4h5rk2j";
const COORDINATOR_EMAIL = "lowellsbc.treasurer@gmail.com";

/** Set `href` for public URLs; items without `href` show a Classroom hint. */
const FUNDRAISING_RESOURCES = [
  {
    title: "Fundraising handbook",
    description:
      "Policies, restrictions, and how advertising for fundraisers must work.",
  },
  {
    title: "Pre-fundraising form",
    description: "Start here before you commit to a fundraiser idea or date.",
  },
  {
    title: "Before fundraising doc",
    description:
      "Checklist and details to complete before you collect money or goods.",
  },
  {
    title: "Fundraising request form",
    description:
      "Official request for SBC/treasurer approval of your fundraiser.",
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
    description:
      "Same budget tool used across clubs; tie fundraising goals to your budget.",
  },
];

const PROMOTION = [
  {
    title: "Flier request form",
    description:
      "Request permission to hang promotional fliers after approval.",
  },
];

export default function Fundraising({ officerData }) {
  const treasurer = sbcOfficerName(officerData, "Treasurer");

  return (
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <Link to="/Clubs/ClubResources" className="detail-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Club resources
          </Link>
          <p className="detail-hero__eyebrow">Treasurer</p>
          <h1 className="detail-hero__title">Fundraising resources</h1>
          <p className="detail-hero__lead">
            Handbooks, approvals, and treasurer workflows for club fundraisers
            at Lowell.
          </p>
        </div>
      </header>

      <div className="detail-content">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">About this guide</h2>
            <p className="detail-text">
              Club <strong>fundraisers</strong> are not the same as general{" "}
              <strong>events</strong>. Use this page for sales, drives, and
              donation-based activities. For non-fundraising events, use{" "}
              <Link to="/Clubs/EventPlanning">Event planning resources</Link>.
              New club setup lives under{" "}
              <Link to="/Clubs/NewClub">How to start a club</Link>.
            </p>
          </section>

          <ClassroomCodeBlock code={CLASSROOM_CODE} />

          <section className="detail-block">
            <h2 className="detail-block__heading">Documents and forms</h2>
            <p className="detail-text">
              Work with your advisor and the treasurer in the order your
              handbook describes. If something is not linked here yet, check the
              Activities Google Classroom first (join code above)-that is where
              forms are usually posted.
            </p>
            <GuideResourceGrid items={FUNDRAISING_RESOURCES} />
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">
              After your fundraiser is approved
            </h2>
            <p className="detail-text">
              Promote according to the fundraising handbook some kinds of
              advertising are restricted. For printed fliers at school, use the
              flier request form.
            </p>
            <GuideResourceGrid items={PROMOTION} />
          </section>
        </div>

        <aside className="detail-content__aside" aria-label="Contact">
          <section className="detail-block">
            <h2 className="detail-block__heading">SBC treasurer</h2>
            {treasurer ? (
              <p className="detail-text">
                <strong>{treasurer}</strong>
                <br />
                SBC Treasurer
              </p>
            ) : (
              <p className="detail-text">SBC Treasurer</p>
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

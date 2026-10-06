import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFileLines,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import { sbcOfficerName } from "../../../utils/sbcOfficer.js";
import "./NewClub.scss";

const CLASSROOM_CODE = "q4h5rk2j";
const COORDINATOR_EMAIL = "lowellclubcoord25@gmail.com";

const FORM_LINKS = [
  {
    title: "Petition for new club",
    description: "Official petition to propose a new club at Lowell.",
  },
  {
    title: "Club registration form",
    description: "Submit your club's details for recognition.",
  },
  {
    title: "Club contract",
    description: "Agreement between your club and the school.",
  },
  {
    title: "Club policies",
    description: "Rules and expectations for all recognized clubs.",
  },
  {
    title: "Club budget sheet",
    description: "Template for planning and tracking club finances.",
  },
];

function Step({ number, title, children }) {
  return (
    <article className="new-club-page__step">
      <div className="new-club-page__step-head">
        <span className="new-club-page__step-badge" aria-hidden>
          {number}
        </span>
        <h2 className="new-club-page__step-title">{title}</h2>
      </div>
      {children}
    </article>
  );
}

Step.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default function NewClub({ officerData }) {
  const [copied, setCopied] = useState(false);
  const clubCoordinator = sbcOfficerName(officerData, "Club Coordinator");

  async function copyJoinCode() {
    try {
      await navigator.clipboard.writeText(CLASSROOM_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section className="new-club-page">
      <header className="new-club-page__hero">
        <h1>How to start a club</h1>
        <p className="new-club-page__tagline">
          From joining the Activities Classroom to approved forms and your
          bulletin board follow these steps to register a new club at Lowell.
        </p>
      </header>

      <div className="new-club-page__main">
        <Link className="new-club-page__back" to="/Clubs/ClubResources">
          <FontAwesomeIcon icon={faArrowLeft} aria-hidden />
          Back to club resources
        </Link>

        <p className="new-club-page__lede">
          This guide is for <strong>starting a new club</strong>. For event
          logistics or fundraisers, use the{" "}
          <Link to="/Clubs/EventPlanning">event planning</Link> and{" "}
          <Link to="/Clubs/Fundraising">fundraising</Link> pages. Extra
          announcements and forms also live in the Activities Google Classroom
          you must join it to submit documents and get updates.
        </p>

        <div className="new-club-page__contact">
          <span className="new-club-page__contact-label">Club coordinator</span>
          {clubCoordinator ? (
            <>
              <span>{clubCoordinator} (SBC)</span>
              <span aria-hidden>·</span>
            </>
          ) : null}
          <a
            className="new-club-page__contact-mail"
            href={`mailto:${COORDINATOR_EMAIL}`}
          >
            {COORDINATOR_EMAIL}
          </a>
        </div>

        <div className="new-club-page__steps">
          <Step number={1} title="Join the 2026-27 Activities Google Classroom">
            <p className="new-club-page__step-body">
              You'll find deadlines, forms, and school-wide club announcements
              here. Materials may be linked elsewhere, but submission and key
              updates happen in Classroom.
            </p>
            <div className="new-club-page__code-row">
              <span className="new-club-page__code">{CLASSROOM_CODE}</span>
              <button
                type="button"
                className={`new-club-page__copy${copied ? " new-club-page__copy--done" : ""}`}
                onClick={copyJoinCode}
              >
                {copied ? "Copied" : "Copy code"}
              </button>
            </div>
          </Step>

          <Step number={2} title="Complete and submit the required forms">
            <p className="new-club-page__step-body">
              Before you can hold meetings, complete the documents below. They
              are available in the Activities Google Classroom. Get approval
              from the SBC club coordinator, and turn everything in by the
              stated deadlines. Digital signatures are preferred when possible.
            </p>
            <p className="new-club-page__note">
              Questions about a form? Email{" "}
              <a href={`mailto:${COORDINATOR_EMAIL}`}>{COORDINATOR_EMAIL}</a>.
            </p>
            <div className="new-club-page__form-grid">
              {FORM_LINKS.map((item) => (
                <div key={item.title} className="new-club-page__form-card">
                  <span className="new-club-page__form-icon" aria-hidden>
                    <FontAwesomeIcon icon={faFileLines} />
                  </span>
                  <h3 className="new-club-page__form-title">{item.title}</h3>
                  <p className="new-club-page__form-desc">{item.description}</p>
                  <span className="new-club-page__form-cta">
                    Available in Google Classroom
                  </span>
                </div>
              ))}
            </div>
          </Step>

          <Step number={3} title="Create your club bulletin board">
            <p className="new-club-page__step-body">
              After you receive an email confirming your club and approved
              paperwork, you'll get access to a spreadsheet with your bulletin
              board assignment. Decorate your board per the instructions, then
              complete any follow-up form your coordinator shares (posted in
              Classroom or sent by email).
            </p>
            <p className="new-club-page__note">
              <FontAwesomeIcon icon={faTableColumns} aria-hidden /> Watch your
              inbox and the Activities Classroom for the board roster and
              submission link.
            </p>
          </Step>

          <Step number={4} title="Launch your club">
            <p className="new-club-page__step-body">
              Promote your club, set a regular meeting time and place, and keep
              officers and members informed through Classroom and your own
              channels. Stay in touch with the club coordinator if policies or
              rosters change during the year.
            </p>
          </Step>
        </div>
      </div>
    </section>
  );
}

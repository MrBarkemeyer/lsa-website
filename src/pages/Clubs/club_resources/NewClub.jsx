import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowUpRightFromSquare,
  faFileLines,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import "./NewClub.scss";

const CLASSROOM_CODE = "knmn6yuw";
const COORDINATOR_EMAIL = "lowellclubcoord25@gmail.com";

const FORM_LINKS = [
  {
    title: "Petition for new club",
    description: "Official petition to propose a new club at Lowell.",
    href: "https://docs.google.com/document/d/1C2tdUqwsz1S0V9ZbfCRr1k_uonUBG-SceAxFLxdT48o/edit?tab=t.0",
  },
  {
    title: "Club registration form",
    description: "Submit your club’s details for recognition.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSelC6x-lAH0ZDVCV6rgW3kPS3rtA2EY3Ovt1ymoaQirc82ojg/viewform?usp=send_form",
  },
  {
    title: "Club contract",
    description: "Agreement between your club and the school.",
    href: "https://docs.google.com/document/d/1Ma-iRM0Ekb_u6JsmHUrumZdr3akvoKn254Tq3bPK03A/edit?tab=t.0",
  },
  {
    title: "Club policies",
    description: "Rules and expectations for all recognized clubs.",
    href: "https://docs.google.com/document/d/1e-gC-V2FurpMbVvCAsreaLbWMTrX41U6O7_tsdczjoE/edit?tab=t.0",
  },
  {
    title: "Club budget sheet",
    description: "Template for planning and tracking club finances.",
    href: "https://docs.google.com/spreadsheets/d/1rA3dCsXYGsM59IIUCbi6FT1KawqKG4EuvjWyYuJhk-c/edit?authuser=0&usp=classroom_web",
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

export default function NewClub() {
  const [copied, setCopied] = useState(false);

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
          announcements and forms also live in the Activities Google Classroom you
          must join it to submit documents and get updates.
        </p>

        <div className="new-club-page__contact">
          <span className="new-club-page__contact-label">Club coordinator</span>
          <span>Enkhiinkhuslen Tegshjargal (SBC)</span>
          <span aria-hidden>·</span>
          <a
            className="new-club-page__contact-mail"
            href={`mailto:${COORDINATOR_EMAIL}`}
          >
            {COORDINATOR_EMAIL}
          </a>
        </div>

        <div className="new-club-page__steps">
          <Step number={1} title="Join the 2025-26 Activities Google Classroom">
            <p className="new-club-page__step-body">
              You’ll find deadlines, forms, and school-wide club announcements
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
              Before you can hold meetings, complete the documents below and get
              approval from the SBC club coordinator. Everything should be
              turned in by the stated deadlines; digital signatures are
              preferred when possible.
            </p>
            <p className="new-club-page__note">
              Questions about a form? Email{" "}
              <a href={`mailto:${COORDINATOR_EMAIL}`}>{COORDINATOR_EMAIL}</a>.
            </p>
            <div className="new-club-page__form-grid">
              {FORM_LINKS.map((item) => (
                <a
                  key={item.href}
                  className="new-club-page__form-card"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="new-club-page__form-icon" aria-hidden>
                    <FontAwesomeIcon icon={faFileLines} />
                  </span>
                  <h3 className="new-club-page__form-title">{item.title}</h3>
                  <p className="new-club-page__form-desc">{item.description}</p>
                  <span className="new-club-page__form-cta">
                    Open
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </span>
                </a>
              ))}
            </div>
          </Step>

          <Step number={3} title="Create your club bulletin board">
            <p className="new-club-page__step-body">
              After you receive an email confirming your club and approved
              paperwork, you’ll get access to a spreadsheet with your bulletin
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

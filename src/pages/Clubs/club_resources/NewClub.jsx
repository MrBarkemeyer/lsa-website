import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { sbcOfficerName } from "../../../utils/sbcOfficer.js";
import "../../../styles/DetailPage.scss";

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
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <Link to="/Clubs/ClubResources" className="detail-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Club resources
          </Link>
          <p className="detail-hero__eyebrow">New clubs</p>
          <h1 className="detail-hero__title">How to start a club</h1>
          <p className="detail-hero__lead">
            From joining the Activities Classroom to approved forms and your
            bulletin board follow these steps to register a new club at Lowell.
          </p>
        </div>
      </header>

      <div className="detail-content">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">About this guide</h2>
            <p className="detail-text">
              This guide is for <strong>starting a new club</strong>. For event
              logistics or fundraisers, use the{" "}
              <Link to="/Clubs/EventPlanning">event planning</Link> and{" "}
              <Link to="/Clubs/Fundraising">fundraising</Link> pages. Extra
              announcements and forms also live in the Activities Google
              Classroom you must join it to submit documents and get updates.
            </p>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">
              Step 1 · Join the Activities Google Classroom
            </h2>
            <p className="detail-text">
              You&apos;ll find deadlines, forms, and school-wide club
              announcements here. Materials may be linked elsewhere, but
              submission and key updates happen in Classroom.
            </p>
            <div className="detail-code">
              <div className="detail-code__row">
                <span className="detail-code__value">{CLASSROOM_CODE}</span>
                <button
                  type="button"
                  className={`detail-code__copy${copied ? " detail-code__copy--done" : ""}`}
                  onClick={copyJoinCode}
                >
                  {copied ? "Copied" : "Copy code"}
                </button>
              </div>
            </div>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">
              Step 2 · Complete and submit the required forms
            </h2>
            <p className="detail-text">
              Before you can hold meetings, complete the documents below. They
              are available in the Activities Google Classroom. Get approval
              from the SBC club coordinator, and turn everything in by the
              stated deadlines. Digital signatures are preferred when possible.
            </p>
            <p className="detail-note">
              Questions about a form? Email{" "}
              <a href={`mailto:${COORDINATOR_EMAIL}`}>{COORDINATOR_EMAIL}</a>.
            </p>
            <ul className="detail-rows">
              {FORM_LINKS.map((item) => (
                <li key={item.title} className="detail-row detail-row--stack">
                  <span className="detail-row__label">In Classroom</span>
                  <div className="detail-row__value">
                    {item.title}
                    <span className="detail-row__desc">{item.description}</span>
                    <span className="detail-row__meta">
                      Available in Activities Google Classroom
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">
              Step 3 · Create your club bulletin board
            </h2>
            <p className="detail-text">
              After you receive an email confirming your club and approved
              paperwork, you&apos;ll get access to a spreadsheet with your
              bulletin board assignment. Decorate your board per the
              instructions, then complete any follow-up form your coordinator
              shares (posted in Classroom or sent by email).
            </p>
            <p className="detail-note">
              Watch your inbox and the Activities Classroom for the board roster
              and submission link.
            </p>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">Step 4 · Launch your club</h2>
            <p className="detail-text">
              Promote your club, set a regular meeting time and place, and keep
              officers and members informed through Classroom and your own
              channels. Stay in touch with the club coordinator if policies or
              rosters change during the year.
            </p>
          </section>
        </div>

        <aside className="detail-content__aside" aria-label="Contact">
          <section className="detail-block">
            <h2 className="detail-block__heading">Club coordinator</h2>
            {clubCoordinator ? (
              <p className="detail-text">
                <strong>{clubCoordinator}</strong>
                <br />
                SBC Club Coordinator
              </p>
            ) : (
              <p className="detail-text">SBC Club Coordinator</p>
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

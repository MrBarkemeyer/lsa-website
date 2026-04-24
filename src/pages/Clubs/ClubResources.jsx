import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCalendarDays,
  faChalkboardUser,
  faHandHoldingDollar,
  faEnvelope,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import "./ClubResources.scss";

const CLASSROOM_CODE = "knmn6yuw";
const COORDINATOR_EMAIL = "lowellclubcoord25@gmail.com";

export default function ClubResources() {
  const [copied, setCopied] = useState(false);

  async function copyJoinCode() {
    try {
      await navigator.clipboard.writeText(CLASSROOM_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API unavailable */
    }
  }

  return (
    <section className="club-resources-page">
      <header className="club-resources-page__hero">
        <h1>Club resources</h1>
        <p className="club-resources-page__tagline">
          Materials and contacts for current club leaders and students starting
          a new club everything in one place.
        </p>
      </header>

      <div className="club-resources-page__main">
        <p className="club-resources-page__lede">
          Welcome, club leaders and students. Use the Activities Google
          Classroom for deadlines and forms, reach out to the SBC club
          coordinator with questions, and open the guides below for how-tos on
          charters, events, and fundraising.
        </p>

        <div className="club-resources-page__cards">
          <article className="club-resources-page__card">
            <div className="club-resources-page__card-head">
              <div className="club-resources-page__card-icon" aria-hidden>
                <FontAwesomeIcon icon={faGoogle} />
              </div>
              <div>
                <h2 className="club-resources-page__card-title">
                  2025–26 Activities Google Classroom
                </h2>
              </div>
            </div>
            <p className="club-resources-page__card-body">
              Announcements, co-curricular sign-ups, and important forms. You
              must join the Classroom to submit documents and get updates this
              site only mirrors some of what is posted there.
            </p>
            <div className="club-resources-page__code-row">
              <span className="club-resources-page__code">{CLASSROOM_CODE}</span>
              <button
                type="button"
                className={`club-resources-page__copy${copied ? " club-resources-page__copy--done" : ""}`}
                onClick={copyJoinCode}
              >
                {copied ? "Copied" : "Copy code"}
              </button>
            </div>
          </article>

          <article className="club-resources-page__card">
            <div className="club-resources-page__card-head">
              <div className="club-resources-page__card-icon" aria-hidden>
                <FontAwesomeIcon icon={faChalkboardUser} />
              </div>
              <div>
                <h2 className="club-resources-page__card-title">
                  Club coordinator
                </h2>
              </div>
            </div>
            <p className="club-resources-page__card-body">
              <strong>Enkhiinkhuslen Tegshjargal</strong>
              <br />
              SBC Club Coordinator
            </p>
            <a
              className="club-resources-page__mailto"
              href={`mailto:${COORDINATOR_EMAIL}`}
            >
              <FontAwesomeIcon icon={faEnvelope} />
              {COORDINATOR_EMAIL}
            </a>
          </article>
        </div>

        <h2 className="club-resources-page__section-title">Guides &amp; tools</h2>
        <div className="club-resources-page__guides">
          <Link className="club-resources-page__guide" to="/Clubs/NewClub">
            <span className="club-resources-page__guide-icon" aria-hidden>
              <FontAwesomeIcon icon={faRocket} />
            </span>
            <h3 className="club-resources-page__guide-title">
              How to start a club
            </h3>
            <p className="club-resources-page__guide-desc">
              Charter process, requirements, and steps to register a new club at
              Lowell.
            </p>
            <span className="club-resources-page__guide-cta">
              Open guide
              <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </Link>

          <Link
            className="club-resources-page__guide"
            to="/Clubs/EventPlanning"
          >
            <span className="club-resources-page__guide-icon" aria-hidden>
              <FontAwesomeIcon icon={faCalendarDays} />
            </span>
            <h3 className="club-resources-page__guide-title">
              Event planning
            </h3>
            <p className="club-resources-page__guide-desc">
              Resources for scheduling, approvals, and running club events
              safely and on time.
            </p>
            <span className="club-resources-page__guide-cta">
              Open guide
              <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </Link>

          <Link className="club-resources-page__guide" to="/Clubs/Fundraising">
            <span className="club-resources-page__guide-icon" aria-hidden>
              <FontAwesomeIcon icon={faHandHoldingDollar} />
            </span>
            <h3 className="club-resources-page__guide-title">Fundraising</h3>
            <p className="club-resources-page__guide-desc">
              Policies, ideas, and paperwork for club fundraising activities.
            </p>
            <span className="club-resources-page__guide-cta">
              Open guide
              <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

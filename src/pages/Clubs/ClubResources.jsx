import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { sbcOfficerName } from "../../utils/sbcOfficer.js";
import "../../styles/DetailPage.scss";

const CLASSROOM_CODE = "q4h5rk2j";
const COORDINATOR_EMAIL = "lowellclubcoord25@gmail.com";

const GUIDES = [
  {
    label: "Start",
    title: "How to start a club",
    description:
      "Charter process, requirements, and steps to register a new club at Lowell.",
    to: "/Clubs/NewClub",
  },
  {
    label: "Events",
    title: "Event planning",
    description:
      "Resources for scheduling, approvals, and running club events safely and on time.",
    to: "/Clubs/EventPlanning",
  },
  {
    label: "Funds",
    title: "Fundraising",
    description:
      "Policies, ideas, and paperwork for club fundraising activities.",
    to: "/Clubs/Fundraising",
  },
];

export default function ClubResources({ officerData }) {
  const [copied, setCopied] = useState(false);
  const clubCoordinator = sbcOfficerName(officerData, "Club Coordinator");

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
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <Link to="/Clubs" className="detail-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            All clubs
          </Link>
          <p className="detail-hero__eyebrow">Leaders and organizers</p>
          <h1 className="detail-hero__title">Club resources</h1>
          <p className="detail-hero__lead">
            Materials and contacts for current club leaders and students
            starting a new club everything in one place.
          </p>
        </div>
      </header>

      <div className="detail-content">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">Overview</h2>
            <p className="detail-text">
              Welcome, club leaders and students. Use the Activities Google
              Classroom for deadlines and forms, reach out to the SBC club
              coordinator with questions, and open the guides below for how-tos
              on charters, events, and fundraising.
            </p>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">Guides and tools</h2>
            <ul className="detail-rows">
              {GUIDES.map((guide) => (
                <li key={guide.to} className="detail-row detail-row--stack">
                  <span className="detail-row__label">{guide.label}</span>
                  <div className="detail-row__value">
                    {guide.title}
                    <span className="detail-row__desc">{guide.description}</span>
                    <div className="detail-links detail-links--after">
                      <Link
                        to={guide.to}
                        className="detail-btn detail-btn--primary"
                      >
                        Open guide
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="detail-content__aside" aria-label="Quick access">
          <section className="detail-block">
            <h2 className="detail-block__heading">
              2026-27 Activities Google Classroom
            </h2>
            <p className="detail-text">
              Announcements, co-curricular sign-ups, and important forms. You
              must join the Classroom to submit documents and get updates this
              site only mirrors some of what is posted there.
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

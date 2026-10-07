import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../../styles/DetailPage.scss";

const SECTIONS = [
  {
    id: "overview",
    title: "Spirit at Lowell",
    body: (
      <>
        <p className="detail-text">
          Lowell competes in class spirit as well as academics. Spirit weeks are
          a chance for each grade to show hall art, rally games, and dance
          performances.
        </p>
        <p className="detail-text">
          Fall Spirit Week is the main event: each grade gets a theme and builds
          a committee for hallway, dance, and rally. Winning classes are chosen
          by anonymous judges using hall decoration, participation, dance, and
          rally wins.
        </p>
      </>
    ),
  },
  {
    id: "art",
    title: "Art Committee",
    body: (
      <p className="detail-text">
        Cover the halls with posters that match your theme. Open to everyone you
        can paint, sketch, and help your class come together.
      </p>
    ),
  },
  {
    id: "dance",
    title: "Dance Committee",
    body: (
      <p className="detail-text">
        Choreograph and perform a routine for Spirit Rally. Dance scores are a
        big part of the overall spirit score so bring your best moves.
      </p>
    ),
  },
  {
    id: "freshmen",
    title: "Freshmen Spirit Committee",
    body: (
      <p className="detail-text">
        Freshmen don&apos;t have a class board yet. The SBC Club Coordinator and
        Elections Commissioner run the freshmen Spirit Committee. Watch for an
        info meeting early in the year.
      </p>
    ),
  },
  {
    id: "late-night",
    title: "Late night",
    body: (
      <p className="detail-text">
        The Friday before Spirit Week is a big push: posters go up, dancers
        drill, and the whole committee works from after school until around
        10pm. Class boards provide food for volunteers.
      </p>
    ),
  },
  {
    id: "join",
    title: "How to join",
    body: (
      <p className="detail-text">
        Show up when you can Spirit Committee needs lots of people. Attendance
        can be signed off for extracurricular credit. You can join more than one
        subcommittee.
      </p>
    ),
  },
];

export default function SpiritCommittee() {
  return (
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <Link to="/LSA/Commitees" className="detail-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Committees
          </Link>
          <p className="detail-hero__eyebrow">Spirit Week</p>
          <h1 className="detail-hero__title">Spirit Committee</h1>
          <p className="detail-hero__lead">
            Hall art, rally games, and the spirit dance each class builds a team
            for Spirit Week.
          </p>
        </div>
      </header>

      <div className="detail-content detail-content--single">
        <div className="detail-content__main">
          {SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="detail-block"
            >
              <h2 className="detail-block__heading">{section.title}</h2>
              {section.body}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

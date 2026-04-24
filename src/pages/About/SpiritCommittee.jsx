import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBrush,
  faHandshake,
  faMoon,
  faMusic,
  faPersonRunning,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import "./About.scss";

const SECTIONS = [
  {
    id: "overview",
    title: "Spirit at Lowell",
    icon: faPersonRunning,
    body: (
      <>
        <p>
          Lowell competes in class spirit as well as academics. Spirit weeks are a
          chance for each grade to show hall art, rally games, and dance performances.
        </p>
        <p>
          Fall Spirit Week is the main event: each grade gets a theme and builds a
          committee for hallway, dance, and rally. Winning classes are chosen by
          anonymous judges using hall decoration, participation, dance, and rally wins.
        </p>
      </>
    ),
  },
  {
    id: "art",
    title: "Art Committee",
    icon: faBrush,
    body: (
      <p>
        Cover the halls with posters that match your theme. Open to everyone you can
        paint, sketch, and help your class come together.
      </p>
    ),
  },
  {
    id: "dance",
    title: "Dance Committee",
    icon: faMusic,
    body: (
      <p>
        Choreograph and perform a routine for Spirit Rally. Dance scores are a big part
        of the overall spirit score so bring your best moves.
      </p>
    ),
  },
  {
    id: "freshmen",
    title: "Freshmen Spirit Committee",
    icon: faUserGroup,
    body: (
      <p>
        Freshmen don&apos;t have a class board yet. The SBC Club Coordinator and
        Elections Commissioner run the freshmen Spirit Committee. Watch for an info
        meeting early in the year.
      </p>
    ),
  },
  {
    id: "late-night",
    title: "Late night",
    icon: faMoon,
    body: (
      <p>
        The Friday before Spirit Week is a big push: posters go up, dancers drill, and
        the whole committee works from after school until around 10pm. Class boards
        provide food for volunteers.
      </p>
    ),
  },
  {
    id: "join",
    title: "How to join",
    icon: faHandshake,
    body: (
      <p>
        Show up when you can Spirit Committee needs lots of people. Attendance can be
        signed off for extracurricular credit. You can join more than one subcommittee.
      </p>
    ),
  },
];

export default function SpiritCommittee() {
  return (
    <main className="spirit-committee-page">
      <header className="spirit-committee-page__hero">
        <h1>Spirit Committee</h1>
        <p>
          Hall art, rally games, and the spirit dance each class builds a team for
          Spirit Week.
        </p>
      </header>

      <nav className="spirit-committee-page__nav" aria-label="Breadcrumb">
        <Link to="/LSA/Commitees" className="spirit-committee-page__nav-link">
          <FontAwesomeIcon icon={faArrowLeft} aria-hidden /> Committees
        </Link>
      </nav>

      <div className="spirit-committee-page__content">
        <div className="spirit-committee-page__grid">
          {SECTIONS.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="spirit-committee-page__card"
            >
              <div className="spirit-committee-page__card-icon" aria-hidden>
                <FontAwesomeIcon icon={section.icon} />
              </div>
              <h2 className="spirit-committee-page__card-title">{section.title}</h2>
              <div className="spirit-committee-page__card-body">{section.body}</div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

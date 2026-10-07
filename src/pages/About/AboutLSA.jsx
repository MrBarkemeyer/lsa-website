import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "../../styles/DetailPage.scss";

function boardHref(boardName) {
  return `/LSA/${encodeURIComponent(boardName)}`;
}

const BOARDS = [
  {
    name: "SBC",
    meta: "School-wide",
    to: boardHref("SBC"),
    primary: true,
  },
  {
    name: "Senior",
    meta: "Class of 2027",
    to: boardHref("Senior Board"),
  },
  {
    name: "Junior",
    meta: "Class of 2028",
    to: boardHref("Junior Board"),
  },
  {
    name: "Sophomore",
    meta: "Class of 2029",
    to: boardHref("Sophomore Board"),
  },
  {
    name: "Freshman",
    meta: "Class of 2030",
    to: boardHref("Freshman Board"),
  },
];

export default function AboutLSA() {
  return (
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <p className="detail-hero__eyebrow">Student government</p>
          <h1 className="detail-hero__title">Lowell Student Association</h1>
          <p className="detail-hero__lead">
            Student government representing all of Lowell
          </p>
        </div>
      </header>

      <div className="detail-actions" aria-label="All LSA boards">
        <div className="detail-actions__inner">
          <p className="detail-actions__label">Meet the boards</p>
          <nav className="detail-board-nav" aria-label="Board directory">
            {BOARDS.map((board) => (
              <Link
                key={board.to}
                to={board.to}
                className={`detail-board-nav__link${board.primary ? " detail-board-nav__link--primary" : ""}`}
              >
                <span className="detail-board-nav__name">{board.name}</span>
                <span className="detail-board-nav__meta">{board.meta}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">What is LSA</h2>
            <p className="detail-text">
              Lowell Student Association is the umbrella term for Lowell&apos;s
              student government - all the boards together - including the
              Student Body Council (SBC) and class boards for Seniors, Juniors,
              Sophomores, and Freshmen. We represent the student population and
              operate under the rules in our charter.
            </p>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">SBC vs class boards</h2>
            <ul className="detail-rows">
              <li className="detail-row detail-row--stack">
                <span className="detail-row__label">SBC</span>
                <div className="detail-row__value">
                  Student Body Council
                  <span className="detail-row__desc">
                    SBC runs school-wide events and dances: Homecoming, Spirit
                    Rallies, Winterball, Last Dance, Co-Curricular Day, and
                    more. We amplify the student voice and make changes based on
                    what students want.
                  </span>
                  <span className="detail-row__meta">
                    Positions: President, Vice President, Election Commissioner,
                    Secretary, Treasurer, Community Liaison, Club Coordinator,
                    Events Coordinator, Dance Coordinator, Public Relations,
                    Co-Public Relations.
                  </span>
                </div>
              </li>
              <li className="detail-row detail-row--stack">
                <span className="detail-row__label">Class boards</span>
                <div className="detail-row__value">
                  Class boards
                  <span className="detail-row__desc">
                    Class boards focus on their own grade. They fundraise for
                    major events like prom, boat, and graduation, and build
                    class spirit with smaller events and bonding activities.
                  </span>
                  <span className="detail-row__meta">
                    Positions: President, Vice President, Secretary, Treasurer,
                    Historian, Public Relations.
                  </span>
                </div>
              </li>
            </ul>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">How to join LSA</h2>
            <p className="detail-text">
              Two elections are held each year. In the <strong>fall</strong>,
              only freshmen run - that election selects the Freshman board. In
              the <strong>spring</strong>, all grades (except seniors) can run
              for SBC and class boards. The Election Commissioner runs both;
              watch for posters and info meetings when the time comes.
            </p>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">Where to find us</h2>
            <p className="detail-text">
              LSA meets in <strong>Room 80A</strong> - also known as &quot;the
              Cave&quot; - the small room to the right from the art wing.
              We&apos;re there during 1st block Leadership. You can also reach
              out to any LSA member at school; photos and info are in the
              &quot;Meet the Members&quot; section.
            </p>
          </section>
        </div>

        <aside className="detail-content__aside" aria-label="Quick links">
          <section className="detail-block">
            <h2 className="detail-block__heading">All boards</h2>
            <p className="detail-text">
              Open a board to meet this year&apos;s officers.
            </p>
            <div className="detail-board-list">
              {BOARDS.map((board) => (
                <Link
                  key={`aside-${board.to}`}
                  to={board.to}
                  className="detail-board-list__link"
                >
                  <span>
                    {board.name}
                    {board.primary ? " · Student Body Council" : ` · ${board.meta}`}
                  </span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="detail-board-list__arrow"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">Governing rules</h2>
            <p className="detail-text">
              Read the Charter of the Lowell Student Association for our
              governing rules and bylaws.
            </p>
            <div className="detail-links detail-links--column">
              <Link to="Charter" className="detail-btn detail-btn--ghost">
                Read the charter
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

import { Link } from "react-router-dom";
import "./About.scss";

function boardHref(boardName) {
  return `/LSA/${encodeURIComponent(boardName)}`;
}

export default function LSAExplore() {
  return (
    <>
      <div className="title">
        <h1>Explore LSA</h1>
        <p className="about-lsa-tagline">Student government boards for every grade</p>
      </div>

      <div className="about-lsa">
        <section className="about-lsa-section">
          <h2>SBC and class boards</h2>
          <div className="about-lsa-cards">
            <div className="about-lsa-card">
              <h3>Student Body Council (SBC)</h3>
              <p>
                Runs school-wide events and amplifies student voice across Lowell.
              </p>
              <Link to={boardHref("SBC")} className="about-lsa-card-link">
                Meet the SBC &rarr;
              </Link>
            </div>

            <div className="about-lsa-card">
              <h3>Senior Board</h3>
              <p>Leads senior-focused events and builds class spirit.</p>
              <Link to={boardHref("Senior Board")} className="about-lsa-card-link">
                Explore Senior Board &rarr;
              </Link>
            </div>

            <div className="about-lsa-card">
              <h3>Junior Board</h3>
              <p>Plans junior events and grows class engagement.</p>
              <Link to={boardHref("Junior Board")} className="about-lsa-card-link">
                Explore Junior Board &rarr;
              </Link>
            </div>

            <div className="about-lsa-card">
              <h3>Sophomore Board</h3>
              <p>Organizes sophomore activities and strengthens community.</p>
              <Link to={boardHref("Sophomore Board")} className="about-lsa-card-link">
                Explore Sophomore Board &rarr;
              </Link>
            </div>

            <div className="about-lsa-card">
              <h3>Freshman Board</h3>
              <p>Welcomes new Cardinals and kickstarts freshman involvement.</p>
              <Link to={boardHref("Freshman Board")} className="about-lsa-card-link">
                Explore Freshman Board &rarr;
              </Link>
            </div>
          </div>
        </section>

        <section className="about-lsa-section">
          <h2>How to join</h2>
          <p>
            LSA elections happen throughout the year. In the fall, the Freshman Board
            is selected. In the spring, other grades (except seniors) can run for
            SBC and their class board.
          </p>
          <Link to="/Elections" className="about-lsa-card-link">
            See election details &rarr;
          </Link>
        </section>
      </div>
    </>
  );
}


import { Link } from "react-router-dom";
import "./About.scss";

export default function AboutLSA() {
  return (
    <>
      <div className="title">
        <h1>Lowell Student Association</h1>
        <p className="about-lsa-tagline">Student government representing all of Lowell</p>
      </div>
      <div className="about-lsa">
        <section className="about-lsa-section about-lsa-intro">
          <p>
            Lowell Student Association is the umbrella term for Lowell&apos;s student
            government - all the boards together - including the Student Body
            Council (SBC) and class boards for Seniors, Juniors, Sophomores, and
            Freshmen. We represent the student population and operate under the
            rules in our charter.
          </p>
        </section>

        <section className="about-lsa-section">
          <h2>SBC vs Class Boards</h2>
          <div className="about-lsa-cards">
            <div className="about-lsa-card">
              <h3>Student Body Council (SBC)</h3>
              <p>
                SBC runs school-wide events and dances: Homecoming, Spirit Rallies,
                Winterball, Last Dance, Co-Curricular Day, and more. We amplify the
                student voice and make changes based on what students want.
              </p>
              <p className="about-lsa-roles">
                <strong>Positions:</strong> President, Vice President, Election
                Commissioner, Secretary, Treasurer, Community Liaison, Club
                Coordinator, Events Coordinator, Dance Coordinator, Public
                Relations, Co-Public Relations.
              </p>
              <Link to="SBC" className="about-lsa-card-link">Meet the SBC &rarr;</Link>
            </div>
            <div className="about-lsa-card">
              <h3>Class Boards</h3>
              <p>
                Class boards focus on their own grade. They fundraise for major
                events like prom, boat, and graduation, and build class spirit with
                smaller events and bonding activities.
              </p>
              <p className="about-lsa-roles">
                <strong>Positions:</strong> President, Vice President, Secretary,
                Treasurer, Historian, Public Relations.
              </p>
              <Link to="/LSA-EXPLORE" className="about-lsa-card-link">Explore LSA &rarr;</Link>
            </div>
          </div>
        </section>

        <section className="about-lsa-section">
          <h2>How to join LSA</h2>
          <p>
            Two elections are held each year. In the <strong>fall</strong>, only
            freshmen run - that election selects the Freshman board. In the{" "}
            <strong>spring</strong>, all grades (except seniors) can run for SBC
            and class boards. The Election Commissioner runs both; watch for
            posters and info meetings when the time comes.
          </p>
        </section>

        <section className="about-lsa-section">
          <h2>Where to find us</h2>
          <p>
            LSA meets in <strong>Room 80A</strong> - also known as &quot;the
            Cave&quot; - the small room to the right from the art wing. We&apos;re
            there during 1st block Leadership. You can also reach out to any LSA
            member at school; photos and info are in the &quot;Meet the
            Members&quot; section.
          </p>
        </section>

        <Link to="Charter" className="about-lsa-charter-cta">
          <span className="about-lsa-charter-title">Charter of the Lowell Student Association</span>
          <span className="about-lsa-charter-desc">Read our governing rules and bylaws</span>
        </Link>
      </div>
    </>
  );
}

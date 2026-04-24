import { Link } from "react-router-dom";
import "./Resources.scss";

export default function Resources() {
  return (
    <main className="resource-page resources-hub">
      <header className="resource-hero">
        <div className="title">
          <h1>Student Resources</h1>
          <p>Support, safety, and helpful links for Lowell students.</p>
        </div>
      </header>

      <div className="resource-content">
        <section className="resource-grid" aria-label="Primary resource links">
          <article className="resource-tile">
            <h2>Wellness Center</h2>
            <p>
              Mental health and emotional support resources from the Lowell wellness
              team.
            </p>
            <Link to="/Resources/Wellness" className="resource-link-btn">
              Open wellness resources
            </Link>
          </article>

          <article className="resource-tile">
            <h2>Title IX Support</h2>
            <p>
              Learn your rights, reporting options, and contact information for help.
            </p>
            <Link to="/Resources/TitleIX" className="resource-link-btn">
              Open Title IX resources
            </Link>
          </article>
        </section>

        <section className="resource-section">
          <h2 className="resource-section__heading">More helpful pages</h2>
          <div className="resource-links" aria-label="Other pages links">
            <Link to="/ApplicationsOpen" className="resource-link-btn resource-link-btn--ghost">
              Applications open
            </Link>
            <Link to="/Clubs" className="resource-link-btn resource-link-btn--ghost">
              Browse clubs
            </Link>
            <Link to="/Announcements" className="resource-link-btn resource-link-btn--ghost">
              Announcements
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}


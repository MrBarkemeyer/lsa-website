import { Link } from "react-router-dom";
import "../Resources/Resources.scss";

export default function More() {
  return (
    <main className="resource-page">
      <header className="resource-hero">
        <div className="title">
          <h1>More from LSA</h1>
          <p>Quick links to Events, Announcements, Archives, and Freshmen Corner.</p>
        </div>
      </header>

      <div className="resource-content">
        <section className="resource-grid" aria-label="More pages">
          <article className="resource-tile">
            <h2>Events</h2>
            <p>Browse upcoming Lowell events on the timeline.</p>
            <Link to="/Events" className="resource-link-btn">
              Open events
            </Link>
          </article>

          <article className="resource-tile">
            <h2>Announcements</h2>
            <p>Recent updates and posts across LSA.</p>
            <Link to="/Announcements" className="resource-link-btn">
              Open announcements
            </Link>
          </article>

          <article className="resource-tile">
            <h2>LSA Archives</h2>
            <p>Archived boards and media by year.</p>
            <Link to="/Archives" className="resource-link-btn">
              Open archives
            </Link>
          </article>

          <article className="resource-tile">
            <h2>Freshmen Corner</h2>
            <p>Start here for class resources and quick links.</p>
            <Link to="/FreshmenCorner" className="resource-link-btn">
              Open Freshmen Corner
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}


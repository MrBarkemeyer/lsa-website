import "./Resources.scss";

export default function Wellness() {
  return (
    <main className="resource-page">
      <header className="resource-hero">
        <div className="title">
          <h1>Lowell Wellness Center</h1>
          <p>You are not alone. Support is available on and off campus.</p>
        </div>
      </header>
      <div className="resource-content">
        <section className="resource-section">
          <article className="resource-card">
            <h2 className="resource-section__heading">About wellness support</h2>
            <p>
              The Lowell Wellness Team supports students through stress, life changes,
              and day-to-day challenges. Whether you are overwhelmed, anxious, or just
              need someone to talk to, this is a safe place to check in.
            </p>
            <p>
              Wellness services are here to help you care for your mental health,
              develop coping strategies, and stay connected to trusted adults and
              resources.
            </p>
          </article>
        </section>

        <section className="resource-grid" aria-label="Wellness actions">
          <article className="resource-tile">
            <h2>Need immediate support?</h2>
            <p>If there is an urgent safety concern, contact 911 right away.</p>
            <a
              className="resource-link-btn"
              href="https://www.988lifeline.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              988 Crisis Lifeline
            </a>
          </article>

          <article className="resource-tile">
            <h2>Looking for school support?</h2>
            <p>
              Reach out to school counselors, wellness staff, or a trusted teacher for
              support and referrals.
            </p>
            <a
              className="resource-link-btn resource-link-btn--ghost"
              href="https://www.sfusd.edu/school/lowell-high-school"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lowell school contacts
            </a>
          </article>
        </section>
      </div>
    </main>
  );
}

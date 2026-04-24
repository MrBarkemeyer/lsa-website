import "../Resources/Resources.scss";
import "./Registry.scss";

export default function Registry() {
  const SPREADSHEET_ID = "1A-_2bJtMrByR2uPgT4uAyXeEx3Q6IYwWzZ-YuWLg65U";
  const GID = "225032051";

  // I dont like Iframes but this our solution for now
  const iframeSrc = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/htmlview?gid=${GID}`;

  return (
    <main className="resource-page registry-page">
      <header className="resource-hero">
        <div className="title">
          <h1>Master registry list</h1>
          <p>View the registry list with its original formatting and color-coding.</p>
        </div>
      </header>

      <div className="resource-content">
        <section className="registry-embed-section" aria-label="Registry list embed">
          <div className="registry-embed">
            <iframe
              title="Master registry list"
              src={iframeSrc}
              loading="lazy"
            />
          </div>

          <p className="registry-open-note">
            If the embed doesn’t load, open it directly in Google Sheets:
            {" "}
            <a
              href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?gid=${GID}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open registry
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}


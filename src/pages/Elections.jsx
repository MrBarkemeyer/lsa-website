import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import electionsConfig from "../config/elections.config.js";
import "./Elections.scss";

// sheet columns can be "President" or "president" or whatever - normalize to camelCase so we don't cry
function normalizeElectionRow(row) {
  if (!row || typeof row !== "object") return row;
  const keyMap = {
    board: ["board", "Board"],
    color: ["color", "Color"],
    president: ["president", "President"],
    vicePresident: ["vicePresident", "Vice President", "VicePresident"],
    secretary: ["secretary", "Secretary"],
    treasurer: ["treasurer", "Treasurer"],
    publicRelations: ["publicRelations", "Public Relations", "PublicRelations"],
    historian: ["historian", "Historian"],
    clubCoordinator: ["clubCoordinator", "Club Coordinator", "ClubCoordinator"],
    danceCoordinator: ["danceCoordinator", "Dance Coordinator", "DanceCoordinator"],
    communityLiaison: ["communityLiaison", "Community Liaison", "CommunityLiaison"],
  };
  const out = {};
  for (const [camelKey, possibleHeaders] of Object.entries(keyMap)) {
    for (const h of possibleHeaders) {
      if (row[h] !== undefined && row[h] !== "") {
        out[camelKey] = row[h];
        break;
      }
    }
  }
  return out;
}

// which roles we show and what we call them on the results cards
const RESULT_ROLES = [
  ["president", "President"],
  ["vicePresident", "Vice President"],
  ["secretary", "Secretary"],
  ["treasurer", "Treasurer"],
  ["publicRelations", "Public Relations"],
  ["historian", "Historian"],
  ["clubCoordinator", "Club Coordinator"],
  ["danceCoordinator", "Dance Coordinator"],
  ["communityLiaison", "Community Liaison"],
];

function getResultRows(element) {
  const rows = [];
  for (const [key, label] of RESULT_ROLES) {
    const value = element[key];
    if (value != null && String(value).trim() !== "") rows.push({ role: label, value: String(value).trim() });
  }
  return rows;
}

// one little card per board - title, accent color, list of roles/names
function ElectionBoardCard({ board, color, rows, interactive = false }) {
  const accent = color || "var(--title-color)";

  return (
    <article className="election-board-card" style={{ "--board-accent": accent }}>
      <span className="election-board-card-accent-dot" aria-hidden="true" />
      <div className="election-board-card-header">
        <h3 className="election-board-card-title">{board}</h3>
        <p className="election-board-card-meta">
          {rows.length} {rows.length === 1 ? "position" : "positions"}
        </p>
      </div>
      <div className="election-board-card-body">
        {rows.map(({ role, value }, i) => (
          <div key={i} className="election-board-card-row">
            <span className="election-board-card-role">{role}:</span>
            <span className="election-board-card-value">{value}</span>
          </div>
        ))}
      </div>
      {interactive ? (
        <div className="election-board-card-footer">
          <span className="election-board-card-cta">View board</span>
        </div>
      ) : (
        <div className="election-board-card-footer">
          <span className="election-board-card-cta election-board-card-cta--static">Election results</span>
        </div>
      )}
      {!rows.length ? (
        <div className="election-board-card-body">
          <p className="election-board-card-more">No positions listed yet.</p>
        </div>
      ) : null}
    </article>
  );
}

ElectionBoardCard.propTypes = {
  board: PropTypes.string.isRequired,
  color: PropTypes.string,
  rows: PropTypes.arrayOf(
    PropTypes.shape({ role: PropTypes.string.isRequired, value: PropTypes.string.isRequired })
  ).isRequired,
  interactive: PropTypes.bool,
};

export default function Elections({
  electionData,
  electionsEnabled = true,
  electionsConfig: config = electionsConfig,
}) {
  const state = config?.state ?? "results";
  const rawElections = electionData || [];
  const ElectionResults = rawElections.map(normalizeElectionRow).filter((r) => r.board);

  // nobody's voting right now - show the "elections are closed" message
  if (!electionsEnabled) {
    return (
      <div className="elections-page">
        <header className="elections-hero">
          <h1 className="elections-hero-title">LSA Board</h1>
          <p className="elections-hero-subtitle">Elections</p>
        </header>
        <section className="election-section election-state-off">
          <div className="elections-message-box">
            <h2>No elections at this time</h2>
            <p>{config?.notHappeningMessage ?? "Elections are not currently happening. Check back later for updates."}</p>
          </div>
        </section>
      </div>
    );
  }

  // elections are approaching - show a "coming soon" message
  if (state === "pending") {
    return (
      <div className="elections-page">
        <header className="elections-hero">
          <h1 className="elections-hero-title">LSA Board</h1>
          <p className="elections-hero-subtitle">Elections</p>
          <span className="elections-hero-badge">Coming soon</span>
        </header>
        <section className="election-section election-state-off">
          <div className="elections-message-box">
            <h2>{config?.pendingTitle ?? "Elections are coming soon"}</h2>
            <p>
              {config?.pendingSubtitle ??
                "Please stay tuned for updates."}
            </p>
          </div>
        </section>
      </div>
    );
  }

  // Polling — candidate boards (URLs and nav; see electionAccess.js)
  if (state === "polling") {
    const contenders = config?.contenders ?? [];
    return (
      <div className="elections-page">
        <header className="elections-hero">
          <h1 className="elections-hero-title">LSA Board</h1>
          <p className="elections-hero-subtitle">Elections</p>
        </header>
        <section className="election-section">
          <div className="elections-state-header">
            <h1>{config?.pollingTitle ?? "Elections - vote now"}</h1>
            <p>{config?.pollingSubtitle ?? "Polls are open. Cast your vote below."}</p>
          </div>
          {contenders.length === 0 ? (
            <div className="elections-message-box">
              <p>Candidate information will be posted here once available.</p>
            </div>
          ) : (
            <>
              <p className="elections-scroll-hint">Swipe left/right to see all boards</p>
              <div className="elections-board-cards">
                {contenders.map((group, index) => {
                  const rows = (group.roles ?? []).map((r) => {
                    const cands = Array.isArray(r.candidates) ? r.candidates : [];
                    const names = cands.map((c) => (typeof c === "string" ? c : c?.name ?? "")).filter(Boolean);
                    return { role: r.role, value: names.join(", ") };
                  });
                  const slug = group.slug;
                  const card = (
                    <ElectionBoardCard
                      key={index}
                      board={group.board}
                      color={group.color}
                      rows={rows}
                      interactive={Boolean(slug)}
                    />
                  );
                  return slug ? (
                    <Link key={index} to={`/Elections/${slug}`} className="elections-board-card-link">
                      {card}
                    </Link>
                  ) : (
                    <div key={index}>{card}</div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    );
  }

  if (state !== "results") {
    return (
      <div className="elections-page">
        <header className="elections-hero">
          <h1 className="elections-hero-title">LSA Board</h1>
          <p className="elections-hero-subtitle">Elections</p>
          <span className="elections-hero-badge">Coming soon</span>
        </header>
        <section className="election-section election-state-off">
          <div className="elections-message-box">
            <h2>{config?.pendingTitle ?? "Elections are coming soon"}</h2>
            <p>{config?.pendingSubtitle ?? "Please stay tuned for updates."}</p>
          </div>
        </section>
      </div>
    );
  }

  const displayResults = ElectionResults.length > 0 ? ElectionResults : [
    {
      board: "LSA 2029 Election Results",
      color: "#9c1919",
      president: "Taran Yang",
      vicePresident: "Preston Wang",
      secretary: "Violette Trinh-Hsu",
      treasurer: "Shirley Guan",
      publicRelations: "Zarina Gorji",
      historian: "Ashley Zhao",
    },
  ];

  return (
    <div className="elections-page">
      <header className="elections-hero">
        <h1 className="elections-hero-title">LSA Board</h1>
        <p className="elections-hero-subtitle">Elections</p>
        <span className="elections-hero-badge">Results</span>
      </header>
      <section className="election-section">
        <p className="elections-scroll-hint">Swipe left/right to see all boards</p>
        <div className="elections-board-cards">
          {displayResults.map((element, index) => (
            <ElectionBoardCard
              key={index}
              board={element.board}
              color={element.color}
              rows={getResultRows(element)}
              interactive={false}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

Elections.propTypes = {
  electionData: PropTypes.arrayOf(
    PropTypes.shape({
      board: PropTypes.string,
      color: PropTypes.string,
      president: PropTypes.string,
      vicePresident: PropTypes.string,
      secretary: PropTypes.string,
      treasurer: PropTypes.string,
      publicRelations: PropTypes.string,
      historian: PropTypes.string,
      clubCoordinator: PropTypes.string,
      danceCoordinator: PropTypes.string,
      communityLiaison: PropTypes.string,
    })
  ),
  electionsEnabled: PropTypes.bool,
  electionsConfig: PropTypes.shape({
    state: PropTypes.oneOf(["pending", "polling", "results"]),
    notHappeningMessage: PropTypes.string,
    pendingTitle: PropTypes.string,
    pendingSubtitle: PropTypes.string,
    pollingTitle: PropTypes.string,
    pollingSubtitle: PropTypes.string,
    contenders: PropTypes.arrayOf(
      PropTypes.shape({
        board: PropTypes.string,
        color: PropTypes.string,
        roles: PropTypes.arrayOf(
          PropTypes.shape({
            role: PropTypes.string,
            candidates: PropTypes.arrayOf(
              PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.shape({
                  name: PropTypes.string,
                  description: PropTypes.string,
                  pfp: PropTypes.string,
                  video: PropTypes.string,
                }),
              ])
            ),
          })
        ),
      })
    ),
  }),
};

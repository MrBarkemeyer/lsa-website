import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import electionsConfig from "../../config/elections.config.js";
import { areElectionResultsPublic } from "../../utils/electionAccess.js";
import "../Elections.scss";

// Normalize sheet rows (same mapping as `Elections.jsx` so results cards render consistently).
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
    if (value != null && String(value).trim() !== "") {
      rows.push({ role: label, value: String(value).trim() });
    }
  }
  return rows;
}

function ElectionBoardCard({ board, color, rows }) {
  const accent = color || "var(--title-color)";

  return (
    <article className="election-board-card" style={{ "--board-accent": accent }}>
      <div className="election-board-card-header">
        <h3 className="election-board-card-title">{board}</h3>
      </div>
      <div className="election-board-card-body">
        {rows.map(({ role, value }, i) => (
          <div key={i} className="election-board-card-row">
            <span className="election-board-card-role">{role}:</span>
            <span className="election-board-card-value">{value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

ElectionBoardCard.propTypes = {
  board: PropTypes.string.isRequired,
  color: PropTypes.string,
  rows: PropTypes.arrayOf(
    PropTypes.shape({ role: PropTypes.string.isRequired, value: PropTypes.string.isRequired })
  ).isRequired,
};

export default function ElectionResults({
  electionData,
  electionsEnabled = true,
  electionsConfig: config = electionsConfig,
}) {
  const state = config?.state ?? "results";
  const rawElections = electionData || [];
  const ElectionResults = rawElections.map(normalizeElectionRow).filter((r) => r.board);

  // Elections are off site-wide.
  if (!electionsEnabled) {
    return (
      <div className="elections-page">
        <header className="elections-hero">
          <h1 className="elections-hero-title">LSA Board</h1>
          <p className="elections-hero-subtitle">Election Results</p>
        </header>
        <section className="election-section election-state-off">
          <div className="elections-message-box">
            <h2>No elections at this time</h2>
            <p>{config?.notHappeningMessage ?? "Elections are not currently happening. Check back later for updates."}</p>
          </div>
        </section>
        <div className="center" style={{ marginTop: "1rem" }}>
          <Link to="/Elections">Back to elections</Link>
        </div>
      </div>
    );
  }

  // Elections exist, but results aren't ready yet.
  if (state === "pending") {
    return (
      <div className="elections-page">
        <header className="elections-hero">
          <h1 className="elections-hero-title">LSA Board</h1>
          <p className="elections-hero-subtitle">Election Results</p>
          <span className="elections-hero-badge">Coming soon</span>
        </header>
        <section className="election-section">
          <div className="elections-message-box">
            <h2>{config?.pendingTitle ?? "Elections are coming soon"}</h2>
            <p>{config?.pendingSubtitle ?? "Please stay tuned for updates."}</p>
          </div>
        </section>
        <div className="center" style={{ marginTop: "1rem" }}>
          <Link to="/Elections">Back to elections</Link>
        </div>
      </div>
    );
  }

  if (state === "polling") {
    return (
      <div className="elections-page">
        <header className="elections-hero">
          <h1 className="elections-hero-title">LSA Board</h1>
          <p className="elections-hero-subtitle">Election Results</p>
          <span className="elections-hero-badge">Results</span>
        </header>
        <section className="election-section">
          <div className="elections-message-box">
            <h2>Results not posted yet</h2>
            <p>
              {config?.pollingBar?.message ??
                "Results will be posted after voting ends."}
            </p>
            <p style={{ marginTop: "0.75rem", fontStyle: "italic", color: "#666" }}>
              Check back when elections are closed.
            </p>
          </div>
        </section>
        <div className="center" style={{ marginTop: "1rem" }}>
          <Link to="/Elections">Back to elections</Link>
        </div>
      </div>
    );
  }

  if (!areElectionResultsPublic(config)) {
    return (
      <div className="elections-page">
        <header className="elections-hero">
          <h1 className="elections-hero-title">LSA Board</h1>
          <p className="elections-hero-subtitle">Election Results</p>
          <span className="elections-hero-badge">Coming soon</span>
        </header>
        <section className="election-section">
          <div className="elections-message-box">
            <h2>Results not posted yet</h2>
            <p>{config?.pendingSubtitle ?? "Please stay tuned for updates."}</p>
          </div>
        </section>
        <div className="center" style={{ marginTop: "1rem" }}>
          <Link to="/Elections">Back to elections</Link>
        </div>
      </div>
    );
  }

  // Final results (or placeholder if the sheet is empty).
  const displayResults =
    ElectionResults.length > 0
      ? ElectionResults
      : [
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
        <p className="elections-hero-subtitle">Election Results</p>
        <span className="elections-hero-badge">Results</span>
      </header>
      <section className="election-section">
        <div className="elections-board-cards">
          {displayResults.map((element, index) => (
            <ElectionBoardCard
              key={index}
              board={element.board}
              color={element.color}
              rows={getResultRows(element)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

ElectionResults.propTypes = {
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
    pollingBar: PropTypes.shape({
      message: PropTypes.string,
      resultsLabel: PropTypes.string,
      resultsPath: PropTypes.string,
      enabled: PropTypes.bool,
    }),
  }),
};


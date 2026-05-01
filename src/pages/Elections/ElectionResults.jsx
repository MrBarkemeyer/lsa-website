import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import electionsConfig from "../../config/elections.config.js";
import ElectionsCandidateBoardsView from "./ElectionsCandidateBoards.jsx";
import {
  getResultsEmbargoCopy,
  useElectionResultsReleased,
  useElectionVotingMessagingLive,
} from "../../utils/electionVotingWindow.js";
import electionResultsStatic from "../../data/electionResults.json";
import "../Elections.scss";

function isBlank(value) {
  return String(value ?? "").trim() === "";
}

function parsePercentageValue(cell) {
  const s = String(cell ?? "")
    .trim()
    .replace(/%/g, "");
  if (!s || s === "—") return NaN;
  const n = parseFloat(s.replace(/,/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

/** Row index(es) with the highest percentage in a round (ties all get green). */
function rowIndicesWithMaxPercentage(rows, percentageKey = "Percentage") {
  let max = -Infinity;
  for (const row of rows) {
    const n = parsePercentageValue(row[percentageKey]);
    if (Number.isFinite(n) && n > max) max = n;
  }
  if (!Number.isFinite(max) || max < 0) return new Set();
  const indices = new Set();
  rows.forEach((row, i) => {
    const n = parsePercentageValue(row[percentageKey]);
    if (Number.isFinite(n) && n === max) indices.add(i);
  });
  return indices;
}

/** Turn `electionResults.json` into render-ready board → positions → rounds. */
function boardsFromStaticJson(data) {
  if (!data?.boards?.length) return [];
  return data.boards.map((b) => ({
    board: String(b.title ?? "").trim() || "Election results",
    positions: (b.positions ?? []).map((p) => ({
      title: String(p.title ?? "").trim() || "Position",
      rounds: (p.rounds ?? []).map((r) => {
        const columns = ["Candidate", "Votes", "Percentage", "Transfer (Elimination)"];
        const rows = (r.rows ?? []).map((row) => {
          const votes = row.votes === "" || row.votes == null ? "—" : String(row.votes);
          const pct = row.percentage === "" || row.percentage == null ? "—" : String(row.percentage);
          const xfer = row.transfer === "" || row.transfer == null ? "—" : String(row.transfer);
          return {
            Candidate: String(row.candidate ?? "").trim() || "—",
            Votes: votes,
            Percentage: pct,
            "Transfer (Elimination)": xfer,
            __winner: row.winner === true,
            __eliminated: row.eliminated === true,
          };
        });
        return {
          label: String(r.label ?? "").trim() || "Round One",
          columns,
          rows,
          totalVotes: r.totalVotes != null ? String(r.totalVotes) : "",
          totalPercentage: r.totalPercentage != null ? String(r.totalPercentage) : "",
        };
      }),
    })),
  }));
}

function ElectionResultsRoundTable({ round }) {
  const leadingIndices = rowIndicesWithMaxPercentage(round.rows);
  const usePercentLeader = leadingIndices.size > 0;

  return (
    <div className="election-results-round-block">
      <h4 className="election-results-round-label">{round.label}</h4>
      <div className="election-results-table-wrap">
        <table className="election-results-table">
          <thead>
            <tr>
              {round.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {round.rows.map((row, rowIndex) => {
              const isLeader = usePercentLeader
                ? leadingIndices.has(rowIndex)
                : row.__winner;
              const cls = [
                isLeader ? "election-results-row--winner" : "",
                row.__eliminated ? "election-results-row--eliminated" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <tr key={rowIndex} className={cls || undefined}>
                  {round.columns.map((column) => (
                    <td key={column}>
                      {isBlank(row[column]) ? "—" : String(row[column]).trim()}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {(round.totalVotes || round.totalPercentage) && (
        <p className="election-results-round-total">
          <strong>Total:</strong>{" "}
          {round.totalVotes ? <span>{round.totalVotes} votes</span> : null}
          {round.totalVotes && round.totalPercentage ? " · " : null}
          {round.totalPercentage ? <span>{round.totalPercentage}</span> : null}
        </p>
      )}
    </div>
  );
}

ElectionResultsRoundTable.propTypes = {
  round: PropTypes.shape({
    label: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.arrayOf(PropTypes.object),
    totalVotes: PropTypes.string,
    totalPercentage: PropTypes.string,
  }).isRequired,
};

/** One position: up to 3 rounds → show all; 4+ rounds → show round 1 until expanded. */
function ElectionPositionSection({ positionBlock, positionIndex }) {
  const rounds = positionBlock.rounds ?? [];
  const needsRoundExpand = rounds.length > 3;
  const [showAllRounds, setShowAllRounds] = useState(false);
  const visibleRounds =
    needsRoundExpand && !showAllRounds ? rounds.slice(0, 1) : rounds;
  const panelId = `election-rounds-panel-${positionBlock.title}-${positionIndex}`.replace(/\s+/g, "-");

  return (
    <section className="election-results-position">
      <h3 className="election-results-position-title">{positionBlock.title}</h3>
      {needsRoundExpand ? (
        <div className="election-results-rounds-toolbar">
          <p className="election-results-rounds-summary" id={`${panelId}-summary`}>
            {showAllRounds
              ? `All ${rounds.length} rounds are shown below.`
              : `Round 1 of ${rounds.length} is shown. Use the button to see every round.`}
          </p>
          <button
            type="button"
            className="election-results-rounds-button"
            onClick={() => setShowAllRounds((open) => !open)}
            aria-expanded={showAllRounds}
            aria-controls={panelId}
            aria-describedby={`${panelId}-summary`}
          >
            {showAllRounds ? "Show fewer rounds" : `Show all ${rounds.length} rounds`}
          </button>
        </div>
      ) : null}
      <div id={panelId} className="election-results-rounds-panel">
        {visibleRounds.map((round, roundIndex) => (
          <ElectionResultsRoundTable
            key={`${round.label}-${roundIndex}`}
            round={round}
          />
        ))}
      </div>
    </section>
  );
}

ElectionPositionSection.propTypes = {
  positionBlock: PropTypes.shape({
    title: PropTypes.string,
    rounds: PropTypes.array,
  }).isRequired,
  positionIndex: PropTypes.number.isRequired,
};

export default function ElectionResults({
  electionsEnabled = true,
  electionsConfig: config = electionsConfig,
}) {
  const state = config?.state ?? "results";
  const resultsReleased = useElectionResultsReleased(config);
  const messagingLive = useElectionVotingMessagingLive(config);
  const boardsModel = boardsFromStaticJson(electionResultsStatic);

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
              {config?.pollingBar?.message ?? "Results will be posted after voting ends."}
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

  if (state === "results" && !resultsReleased) {
    const embargo = getResultsEmbargoCopy(config);
    return (
      <ElectionsCandidateBoardsView
        config={config}
        messagingLive={messagingLive}
        resultsEmbargo={{ subtitle: embargo.subtitle, detail: embargo.detail }}
      />
    );
  }

  if (state !== "results") {
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

  return (
    <div className="elections-page">
      <header className="elections-hero">
        <h1 className="elections-hero-title">LSA Board</h1>
        <p className="elections-hero-subtitle">Election Results</p>
        <span className="elections-hero-badge">Results</span>
      </header>
      <section className="election-section">
        {!boardsModel.length ? (
          <div className="elections-message-box">
            <h2>Results not posted yet</h2>
            <p>Add data to <code>src/data/electionResults.json</code>.</p>
          </div>
        ) : (
          <div className="election-results-board-list">
            {boardsModel.map((boardBlock, boardIndex) => (
              <article key={`${boardBlock.board}-${boardIndex}`} className="election-results-board">
                <h2 className="election-results-board-title">{boardBlock.board}</h2>
                <div className="election-results-position-list">
                  {boardBlock.positions.map((positionBlock, positionIndex) => (
                    <ElectionPositionSection
                      key={`${positionBlock.title}-${positionIndex}`}
                      positionBlock={positionBlock}
                      positionIndex={positionIndex}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

ElectionResults.propTypes = {
  electionsEnabled: PropTypes.bool,
  electionsConfig: PropTypes.shape({
    state: PropTypes.oneOf(["pending", "polling", "results"]),
    notHappeningMessage: PropTypes.string,
    pendingTitle: PropTypes.string,
    pendingSubtitle: PropTypes.string,
    pollingBar: PropTypes.shape({
      message: PropTypes.string,
      resultsLabel: PropTypes.string,
      resultsPath: PropTypes.string,
      enabled: PropTypes.bool,
    }),
    resultsReleaseAt: PropTypes.string,
    resultsPendingTitle: PropTypes.string,
    resultsPendingSubtitle: PropTypes.string,
  }),
};

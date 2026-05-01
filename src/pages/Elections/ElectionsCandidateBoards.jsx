import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { formatElectionVotingOpensAt } from "../../utils/electionVotingWindow.js";
import "../Elections.scss";

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

/**
 * Candidate board grid (same as polling). Optional `resultsEmbargo` shows a quiet notice above the cards
 * (e.g. “Results go live soon” + optional detail line).
 */
export default function ElectionsCandidateBoardsView({
  config,
  messagingLive,
  resultsEmbargo = null,
}) {
  const contenders = config?.contenders ?? [];
  const livePollingTitle = String(config?.votingLivePollingTitle ?? "").trim();
  const livePollingSubtitle = String(config?.votingLivePollingSubtitle ?? "").trim();
  const pollingTitle =
    messagingLive && livePollingTitle
      ? livePollingTitle
      : (config?.pollingTitle ?? "Elections");
  const pollingSubtitle =
    messagingLive && livePollingSubtitle
      ? livePollingSubtitle
      : (config?.pollingSubtitle ?? "");
  const opensAtLabel =
    !messagingLive && String(config?.votingOpensAt ?? "").trim()
      ? formatElectionVotingOpensAt(config)
      : "";

  return (
    <div className="elections-page">
      <header className="elections-hero">
        <h1 className="elections-hero-title">LSA Board</h1>
        <p className="elections-hero-subtitle">Elections</p>
      </header>
      <section className="election-section">
        <div className="elections-state-header">
          <h1>{pollingTitle}</h1>
          {pollingSubtitle ? <p>{pollingSubtitle}</p> : null}
          {opensAtLabel ? (
            <p className="elections-voting-opens-hint">Voting opens {opensAtLabel}.</p>
          ) : null}
        </div>
        {resultsEmbargo ? (
          <div className="elections-results-embargo-note">
            <p className="elections-results-embargo-subtitle">{resultsEmbargo.subtitle}</p>
            {resultsEmbargo.detail ? (
              <p className="elections-results-embargo-detail">{resultsEmbargo.detail}</p>
            ) : null}
          </div>
        ) : null}
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
                if (!slug) {
                  return (
                    <div key={index} className="elections-board-card-cell">
                      {card}
                    </div>
                  );
                }
                return (
                  <Link key={index} to={`/Elections/${slug}`} className="elections-board-card-link">
                    {card}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

ElectionsCandidateBoardsView.propTypes = {
  config: PropTypes.object,
  messagingLive: PropTypes.bool,
  resultsEmbargo: PropTypes.shape({
    subtitle: PropTypes.string.isRequired,
    detail: PropTypes.string,
  }),
};

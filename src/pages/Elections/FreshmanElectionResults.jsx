import { useState } from "react";
import PropTypes from "prop-types";
import ElectionViewSelect from "./ElectionViewSelect.jsx";
import "./ElectionsBoard.scss";

function positionAnchor(position) {
  const slug = String(position ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `result-${slug || "office"}`;
}

function formatShare(share) {
  const pct = Number(share) * 100;
  if (!Number.isFinite(pct) || pct <= 0) return "0%";
  if (pct >= 99.95) return "100%";
  return `${pct.toFixed(1)}%`;
}

function formatTransfer(transfer) {
  const n = Number(transfer);
  if (!Number.isFinite(n) || n === 0) return "";
  if (n > 0) return `+${n}`;
  return String(n);
}

function roundSnapshot(candidate, round) {
  return (
    (candidate.rounds ?? []).find((entry) => entry.round === round) ?? {
      round,
      votes: 0,
      voteShare: 0,
      transfer: 0,
    }
  );
}

function roundTotals(position, round) {
  return (
    (position.rounds ?? []).find((entry) => entry.round === round) ?? {
      activeBallots: 0,
      exhaustedBallots: 0,
    }
  );
}

function eliminationRound(candidate) {
  const rounds = candidate.rounds ?? [];
  const eliminated = rounds.find(
    (entry) => entry.votes === 0 && entry.transfer < 0,
  );
  if (eliminated) return eliminated.round;
  const zero = rounds.find((entry) => entry.votes === 0);
  return zero ? zero.round : null;
}

function countLabel(count, singular, plural) {
  const n = Number(count) || 0;
  return `${n} ${n === 1 ? singular : plural}`;
}

function PositionResults({ position }) {
  const roundCount = Math.max(
    1,
    Number(position.roundCount) || position.rounds?.length || 1,
  );
  const [round, setRound] = useState(roundCount);
  const totals = roundTotals(position, round);
  const isFinal = round === roundCount;
  const sliderProgress =
    roundCount <= 1 ? 100 : ((round - 1) / (roundCount - 1)) * 100;

  const chartCandidates = [];
  const alreadyOut = [];

  for (const candidate of position.candidates ?? []) {
    const snapshot = roundSnapshot(candidate, round);
    const outRound = eliminationRound(candidate);
    const eliminatedNow = snapshot.votes === 0 && snapshot.transfer < 0;
    if (snapshot.votes === 0 && !eliminatedNow) {
      alreadyOut.push({
        name: candidate.name,
        outRound: outRound ?? round,
      });
      continue;
    }
    chartCandidates.push({ candidate, snapshot, eliminatedNow });
  }

  chartCandidates.sort((a, b) => {
    const voteDelta = b.snapshot.votes - a.snapshot.votes;
    if (voteDelta !== 0) return voteDelta;
    return String(a.candidate.name).localeCompare(String(b.candidate.name));
  });
  alreadyOut.sort((a, b) => {
    if (a.outRound !== b.outRound) return a.outRound - b.outRound;
    return String(a.name).localeCompare(String(b.name));
  });

  const anchor = positionAnchor(position.position);

  return (
    <section id={anchor} className="freshman-results__position">
      <header className="freshman-results__position-head">
        <h2>{position.position}</h2>
        <p>
          Winner <strong>{position.winner}</strong>
        </p>
      </header>

      <div className="freshman-results__rounds">
        <button
          type="button"
          className="freshman-results__round-btn"
          onClick={() => setRound((current) => Math.max(1, current - 1))}
          disabled={round <= 1}
        >
          Previous round
        </button>
        <label
          className="freshman-results__round-slider"
          style={{ "--slider-progress": `${sliderProgress}%` }}
        >
          <span>
            Round {round} of {roundCount}
          </span>
          <input
            type="range"
            min={1}
            max={roundCount}
            step={1}
            value={round}
            aria-valuemin={1}
            aria-valuemax={roundCount}
            aria-valuenow={round}
            aria-valuetext={`Round ${round} of ${roundCount}`}
            onChange={(event) => setRound(Number(event.target.value))}
          />
        </label>
        <button
          type="button"
          className="freshman-results__round-btn"
          onClick={() =>
            setRound((current) => Math.min(roundCount, current + 1))
          }
          disabled={round >= roundCount}
        >
          Next round
        </button>
      </div>

      <p className="freshman-results__ballots">
        {countLabel(totals.activeBallots, "active ballot", "active ballots")}
        <span aria-hidden="true"> · </span>
        {countLabel(
          totals.exhaustedBallots,
          "exhausted ballot",
          "exhausted ballots",
        )}
      </p>

      <ol className="freshman-results__bars">
        {chartCandidates.map(({ candidate, snapshot, eliminatedNow }) => {
          const share = Math.max(0, Math.min(1, Number(snapshot.voteShare) || 0));
          const transferLabel = formatTransfer(snapshot.transfer);
          const elected =
            isFinal && candidate.name === position.winner && snapshot.votes > 0;
          const rowClass = [
            "freshman-results__bar-row",
            elected ? "freshman-results__bar-row--elected" : "",
            eliminatedNow ? "freshman-results__bar-row--eliminated" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <li key={candidate.name} className={rowClass}>
              <div className="freshman-results__bar-copy">
                <span className="freshman-results__bar-name">
                  {candidate.name}
                  {elected ? (
                    <span className="freshman-results__elected">Elected</span>
                  ) : null}
                  {eliminatedNow ? (
                    <span className="freshman-results__out-label">
                      Eliminated
                    </span>
                  ) : null}
                </span>
                <span className="freshman-results__bar-stats">
                  <span>
                    {snapshot.votes} {snapshot.votes === 1 ? "vote" : "votes"}
                  </span>
                  <span>{formatShare(snapshot.voteShare)}</span>
                  {transferLabel ? (
                    <span
                      className={
                        snapshot.transfer > 0
                          ? "freshman-results__transfer freshman-results__transfer--gain"
                          : "freshman-results__transfer freshman-results__transfer--loss"
                      }
                    >
                      {transferLabel}
                    </span>
                  ) : null}
                </span>
              </div>
              <div className="freshman-results__track" aria-hidden="true">
                <div
                  className="freshman-results__fill"
                  style={{ width: `${share * 100}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>

      {alreadyOut.length > 0 ? (
        <div className="freshman-results__eliminated">
          <h3>Eliminated</h3>
          <ul>
            {alreadyOut.map((candidate) => (
              <li key={candidate.name}>
                {candidate.name}
                <span>Round {candidate.outRound}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

PositionResults.propTypes = {
  position: PropTypes.shape({
    position: PropTypes.string,
    winner: PropTypes.string,
    roundCount: PropTypes.number,
    rounds: PropTypes.array,
    candidates: PropTypes.array,
  }).isRequired,
};

export default function FreshmanElectionResults({ config, election }) {
  const positions = election?.positions ?? [];

  return (
    <section className="elections-dev freshman-results">
      <header className="freshman-results__hero">
        <p className="freshman-results__eyebrow">Ranked-choice results</p>
        <h1>{election?.election || "2030 Freshman Elections"}</h1>
        <p className="freshman-results__lede">
          Each office opens on the final round. Move through earlier rounds to
          see how votes transferred.
        </p>
        <ElectionViewSelect config={config} view="results" />
      </header>

      <div className="freshman-results__main">
        <nav className="freshman-results__roster" aria-label="Winners">
          <ol>
            {positions.map((position) => (
              <li key={position.position}>
                <a href={`#${positionAnchor(position.position)}`}>
                  <span className="freshman-results__office">
                    {position.position}
                  </span>
                  <span className="freshman-results__winner-name">
                    {position.winner}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {positions.map((position) => (
          <PositionResults key={position.position} position={position} />
        ))}
      </div>
    </section>
  );
}

FreshmanElectionResults.propTypes = {
  config: PropTypes.object,
  election: PropTypes.shape({
    election: PropTypes.string,
    positions: PropTypes.array,
  }),
};

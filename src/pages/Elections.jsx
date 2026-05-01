import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import electionsConfig from "../config/elections.config.js";
import ElectionResultsPage from "./Elections/ElectionResults.jsx";
import ElectionsCandidateBoardsView from "./Elections/ElectionsCandidateBoards.jsx";
import {
  useElectionVotingMessagingLive,
  getResultsEmbargoCopy,
  useElectionResultsReleased,
} from "../utils/electionVotingWindow.js";
import "./Elections.scss";

export default function Elections({
  electionsEnabled = true,
  electionsConfig: config = electionsConfig,
}) {
  const [searchParams] = useSearchParams();
  const wantsCandidatesView =
    searchParams.get("candidates") === "1" || searchParams.get("view") === "candidates";
  const messagingLive = useElectionVotingMessagingLive(config);
  const resultsReleased = useElectionResultsReleased(config);
  const state = config?.state ?? "results";

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

  if (state === "polling") {
    return <ElectionsCandidateBoardsView config={config} messagingLive={messagingLive} />;
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

  if (state === "results" && wantsCandidatesView) {
    return <ElectionsCandidateBoardsView config={config} messagingLive={messagingLive} />;
  }

  if (state === "results") {
    return (
      <ElectionResultsPage electionsEnabled={electionsEnabled} electionsConfig={config} />
    );
  }

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

Elections.propTypes = {
  electionsEnabled: PropTypes.bool,
  electionsConfig: PropTypes.shape({
    state: PropTypes.oneOf(["pending", "polling", "results"]),
    notHappeningMessage: PropTypes.string,
    pendingTitle: PropTypes.string,
    pendingSubtitle: PropTypes.string,
    pollingTitle: PropTypes.string,
    pollingSubtitle: PropTypes.string,
    votingLivePollingTitle: PropTypes.string,
    votingLivePollingSubtitle: PropTypes.string,
    votingFormUrl: PropTypes.string,
    votingOpensAt: PropTypes.string,
    voteButtonText: PropTypes.string,
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

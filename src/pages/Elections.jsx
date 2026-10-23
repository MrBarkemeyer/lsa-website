import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import electionsConfig from "../config/elections.config.js";
import ElectionResultsPage from "./Elections/ElectionResults.jsx";
import ElectionBoard from "./Elections/ElectionBoard.jsx";
import ElectionsBoardsHub from "./Elections/ElectionsBoardsHub.jsx";
import { areElectionBoardsPublic } from "../utils/electionAccess.js";
import {
  getResultsEmbargoCopy,
  useElectionResultsReleased,
} from "../utils/electionVotingWindow.js";
import "./Elections/ElectionsBoard.scss";

function onlyBoardSlug(config) {
  const listed = (config?.contenders ?? []).filter((b) => b?.slug);
  if (listed.length > 1) return null;
  if (listed.length === 1) return listed[0].slug;
  const enabled = config?.enabledElectionBoards;
  if (Array.isArray(enabled) && enabled.length === 1) {
    const slug = String(enabled[0] ?? "").trim();
    return slug || null;
  }
  return null;
}

function ElectionsCandidateView({
  config,
  resultsEmbargo = null,
  forceHub = false,
}) {
  const soloSlug = onlyBoardSlug(config);
  // /Elections/All always shows the boards hub, even in single-board mode
  if (!forceHub && soloSlug && areElectionBoardsPublic(config)) {
    return (
      <ElectionBoard
        electionsConfig={config}
        boardSlug={soloSlug}
        resultsEmbargo={resultsEmbargo}
      />
    );
  }
  return (
    <ElectionsBoardsHub config={config} resultsEmbargo={resultsEmbargo} />
  );
}

ElectionsCandidateView.propTypes = {
  config: PropTypes.object,
  forceHub: PropTypes.bool,
  resultsEmbargo: PropTypes.shape({
    subtitle: PropTypes.string.isRequired,
    detail: PropTypes.string,
  }),
};

export default function Elections({
  electionsEnabled = true,
  electionsConfig: config = electionsConfig,
  forceHub = false,
}) {
  const [searchParams] = useSearchParams();
  const wantsCandidatesView =
    searchParams.get("candidates") === "1" ||
    searchParams.get("view") === "candidates";
  const resultsReleased = useElectionResultsReleased(config);
  const state = config?.state ?? "results";

  if (!electionsEnabled) {
    return (
      <section className="elections-dev">
        <div className="elections-dev__hero">
          <h1>Elections</h1>
          <p className="elections-dev__tagline">
            {config?.notHappeningMessage ??
              "Elections are not currently happening. Check back later for updates."}
          </p>
        </div>
      </section>
    );
  }

  if (state === "pending") {
    return (
      <section className="elections-dev">
        <div className="elections-dev__hero">
          <h1>{config?.pendingTitle ?? "Elections are coming soon"}</h1>
          <p className="elections-dev__tagline">
            {config?.pendingSubtitle ?? "Please stay tuned for updates."}
          </p>
          {String(config?.pendingDate ?? "").trim() ? (
            <p className="elections-dev__hint">{config.pendingDate}</p>
          ) : null}
        </div>
      </section>
    );
  }

  if (state === "polling") {
    return <ElectionsCandidateView config={config} forceHub={forceHub} />;
  }

  if (state === "results" && !resultsReleased) {
    const embargo = getResultsEmbargoCopy(config);
    return (
      <ElectionsCandidateView
        config={config}
        forceHub={forceHub}
        resultsEmbargo={{
          subtitle: embargo.subtitle,
          detail: embargo.detail,
        }}
      />
    );
  }

  if (state === "results" && (forceHub || wantsCandidatesView)) {
    return <ElectionsCandidateView config={config} forceHub={forceHub} />;
  }

  if (state === "results") {
    return (
      <ElectionResultsPage
        electionsEnabled={electionsEnabled}
        electionsConfig={config}
      />
    );
  }

  return (
    <section className="elections-dev">
      <div className="elections-dev__hero">
        <h1>{config?.pendingTitle ?? "Elections are coming soon"}</h1>
        <p className="elections-dev__tagline">
          {config?.pendingSubtitle ?? "Please stay tuned for updates."}
        </p>
      </div>
    </section>
  );
}

Elections.propTypes = {
  electionsEnabled: PropTypes.bool,
  electionsConfig: PropTypes.object,
  forceHub: PropTypes.bool,
};

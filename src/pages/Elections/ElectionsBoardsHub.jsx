import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  useElectionVotingMessagingLive,
  formatElectionVotingOpensAt,
} from "../../utils/electionVotingWindow.js";
import { ELECTIONS_BASE } from "./electionsPaths.js";
import ElectionViewSelect from "./ElectionViewSelect.jsx";
import "./ElectionsBoard.scss";

let boardChunkPrefetch = null;

export function prefetchElectionBoard() {
  if (!boardChunkPrefetch) {
    boardChunkPrefetch = import("./ElectionBoard.jsx");
  }
  return boardChunkPrefetch;
}

function boardStats(group) {
  const roles = (group?.roles ?? [])
    .map((roleGroup) => String(roleGroup?.role ?? "").trim())
    .filter(Boolean);
  const candidateCount = (group?.roles ?? []).reduce(
    (sum, roleGroup) => sum + (roleGroup?.candidates?.length ?? 0),
    0,
  );
  return { roles, candidateCount, positionCount: roles.length };
}

export default function ElectionsBoardsHub({ config, resultsEmbargo = null }) {
  const messagingLive = useElectionVotingMessagingLive(config);
  const contenders = (config?.contenders ?? []).filter((b) => b?.slug);
  const livePollingTitle = String(config?.votingLivePollingTitle ?? "").trim();
  const livePollingSubtitle = String(
    config?.votingLivePollingSubtitle ?? "",
  ).trim();
  const pollingTitle =
    messagingLive && livePollingTitle
      ? livePollingTitle
      : (config?.pollingTitle ?? "Elections");
  const pollingSubtitle =
    messagingLive && livePollingSubtitle
      ? livePollingSubtitle
      : (config?.pollingSubtitle ??
        "Browse each board to meet the candidates.");
  const opensAtLabel =
    !messagingLive && String(config?.votingOpensAt ?? "").trim()
      ? formatElectionVotingOpensAt(config)
      : "";

  return (
    <section className="elections-dev elections-dev--hub">
      <div className="elections-dev__hero elections-dev__hero--hub">
        <p className="elections-dev__eyebrow">All boards</p>
        <h1>{pollingTitle}</h1>
        <p className="elections-dev__tagline">{pollingSubtitle}</p>
        {opensAtLabel ? (
          <p className="elections-dev__hint">Voting opens {opensAtLabel}.</p>
        ) : null}
        {resultsEmbargo ? (
          <p className="elections-dev__hint">
            {resultsEmbargo.subtitle}
            {resultsEmbargo.detail ? ` ${resultsEmbargo.detail}` : ""}
          </p>
        ) : null}
        <ElectionViewSelect config={config} view="candidates" />
      </div>

      <div className="elections-dev__hub-main">
        {contenders.length === 0 ? (
          <div className="elections-dev__empty">
            <h2 className="elections-dev__empty-title">
              Candidates coming soon
            </h2>
            <p className="elections-dev__empty-text">
              Candidate information will be posted here once available.
            </p>
          </div>
        ) : (
          <ol className="elections-dev-board-list">
            {contenders.map((group, index) => {
              const { roles, candidateCount, positionCount } =
                boardStats(group);
              const rolePreview = roles.slice(0, 4);
              const extraRoles = Math.max(0, roles.length - rolePreview.length);
              return (
                <li
                  key={group.slug}
                  className="elections-dev-board-list__item"
                  style={{ "--row-delay": `${Math.min(index, 11) * 50}ms` }}
                >
                  <Link
                    to={`${ELECTIONS_BASE}/${group.slug}`}
                    className="elections-dev-board-row"
                    style={{
                      "--card-accent": group.color || "var(--lowell-red)",
                    }}
                    onMouseEnter={prefetchElectionBoard}
                    onFocus={prefetchElectionBoard}
                  >
                    <span
                      className="elections-dev-board-row__rail"
                      aria-hidden="true"
                    />
                    <div className="elections-dev-board-row__body">
                      <div className="elections-dev-board-row__top">
                        <h2 className="elections-dev-board-row__title">
                          {group.board}
                        </h2>
                        <span className="elections-dev-board-row__cta">
                          Meet candidates
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="elections-dev-board-row__icon"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <p className="elections-dev-board-row__meta">
                        {candidateCount}{" "}
                        {candidateCount === 1 ? "candidate" : "candidates"}
                        <span aria-hidden="true"> · </span>
                        {positionCount}{" "}
                        {positionCount === 1 ? "position" : "positions"}
                      </p>
                      {rolePreview.length > 0 ? (
                        <p className="elections-dev-board-row__roles">
                          {rolePreview.join(" · ")}
                          {extraRoles > 0
                            ? ` · +${extraRoles} more`
                            : null}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}

ElectionsBoardsHub.propTypes = {
  config: PropTypes.object,
  resultsEmbargo: PropTypes.shape({
    subtitle: PropTypes.string.isRequired,
    detail: PropTypes.string,
  }),
};

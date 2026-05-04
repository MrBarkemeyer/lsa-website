/* eslint-disable react/prop-types */
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ElectionBanner from "../components/ElectionBanner";
import { useElectionResultsReleased } from "../utils/electionVotingWindow.js";

export default function Layout(props) {
  const clubData = props.clubData;
  const electionsEnabled = props.electionsEnabled ?? true;
  const electionsConfig = props.electionsConfig ?? null;
  const state = electionsConfig?.state;
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isHomePage = location.pathname === "/";
  const resultsReleased = useElectionResultsReleased(electionsConfig ?? {});
  const wantsElectionsCandidatesView =
    searchParams.get("candidates") === "1" || searchParams.get("view") === "candidates";
  const electionsMessageUnderHero =
    location.pathname === "/Elections/Results" ||
    (location.pathname === "/Elections" && !wantsElectionsCandidatesView);

  const showElectionBanner =
    electionsEnabled &&
    electionsConfig?.banner?.enabled &&
    state === "polling";
  const showElectionResultsBanner =
    electionsEnabled &&
    state === "results" &&
    resultsReleased &&
    electionsConfig?.pollingBar?.enabled &&
    !electionsMessageUnderHero;

  return (
    <>
      <Navbar clubData={clubData} electionsEnabled={electionsEnabled} electionsConfig={electionsConfig} />
      {(showElectionBanner || showElectionResultsBanner) && !isHomePage && (
        <ElectionBanner config={electionsConfig} />
      )}
      <Outlet />
      <Footer />
    </>
  );
}

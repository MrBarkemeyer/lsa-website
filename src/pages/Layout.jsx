/* eslint-disable react/prop-types */
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ElectionBanner from "../components/ElectionBanner";
import ElectionsBar from "../components/ElectionsBar";

export default function Layout(props) {
  const clubData = props.clubData;
  const electionsEnabled = props.electionsEnabled ?? true;
  const electionsConfig = props.electionsConfig ?? null;
  const state = electionsConfig?.state;
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const showElectionBanner =
    electionsEnabled &&
    electionsConfig?.banner?.enabled &&
    state === "polling";
  const showElectionsBar =
    electionsEnabled &&
    state === "results" &&
    electionsConfig?.pollingBar?.enabled;

  return (
    <>
      <Navbar clubData={clubData} electionsEnabled={electionsEnabled} electionsConfig={electionsConfig} />
      {showElectionBanner && !isHomePage && <ElectionBanner config={electionsConfig} />}
      {showElectionsBar && <ElectionsBar config={electionsConfig} />}
      <Outlet />
      <Footer />
    </>
  );
}

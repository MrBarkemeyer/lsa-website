import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import ClassBoard from "./ClassBoard";
import Committee from "./Committee";

/** Class boards share the same URL pattern as committees; route by team name. */
const CLASS_BOARD_NAMES = [
  "Senior Board",
  "Junior Board",
  "Sophomore Board",
  "Freshman Board",
];

export default function LsaTeamPage({ officerData }) {
  const { BoardName } = useParams();

  if (CLASS_BOARD_NAMES.includes(BoardName)) {
    return <ClassBoard officerData={officerData} />;
  }

  return <Committee officerData={officerData} />;
}

LsaTeamPage.propTypes = {
  officerData: PropTypes.arrayOf(PropTypes.object),
};

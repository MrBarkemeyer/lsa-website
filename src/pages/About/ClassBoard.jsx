import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import PropTypes from "prop-types";
import LoadingTruck from "../../components/LoadingTruck";
import SafeImage from "../../components/SafeImage";
import { driveThumbnailCandidates } from "../../utils/driveMedia.js";
import { getLsaCurrentBoardAccent } from "../../config/lsaCurrentBoardAccents.js";
import "./About.scss";

const CLASS_BOARD_ORDER = [
  "Senior Board",
  "Junior Board",
  "Sophomore Board",
  "Freshman Board",
];

export default function ClassBoard({ officerData: officerDataProp }) {
  const params = useParams().BoardName;

  const officerData = useMemo(() => {
    if (!officerDataProp || !params) {
      return [];
    }
    return officerDataProp.filter((officer) => officer.Team === params);
  }, [officerDataProp, params]);

  if (!officerDataProp || !params) {
    return <LoadingTruck />;
  }

  if (officerData.length === 0) {
    return <LoadingTruck />;
  }

  const currentIndex = CLASS_BOARD_ORDER.findIndex((board) => board === params);
  const prevBoard =
    currentIndex <= 0
      ? { name: "SBC", path: "/LSA/SBC" }
      : {
          name: CLASS_BOARD_ORDER[currentIndex - 1],
          path: `/LSA/${encodeURIComponent(CLASS_BOARD_ORDER[currentIndex - 1])}`,
        };
  const nextBoard =
    currentIndex >= 0 && currentIndex < CLASS_BOARD_ORDER.length - 1
      ? {
          name: CLASS_BOARD_ORDER[currentIndex + 1],
          path: `/LSA/${encodeURIComponent(CLASS_BOARD_ORDER[currentIndex + 1])}`,
        }
      : null;

  const boardAccent = getLsaCurrentBoardAccent(params);

  return (
    <div className="board-page" style={{ "--board-accent": boardAccent }}>
      <header className="board-hero board-hero--class">
        <h1 className="board-hero-title">LSA {params}</h1>
        <span className="board-hero-year">2025-2026</span>
      </header>

      <nav className="board-nav" aria-label="Board navigation">
        <Link to={prevBoard.path} className="board-nav__btn">
          &larr; Previous board
        </Link>
        <Link to="/LSA-EXPLORE" className="board-nav__btn">
          All boards
        </Link>
        {nextBoard ? (
          <Link to={nextBoard.path} className="board-nav__btn">
            Next board &rarr;
          </Link>
        ) : (
          <span className="board-nav__btn board-nav__btn--disabled">Next board &rarr;</span>
        )}
      </nav>

      <section className="board-officers">
        <h2 className="board-officers-heading">Meet the board</h2>
        <div className="board-officers-grid">
          {officerData.map((officer, index) => (
            <article key={index} className="board-officer-card">
              <div className="board-officer-card-photo-wrap">
                <SafeImage
                  src={driveThumbnailCandidates(officer.Photo, "w600")}
                  alt={officer.Name}
                  className="board-officer-card-photo"
                  variant="user"
                />
              </div>
              
              {/* same deal - bar that turns into full popup on hover */}
              <div className="board-officer-card-frame">
                <div className="board-officer-card-frame-header">
                  <span className="board-officer-card-role">{officer.Role}</span>
                  <h3 className="board-officer-card-name">{officer.Name}</h3>
                </div>
                {officer.Description && (
                  <div className="board-officer-card-frame-body">
                    <p className="board-officer-card-preview">{officer.Description}</p>
                    <p className="board-officer-card-description">{officer.Description}</p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <nav className="board-nav board-nav--bottom" aria-label="Board navigation bottom">
        <Link to={prevBoard.path} className="board-nav__btn">
          &larr; Previous board
        </Link>
        <Link to="/LSA-EXPLORE" className="board-nav__btn">
          All boards
        </Link>
        {nextBoard ? (
          <Link to={nextBoard.path} className="board-nav__btn">
            Next board &rarr;
          </Link>
        ) : (
          <span className="board-nav__btn board-nav__btn--disabled">Next board &rarr;</span>
        )}
      </nav>
    </div>
  );
}

ClassBoard.propTypes = {
  officerData: PropTypes.arrayOf(
    PropTypes.shape({
      Team: PropTypes.string.isRequired,
      Name: PropTypes.string.isRequired,
      Role: PropTypes.string.isRequired,
      Photo: PropTypes.string,
      Description: PropTypes.string,
    })
  ).isRequired,
};

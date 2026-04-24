import { useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import LoadingTruck from "../../components/LoadingTruck";
import SafeImage from "../../components/SafeImage";
import { driveThumbnailCandidates } from "../../utils/driveMedia.js";
import { getLsaCurrentBoardAccent } from "../../config/lsaCurrentBoardAccents.js";
import "./About.scss";

export default function SBC({ officerData: officerDataProp }) {
  const officerData = useMemo(() => {
    if (!officerDataProp) {
      return [];
    }
    return officerDataProp.filter((officer) => officer.Team === "SBC");
  }, [officerDataProp]);

  if (!officerDataProp) {
    return <LoadingTruck />;
  }

  const boardAccent = getLsaCurrentBoardAccent("SBC");

  return (
    <div className="board-page" style={{ "--board-accent": boardAccent }}>
      <header className="board-hero">
        <h1 className="board-hero-title">Student Body Council</h1>
        <p className="board-hero-subtitle">SBC</p>
        <span className="board-hero-year">2025-2026</span>
      </header>

      <div className="board-contact">
        <span className="board-contact-item">
          <strong>Location</strong> - The Cave (Room 80A), 1st block Leadership
        </span>
        <span className="board-contact-item">
          <strong>Email</strong> - lowellhssbc@gmail.com
        </span>
        <span className="board-contact-item">
          <strong>Instagram</strong> - @lowellhs
        </span>
        <span className="board-contact-item">
          <strong>Facebook</strong> - Lowell Student Association
        </span>
      </div>

      <nav className="board-nav" aria-label="Board navigation">
        <span className="board-nav__btn board-nav__btn--disabled">&larr; Previous board</span>
        <Link to="/LSA-EXPLORE" className="board-nav__btn">
          All boards
        </Link>
        <Link to="/LSA/Senior%20Board" className="board-nav__btn">
          Next board &rarr;
        </Link>
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
              
              {/* officer card: little bar by default, expands to full bio on hover */}
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
        <span className="board-nav__btn board-nav__btn--disabled">&larr; Previous board</span>
        <Link to="/LSA-EXPLORE" className="board-nav__btn">
          All boards
        </Link>
        <Link to="/LSA/Senior%20Board" className="board-nav__btn">
          Next board &rarr;
        </Link>
      </nav>
    </div>
  );
}

SBC.propTypes = {
  officerData: PropTypes.arrayOf(
    PropTypes.shape({
      Team: PropTypes.string.isRequired,
      Name: PropTypes.string.isRequired,
      Role: PropTypes.string.isRequired,
      Photo: PropTypes.string,
      Description: PropTypes.string,
    })
  ),
};

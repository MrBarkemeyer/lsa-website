import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import PropTypes from "prop-types";
import LoadingTruck from "../../components/LoadingTruck";
import SafeImage from "../../components/SafeImage";
import { driveThumbnailCandidates } from "../../utils/driveMedia.js";
import "./About.scss";

export default function Committee({ officerData: allOfficers }) {
  const { BoardName: committeeKey } = useParams();

  const officerData = useMemo(() => {
    if (!allOfficers || !committeeKey) {
      return [];
    }
    return allOfficers.filter((officer) => officer.Team === committeeKey);
  }, [allOfficers, committeeKey]);

  if (!allOfficers) {
    return <LoadingTruck />;
  }

  const committeeName = officerData[0]?.Team || committeeKey;

  if (!officerData.length) {
    return (
      <main className="committee-page">
        <header className="committee-page__hero">
          <h1 className="committee-page__title">{committeeKey}</h1>
          <p className="committee-page__subtitle">Committee</p>
        </header>
        <section className="committee-page__empty">
          <p>No officers are listed for this committee yet.</p>
          <Link to="/LSA/Commitees" className="committee-page__back">
            &larr; Back to committees
          </Link>
        </section>
      </main>
    );
  }

  const displayOfficers = officerData.map((officer, index) => (
    <article key={`${officer.Name}-${index}`} className="committee-member-card">
      <div className="committee-member-card__media">
        <SafeImage
          src={driveThumbnailCandidates(officer.Photo, "w600")}
          alt={officer.Name}
          className="committee-member-card__photo"
          variant="user"
        />
      </div>
      <div className="committee-member-card__body">
        <p className="committee-member-card__role">{officer.Role}</p>
        <h3 className="committee-member-card__name">{officer.Name}</h3>
        {officer.Description && (
          <p className="committee-member-card__description">{officer.Description}</p>
        )}
      </div>
    </article>
  ));

  return (
    <main className="committee-page">
      <header className="committee-page__hero">
        <h1 className="committee-page__title">{committeeName}</h1>
        <p className="committee-page__subtitle">Committee</p>
        <span className="committee-page__year">2025–2026</span>
      </header>

      <nav className="committee-page__nav" aria-label="Committee navigation">
        <Link to="/LSA/Commitees" className="committee-page__nav-link">
          &larr; All committees
        </Link>
        <Link to="/LSA-EXPLORE" className="committee-page__nav-link">
          Explore LSA
        </Link>
      </nav>

      <section className="committee-page__officers">
        <h2 className="committee-page__heading">Members</h2>
        <div className="committee-page__grid">{displayOfficers}</div>
      </section>
    </main>
  );
}

Committee.propTypes = {
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

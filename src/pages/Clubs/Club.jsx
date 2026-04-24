import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faCalendarDays, faUserGroup, faLink } from "@fortawesome/free-solid-svg-icons";
import LoadingTruck from "../../components/LoadingTruck";
import "../Clubs/Club.scss";

export default function Club({ clubData: clubDataProp }) {
  const params = useParams().ClubName;
  const [clubData, setClubData] = useState(null);

  useEffect(() => {
    if (clubDataProp && params) {
      const foundClub = clubDataProp.find(
        (club) => club.Name && club.Name.trim() === params
      );
      setClubData(foundClub || null);
    }
  }, [params, clubDataProp]);

  function removeLeadingAt(str) {
    if (typeof str === "string") {
      return str.replace(/^@/, "");
    }
    return "";
  }

  if (!clubData) {
    return <LoadingTruck />;
  }

  function extractFileId(driveUrl) {
    const match = driveUrl?.match(/[?&]id=([^&]+)/);
    return match ? match[1] : null;
  }

  const hasBanner = Boolean(clubData.Banner && extractFileId(clubData.Banner));
  const websiteUrl = clubData.Website || clubData.CustomWebsite;

  return (
    <div className="club-page">
      <header
        className={`club-hero ${hasBanner ? "club-hero--with-banner" : "club-hero--no-banner"}`}
      >
        {hasBanner && (
          <div className="club-hero__media">
            <iframe
              src={`https://drive.google.com/file/d/${extractFileId(clubData.Banner)}/preview?modestbranding=1&rel=0`}
              title={`${params} banner`}
              className="club-hero__banner"
            />
            <div className="club-hero__overlay" />
          </div>
        )}
        <div className="club-hero__content">
          <h1 className="club-hero__title">{params}</h1>
        </div>
      </header>

      <div className="club-content">
        {clubData.ClubDescription && (
          <section className="club-section club-about">
            <h2 className="club-section__heading">About</h2>
            <p className="club-about__text">{clubData.ClubDescription}</p>
          </section>
        )}

        <section className="club-section club-meetings">
          <h2 className="club-section__heading">
            <FontAwesomeIcon icon={faCalendarDays} className="club-section__icon" />
            Meetings
          </h2>
          <p className="club-meetings__text">
            We meet every <strong>{clubData.MeetingDays}</strong> {clubData.Weekly} at{" "}
            <strong>{clubData.MeetingPlaceTime}</strong>
          </p>
        </section>

        <section className="club-section club-leadership">
          <h2 className="club-section__heading">
            <FontAwesomeIcon icon={faUserGroup} className="club-section__icon" />
            Club Officers
          </h2>
          <div className="club-leadership__grid">
            <div className="club-leadership__item">
              <span className="club-leadership__role">President</span>
              <span className="club-leadership__name">{clubData.President}</span>
            </div>
            <div className="club-leadership__item">
              <span className="club-leadership__role">Vice President</span>
              <span className="club-leadership__name">{clubData.VP}</span>
            </div>
            {clubData.OtherOfficers && (
              <div className="club-leadership__item club-leadership__item--wide">
                <span className="club-leadership__role">Other Officers</span>
                <span className="club-leadership__name">{clubData.OtherOfficers}</span>
              </div>
            )}
          </div>
        </section>

        {(websiteUrl || clubData.Instagram) && (
          <section className="club-section club-connect">
            <h2 className="club-section__heading">
              <FontAwesomeIcon icon={faLink} className="club-section__icon" />
              Connect
            </h2>
            <div className="club-connect__links">
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  className="club-connect__btn club-connect__btn--primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit our website
                </a>
              )}
              {clubData.Instagram && (
                <a
                  href={`https://www.instagram.com/${removeLeadingAt(clubData.Instagram)}`}
                  className="club-connect__btn club-connect__btn--instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                  Instagram
                </a>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

Club.propTypes = {
  clubData: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string,
      Banner: PropTypes.string,
      ClubDescription: PropTypes.string,
      MeetingDays: PropTypes.string,
      Weekly: PropTypes.string,
      MeetingPlaceTime: PropTypes.string,
      President: PropTypes.string,
      VP: PropTypes.string,
      OtherOfficers: PropTypes.string,
      Instagram: PropTypes.string,
      Website: PropTypes.string,
      CustomWebsite: PropTypes.string,
    })
  ).isRequired,
};

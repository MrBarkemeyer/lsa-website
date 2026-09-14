import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faCalendarDays, faUserGroup, faLink } from "@fortawesome/free-solid-svg-icons";
import LoadingTruck from "../../components/LoadingTruck";
import SafeImage from "../../components/SafeImage";
import { getCategoryColorMap } from "../../config/clubs/index.js";
import { driveThumbnailCandidates } from "../../utils/driveMedia.js";
import "../Clubs/Club.scss";

function removeLeadingAt(value) {
  return typeof value === "string" ? value.replace(/^@/, "") : "";
}

function getImageAccent(image) {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return "";

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] < 128) continue;
    red += pixels[index];
    green += pixels[index + 1];
    blue += pixels[index + 2];
    count += 1;
  }

  if (!count) return "";
  const channels = [red / count, green / count, blue / count].map((value) => value / 255);
  const max = Math.max(...channels);
  const min = Math.min(...channels);
  const delta = max - min;
  if (delta < 0.04) return "hsl(220 8% 32%)";

  let hue;
  if (max === channels[0]) hue = ((channels[1] - channels[2]) / delta) % 6;
  else if (max === channels[1]) hue = (channels[2] - channels[0]) / delta + 2;
  else hue = (channels[0] - channels[1]) / delta + 4;

  const lightness = (max + min) / 2;
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  const restrainedSaturation = Math.min(62, Math.max(35, saturation * 100));
  return `hsl(${Math.round((hue * 60 + 360) % 360)} ${Math.round(restrainedSaturation)}% 32%)`;
}

export default function Club({ clubData: clubDataProp }) {
  const params = useParams().ClubName;
  const clubData = useMemo(
    () =>
      clubDataProp && params
        ? clubDataProp.find(
        (club) => club.Name && club.Name.trim() === params
          ) || null
        : null,
    [params, clubDataProp]
  );
  const colorMap = useMemo(() => getCategoryColorMap(), []);
  const bannerUrl = String(clubData?.Banner || "").trim();
  const bannerCandidates = driveThumbnailCandidates(bannerUrl, "w1600");
  const fallbackAccent = colorMap[clubData?.Category] || "#861212";
  const [sampledAccent, setSampledAccent] = useState({ banner: "", color: "" });
  const accent =
    sampledAccent.banner === bannerUrl && sampledAccent.color
      ? sampledAccent.color
      : fallbackAccent;

  if (!clubData) {
    return <LoadingTruck />;
  }

  const hasBanner = bannerCandidates.length > 0;
  const websiteUrl = clubData.Website || clubData.CustomWebsite;
  const hasMeetingInfo = Boolean(
    clubData.MeetingDays || clubData.Weekly || clubData.MeetingPlaceTime
  );
  const hasLeadership = Boolean(
    clubData.President || clubData.VP || clubData.OtherOfficers
  );
  const hasMainContent = Boolean(clubData.ClubDescription || hasLeadership);
  const hasAsideContent = Boolean(
    hasMeetingInfo || websiteUrl || clubData.Instagram
  );

  function sampleBanner(event) {
    const source = event.currentTarget.currentSrc || event.currentTarget.src;
    if (!source || source.startsWith("data:")) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const color = getImageAccent(image);
        if (color) setSampledAccent({ banner: bannerUrl, color });
      } catch {
        // The category accent remains in use when the image host blocks canvas access.
      }
    };
    image.src = source;
  }

  return (
    <main className="club-page" style={{ "--club-accent": accent }}>
      <header
        className={`club-hero ${hasBanner ? "club-hero--with-banner" : "club-hero--no-banner"}`}
      >
        {hasBanner && (
          <div className="club-hero__media">
            <SafeImage
              src={bannerCandidates}
              alt={`${params} banner`}
              className="club-hero__banner"
              variant="club"
              decoding="async"
              fetchPriority="high"
              onLoad={sampleBanner}
            />
            <div className="club-hero__overlay" />
          </div>
        )}
        <div className="club-hero__content">
          {clubData.Category && (
            <p className="club-hero__category">{clubData.Category}</p>
          )}
          <h1 className="club-hero__title">{params}</h1>
        </div>
      </header>

      <div
        className={`club-content ${
          hasMainContent && hasAsideContent ? "" : "club-content--single"
        }`}
      >
        {hasMainContent && (
          <div className="club-content__main">
            {clubData.ClubDescription && (
              <section className="club-section club-about">
                <h2 className="club-section__heading">About</h2>
                <p className="club-about__text">{clubData.ClubDescription}</p>
              </section>
            )}

            {hasLeadership && (
              <section className="club-section club-leadership">
                <h2 className="club-section__heading">
                  <FontAwesomeIcon icon={faUserGroup} className="club-section__icon" />
                  Club Officers
                </h2>
                <div className="club-leadership__grid">
                  {clubData.President && (
                    <div className="club-leadership__item">
                      <span className="club-leadership__role">President</span>
                      <span className="club-leadership__name">{clubData.President}</span>
                    </div>
                  )}
                  {clubData.VP && (
                    <div className="club-leadership__item">
                      <span className="club-leadership__role">Vice President</span>
                      <span className="club-leadership__name">{clubData.VP}</span>
                    </div>
                  )}
                  {clubData.OtherOfficers && (
                    <div className="club-leadership__item club-leadership__item--wide">
                      <span className="club-leadership__role">Other Officers</span>
                      <span className="club-leadership__name">{clubData.OtherOfficers}</span>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {hasAsideContent && (
          <aside className="club-content__aside" aria-label={`${params} details`}>
            {hasMeetingInfo && (
              <section className="club-section club-meetings">
                <h2 className="club-section__heading">
                  <FontAwesomeIcon icon={faCalendarDays} className="club-section__icon" />
                  Meetings
                </h2>
                <p className="club-meetings__text">
                  We meet{" "}
                  {clubData.MeetingDays && (
                    <>
                      every <strong>{clubData.MeetingDays}</strong>{" "}
                    </>
                  )}
                  {clubData.Weekly}
                  {clubData.MeetingPlaceTime && (
                    <>
                      {" "}at <strong>{clubData.MeetingPlaceTime}</strong>
                    </>
                  )}
                </p>
              </section>
            )}

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
                      aria-label={`Visit ${params} website (opens in a new tab)`}
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
                      aria-label={`Visit ${params} on Instagram (opens in a new tab)`}
                    >
                      <FontAwesomeIcon icon={faInstagram} />
                      Instagram
                    </a>
                  )}
                </div>
              </section>
            )}
          </aside>
        )}
      </div>
    </main>
  );
}

Club.propTypes = {
  clubData: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string,
      Category: PropTypes.string,
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

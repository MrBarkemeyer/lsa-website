import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowLeft,
  faCalendarDays,
  faLocationDot,
  faClock,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import LoadingTruck from "../../components/LoadingTruck";
import SafeImage from "../../components/SafeImage";
import { getCategoryColorMap } from "../../config/clubs/index.js";
import { driveThumbnailCandidates } from "../../utils/driveMedia.js";
import { splitPeople } from "../../utils/splitPeople.js";
import "../Clubs/Club.scss";

function removeLeadingAt(value) {
  return typeof value === "string" ? value.replace(/^@/, "") : "";
}

function getClubFrequency(club) {
  return String(club?.["Bi Weekly or Weekly?"] || club?.Weekly || "").trim();
}

function meetingCadenceLabel(frequency) {
  const value = frequency
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (value === "weekly") return "Every week";
  if (value === "biweekly" || value === "bi weekly") return "Biweekly";
  return frequency || "";
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
  const channels = [red / count, green / count, blue / count].map(
    (value) => value / 255,
  );
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
            (club) => club.Name && club.Name.trim() === params,
          ) || null
        : null,
    [params, clubDataProp],
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
  const meetingFrequency = getClubFrequency(clubData);
  const meetingCadence = meetingCadenceLabel(meetingFrequency);
  const meetingDays = String(clubData.MeetingDays || "").trim();
  const showMeetingDays = Boolean(
    meetingDays && meetingDays.toLowerCase() !== "always",
  );
  const meetingPlace = String(clubData.MeetingPlaceTime || "").trim();
  const hasMeetingInfo = Boolean(
    meetingCadence || showMeetingDays || meetingPlace,
  );
  const clubSponsorRaw = String(clubData["Club Sponsor"] || "").trim();
  const otherOfficersRaw = String(clubData.OtherOfficers || "").trim();
  const sponsors = splitPeople(clubSponsorRaw, "Club Sponsor");
  const otherOfficers = splitPeople(otherOfficersRaw, "Officer");
  const hasLeadership = Boolean(
    clubData.President || clubData.VP || otherOfficersRaw,
  );
  const hasConnect = Boolean(websiteUrl || clubData.Instagram);
  const hasMainContent = Boolean(clubData.ClubDescription || hasLeadership);
  const hasAsideContent = Boolean(hasConnect || clubSponsorRaw);
  const backHref = clubData.Category
    ? `/Clubs?category=${encodeURIComponent(clubData.Category)}`
    : "/Clubs";

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

  const officerRows = [];
  if (clubData.President) {
    officerRows.push({ role: "President", name: clubData.President });
  }
  if (clubData.VP) {
    officerRows.push({ role: "Vice President", name: clubData.VP });
  }
  if (otherOfficers.length > 0) {
    otherOfficers.forEach((person) => officerRows.push(person));
  } else if (otherOfficersRaw) {
    officerRows.push({ role: "Other Officers", name: otherOfficersRaw });
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
              alt=""
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
          <Link to={backHref} className="club-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            All clubs
          </Link>
          {clubData.Category && (
            <p className="club-hero__category">{clubData.Category}</p>
          )}
          <h1 className="club-hero__title">{params}</h1>
        </div>
      </header>

      {hasMeetingInfo && (
        <div className="club-glance" aria-label="Meeting information">
          <div className="club-glance__inner">
            {meetingCadence && (
              <div className="club-glance__item">
                <FontAwesomeIcon
                  icon={faClock}
                  className="club-glance__icon"
                  aria-hidden="true"
                />
                <div>
                  <span className="club-glance__label">Cadence</span>
                  <span className="club-glance__value">{meetingCadence}</span>
                </div>
              </div>
            )}
            {showMeetingDays && (
              <div className="club-glance__item">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className="club-glance__icon"
                  aria-hidden="true"
                />
                <div>
                  <span className="club-glance__label">When</span>
                  <span className="club-glance__value">{meetingDays}</span>
                </div>
              </div>
            )}
            {meetingPlace && (
              <div className="club-glance__item">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="club-glance__icon"
                  aria-hidden="true"
                />
                <div>
                  <span className="club-glance__label">Where</span>
                  <span className="club-glance__value">{meetingPlace}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {(hasMainContent || hasAsideContent) && (
        <div
          className={`club-content ${hasAsideContent ? "" : "club-content--single"}`}
        >
          {hasMainContent && (
            <div className="club-content__main">
              {clubData.ClubDescription && (
                <section className="club-block club-about">
                  <h2 className="club-block__heading">About</h2>
                  <p className="club-about__text">{clubData.ClubDescription}</p>
                </section>
              )}

              {hasLeadership && (
                <section className="club-block club-leadership">
                  <h2 className="club-block__heading">Club officers</h2>
                  <ul className="club-leadership__list">
                    {officerRows.map((person) => (
                      <li
                        key={`officer-${person.role}-${person.name}`}
                        className="club-leadership__row"
                      >
                        <span className="club-leadership__role">
                          {person.role}
                        </span>
                        <span className="club-leadership__name">
                          {person.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {hasAsideContent && (
            <aside
              className="club-content__aside"
              aria-label={`${params} details`}
            >
              {hasConnect && (
                <section className="club-block club-connect">
                  <h2 className="club-block__heading">Get involved</h2>
                  <div className="club-connect__links">
                    {websiteUrl && (
                      <a
                        href={websiteUrl}
                        className="club-connect__btn club-connect__btn--primary"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${params} website (opens in a new tab)`}
                      >
                        <FontAwesomeIcon icon={faGlobe} aria-hidden="true" />
                        Website
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
                        <FontAwesomeIcon
                          icon={faInstagram}
                          aria-hidden="true"
                        />
                        @{removeLeadingAt(clubData.Instagram)}
                      </a>
                    )}
                  </div>
                </section>
              )}

              {clubSponsorRaw && (
                <section className="club-block club-sponsor">
                  <h2 className="club-block__heading">Club sponsor</h2>
                  {sponsors.length > 0 ? (
                    <ul className="club-sponsor__list">
                      {sponsors.map((person) => (
                        <li key={`sponsor-${person.name}`}>{person.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="club-sponsor__name">{clubSponsorRaw}</p>
                  )}
                </section>
              )}
            </aside>
          )}
        </div>
      )}
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
      "Bi Weekly or Weekly?": PropTypes.string,
      MeetingPlaceTime: PropTypes.string,
      President: PropTypes.string,
      VP: PropTypes.string,
      "Club Sponsor": PropTypes.string,
      OtherOfficers: PropTypes.string,
      Instagram: PropTypes.string,
      Website: PropTypes.string,
      CustomWebsite: PropTypes.string,
    }),
  ).isRequired,
};

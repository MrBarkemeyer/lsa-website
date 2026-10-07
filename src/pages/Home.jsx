import { useMemo, useRef, useEffect } from "react";
import Counter from "../components/Counter";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Events from "./More/Events";
import { site } from "../config/site.config.js";
import { getSpotlightClubForDay } from "../utils/clubSpotlight.js";
import ElectionBanner from "../components/ElectionBanner";
import { useElectionResultsReleased } from "../utils/electionVotingWindow.js";
import CardinalympicLogo from "../components/CardinalympicLogo";
import PropTypes from "prop-types";
import SafeImage from "../components/SafeImage";
import { driveThumbnailCandidates } from "../utils/driveMedia.js";
import { cardinalympicsLeaderBadgeLabel } from "../utils/cardinalympicsDisplayMode.js";
import { isCardinalympicsSignupPastEventDay } from "../utils/cardinalympicsEventsFromSheet.js";

const CARDINALYMPICS_CLASS_NAMES = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
];
const CARDINALYMPICS_CLASS_SLUGS = [
  "freshman",
  "sophomore",
  "junior",
  "senior",
];
const CARDINALYMPICS_COUNTER_COLORS = [
  "#2e7d32",
  "#6a1b9a",
  "#1565c0",
  "#9c1919",
];
const EMPTY_ARRAY = [];

/** Same Student Life film as the homepage YouTube embed — served by YouTube, not Netlify. */
const HERO_YOUTUBE_ID = "5TKdIrdcyJ4";

function buildHeroYouTubeSrc() {
  const origin =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.origin)
      : "";
  return [
    `https://www.youtube-nocookie.com/embed/${HERO_YOUTUBE_ID}`,
    "?autoplay=1",
    "&mute=1",
    "&controls=0",
    "&disablekb=1",
    "&fs=0",
    "&modestbranding=1",
    "&iv_load_policy=3",
    "&cc_load_policy=0",
    "&playsinline=1",
    "&rel=0",
    "&loop=1",
    `&playlist=${HERO_YOUTUBE_ID}`,
    "&showinfo=0",
    "&autohide=1",
    "&enablejsapi=1",
    origin ? `&origin=${origin}` : "",
  ].join("");
}

function postYouTubeCommand(iframe, func, args = []) {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func, args }),
    "*",
  );
}

function getDayIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor((now - start) / oneDay);
}

/** Decorative hero background via YouTube so ~95MB MP4 is not billed as Netlify bandwidth. */
function HeroBackgroundVideo({ title, className }) {
  const iframeRef = useRef(null);
  const src = useMemo(() => buildHeroYouTubeSrc(), []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return undefined;

    const killCaptions = () => {
      postYouTubeCommand(iframe, "mute");
      postYouTubeCommand(iframe, "playVideo");
      postYouTubeCommand(iframe, "unloadModule", ["captions"]);
      postYouTubeCommand(iframe, "setOption", ["captions", "track", {}]);
    };

    iframe.addEventListener("load", killCaptions);
    const t1 = window.setTimeout(killCaptions, 800);
    const t2 = window.setTimeout(killCaptions, 2000);

    return () => {
      iframe.removeEventListener("load", killCaptions);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <>
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className={className}
        allow="autoplay; encrypted-media; picture-in-picture"
        loading="eager"
        tabIndex={-1}
        referrerPolicy="strict-origin-when-cross-origin"
      />
      {/* Blocks hover/focus so YouTube cannot show play/skip chrome */}
      <div className="hero-video-shield" aria-hidden="true" />
    </>
  );
}

HeroBackgroundVideo.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default function Home({
  cardinalympicsData,
  cardinalympicsEvents = EMPTY_ARRAY,
  clubData = EMPTY_ARRAY,
  showCardinalympicsScores = true,
  showCardinalympicsSignupNow = false,
  cardinalympicsDisplayMode = "activeGame",
  electionsConfig = site.elections,
}) {
  const spotlightClub = useMemo(
    () => getSpotlightClubForDay(clubData, getDayIndex()),
    [clubData],
  );

  const resultsReleased = useElectionResultsReleased(electionsConfig);
  const showElectionBanner =
    site.electionsEnabled &&
    electionsConfig?.banner?.enabled &&
    (electionsConfig?.state === "polling" ||
      electionsConfig?.state === "pending");
  const showElectionResultsBanner =
    site.electionsEnabled &&
    electionsConfig?.state === "results" &&
    resultsReleased &&
    electionsConfig?.pollingBar?.enabled;

  const spotlightDisplayName = spotlightClub ? spotlightClub.Name : "";
  const spotlightDisplayBlurb = spotlightClub
    ? String(spotlightClub.ClubDescription || "").trim()
    : "";
  const spotlightHref = spotlightClub
    ? `/Clubs/${encodeURIComponent(spotlightClub.Name)}`
    : "/Clubs";
  const spotlightCtaText = spotlightClub ? "Learn more →" : "Browse clubs →";
  const spotlightInitial = spotlightDisplayName.trim()
    ? spotlightDisplayName.trim().charAt(0).toUpperCase()
    : "";

  const cardinalympicsScores = useMemo(
    () =>
      [0, 1, 2, 3].map((index) => {
        const score = Number(cardinalympicsData?.[index]);
        return Number.isFinite(score) ? score : 0;
      }),
    [cardinalympicsData],
  );
  const cardinalympicsLeaderIndex =
    cardinalympicsScores.length === 4
      ? cardinalympicsScores.indexOf(Math.max(...cardinalympicsScores))
      : -1;
  const cardinalympicsTopClassBadge = cardinalympicsLeaderBadgeLabel(
    cardinalympicsDisplayMode,
  );
  const homeSignupEvents = useMemo(
    () =>
      cardinalympicsEvents
        .filter(
          (event) =>
            event?.signUpLink &&
            !event.signUpClosed &&
            !isCardinalympicsSignupPastEventDay(event),
        )
        .slice(0, 6),
    [cardinalympicsEvents],
  );
  const signupEventNamesTicker = useMemo(() => {
    const names = homeSignupEvents.reduce((result, event) => {
      const heading = String(event?.heading || "").trim();
      if (heading) result.push(heading);
      return result;
    }, []);
    if (!names.length) return "";
    return `${names.join("  •  ")}  •  ${names.join("  •  ")}`;
  }, [homeSignupEvents]);

  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="hero-video-wrapper">
          <HeroBackgroundVideo title="LSA Hero" className="hero-video" />
          <div className="video-credit">Video by Video Lowell</div>
        </div>
        <div className="home-hero-card">
          <p className="home-hero-card__eyebrow">Lowell High School</p>
          <h1 id="home-hero-title" className="home-hero-card__title">
            Lowell Student Association
          </h1>
          <p className="home-hero-card__lede">
            Student government for every class — leadership, events, and voice
            for the Lowell community.
          </p>
          <Link to="/LSA" className="home-hero-card__cta">
            About LSA
            <FontAwesomeIcon
              icon={faArrowRight}
              className="home-hero-card__cta-icon"
              aria-hidden
            />
          </Link>
        </div>
        <a
          href="#welcome-lsa"
          className="scroll-icon"
          aria-label="Continue to welcome section"
        >
          <FontAwesomeIcon icon={faAnglesDown} aria-hidden />
        </a>
      </section>
      {(showElectionBanner || showElectionResultsBanner) && (
        <ElectionBanner config={electionsConfig} />
      )}
      {showCardinalympicsSignupNow && homeSignupEvents.length > 0 && (
        <section
          className="home-cardinalympics-signup"
          aria-labelledby="home-cardinalympics-signup-heading"
        >
          <div className="home-cardinalympics-signup__inner">
            <div
              className="home-cardinalympics-signup__rings"
              aria-hidden="true"
            >
              <CardinalympicLogo variant="homeBackdrop" />
            </div>
            <div className="home-cardinalympics-signup__content">
              <h2 id="home-cardinalympics-signup-heading">
                Cardinalympics events sign up now
              </h2>
              {signupEventNamesTicker ? (
                <div
                  className="home-cardinalympics-signup__ticker-wrap"
                  aria-hidden="true"
                >
                  <div className="home-cardinalympics-signup__ticker-track">
                    <p className="home-cardinalympics-signup__ticker">
                      {signupEventNamesTicker}
                    </p>
                  </div>
                </div>
              ) : null}
              <p className="home-cardinalympics-signup__subtitle">
                Spots are limited for many events. Check openings and sign up
                before they close.
              </p>
              <Link
                to="/Cardinalympics"
                className="home-cardinalympics-signup__button"
              >
                View events
              </Link>
            </div>
          </div>
        </section>
      )}

      <section
        className="lsa-description"
        id="welcome-lsa"
        aria-labelledby="welcome-lsa-title"
      >
        <div className="home-section-heading">
          <p className="home-section-heading__eyebrow">Who we are</p>
          <h2 id="welcome-lsa-title">
            Welcome to the Lowell Student Association!
          </h2>
          <p>
            LSA is the umbrella term for Lowell&apos;s student government or all
            the boards, which includes the Student Body Council, and class
            boards representing the Senior, Junior, Sophomore, and Freshmen
            classes.
          </p>
        </div>
        <div className="home-stats">
          <h3>We connect with</h3>
          <div className="stats" aria-label="We connect with statistics">
            <div className="stat-card center">
              <div className="stat-card__value">
                <Counter
                  start={0}
                  end={2500}
                  duration={2000}
                  className="counter"
                  color="var(--lowell-red)"
                />
                <span className="stat-card__plus">+</span>
              </div>
              <p className="stat-card__label">Students</p>
            </div>
            <div className="stat-card center">
              <div className="stat-card__value">
                <Counter
                  start={0}
                  end={150}
                  duration={2000}
                  className="counter"
                  color="var(--lowell-red)"
                />
                <span className="stat-card__plus">+</span>
              </div>
              <p className="stat-card__label">Clubs</p>
            </div>
            <div className="stat-card center">
              <div className="stat-card__value">
                <Counter
                  start={0}
                  end={9000}
                  duration={2000}
                  className="counter"
                  color="var(--lowell-red)"
                />
                <span className="stat-card__plus">+</span>
              </div>
              <p className="stat-card__label">Alumni</p>
            </div>
          </div>
        </div>
      </section>
      <section className="home-updates" aria-label="Latest from Lowell">
        <div className="home-updates__news">
          <Events preview />
        </div>
        {spotlightClub && (
          <aside
            className="club-spotlight-section"
            aria-labelledby="club-spotlight-heading"
          >
            <div className="club-spotlight-section__head">
              <p className="home-section-heading__eyebrow">Today at Lowell</p>
              <h2 id="club-spotlight-heading">Club spotlight</h2>
            </div>
            <div className="club-spotlight">
              <div className="club-spotlight__media">
                {spotlightClub?.Picture ? (
                  <SafeImage
                    src={driveThumbnailCandidates(
                      spotlightClub.Picture,
                      "w300",
                    )}
                    alt={spotlightDisplayName}
                    className="club-spotlight__img"
                    variant="club"
                  />
                ) : (
                  <div
                    className="club-spotlight__placeholder"
                    aria-hidden="true"
                  >
                    {spotlightInitial}
                  </div>
                )}
              </div>
              <div className="club-spotlight__content">
                <h3 className="club-spotlight__title">
                  {spotlightDisplayName}
                </h3>
                {spotlightDisplayBlurb ? (
                  <p className="club-spotlight__excerpt">
                    {spotlightDisplayBlurb}
                  </p>
                ) : null}
                <Link to={spotlightHref} className="club-spotlight-link">
                  {spotlightCtaText}
                </Link>
              </div>
            </div>
          </aside>
        )}
      </section>
      {showCardinalympicsScores && (
        <section
          className="home-cardinalympics"
          aria-labelledby="home-cardinalympics-heading"
        >
          <div className="home-cardinalympics__inner">
            <div className="home-cardinalympics__content-wrap">
              <div className="home-cardinalympics__head-wrap">
                <div className="home-cardinalympics__intro">
                  <div className="home-cardinalympics__title-line">
                    <h2
                      id="home-cardinalympics-heading"
                      className="home-cardinalympics__title"
                    >
                      Cardinalympics
                    </h2>
                    <span
                      className="home-cardinalympics__live"
                      role="status"
                      aria-label="Scores from the live scoreboard"
                    >
                      <span
                        className="home-cardinalympics__live-dot"
                        aria-hidden="true"
                      />
                      Live
                    </span>
                  </div>
                  <p className="home-cardinalympics__subtitle">
                    Spirit Week class totals!
                  </p>
                </div>
              </div>
              <div className="home-cardinalympics__scores-wrap">
                <div
                  className="home-cardinalympics__rings-bg"
                  aria-hidden="true"
                >
                  <CardinalympicLogo variant="homeBackdrop" />
                </div>
                <div className="home-cardinalympics__grid" role="list">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={CARDINALYMPICS_CLASS_SLUGS[i]}
                      className={`home-cardinalympics__class home-cardinalympics__class--${CARDINALYMPICS_CLASS_SLUGS[i]}${
                        cardinalympicsLeaderIndex === i
                          ? " home-cardinalympics__class--leader"
                          : ""
                      }`}
                      role="listitem"
                    >
                      {cardinalympicsLeaderIndex === i && (
                        <span className="home-cardinalympics__leader-badge">
                          {cardinalympicsTopClassBadge}
                        </span>
                      )}
                      <span className="home-cardinalympics__class-name">
                        {CARDINALYMPICS_CLASS_NAMES[i]}
                      </span>
                      <div className="home-cardinalympics__points">
                        <Counter
                          start={0}
                          end={cardinalympicsScores[i]}
                          duration={2000}
                          className="home-cardinalympics__counter"
                          color={CARDINALYMPICS_COUNTER_COLORS[i]}
                        />
                        <span className="home-cardinalympics__pts-label">
                          pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/Cardinalympics" className="home-cardinalympics__link">
                Full scoreboard &amp; events &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      <section
        className="life-at-lowell"
        aria-labelledby="life-at-lowell-heading"
      >
        <div className="life-at-lowell__heading">
          <p className="home-section-heading__eyebrow">Campus life</p>
          <h2 id="life-at-lowell-heading">
            WATCH: Student Life at Lowell High School
          </h2>
        </div>
        <div className="responsive-video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/5TKdIrdcyJ4"
            title="Student Life at Lowell High School"
            className="responsive-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>
      <section className="preamble" aria-labelledby="charter-preamble-source">
        <blockquote>
          “We, the students of Lowell High School, in order to maintain the
          Lowell community, to acknowledge and foster the diversity of needs,
          views, and rights of students at Lowell to express opinions and
          interests to the community on relevant issues regarding student life,
          to promote the educational welfare, and to enhance all benefits
          offered by the school and the San Francisco Unified School District,
          do hereby establish and ordain this Charter of the Lowell High School
          Student Association.”
        </blockquote>
        <p id="charter-preamble-source" className="bold">
          PREAMBLE OF THE CHARTER OF THE LOWELL STUDENT ASSOCIATION
        </p>
      </section>
    </main>
  );
}

Home.propTypes = {
  cardinalympicsEvents: PropTypes.arrayOf(PropTypes.object),
  showCardinalympicsSignupNow: PropTypes.bool,
  showCardinalympicsScores: PropTypes.bool,
  cardinalympicsDisplayMode: PropTypes.string,
  cardinalympicsData: PropTypes.arrayOf(PropTypes.number),
  clubData: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string,
      Picture: PropTypes.string,
      ClubDescription: PropTypes.string,
    }),
  ),
  electionsConfig: PropTypes.object,
};

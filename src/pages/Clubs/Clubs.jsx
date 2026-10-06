import { Link, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { buildCategoryColorMap } from "../../config/clubs/index.js";
import SafeImage from "../../components/SafeImage";
import { driveThumbnailCandidates } from "../../utils/driveMedia.js";
import "./Club.scss";

function getClubFrequency(club) {
  return String(club?.["Bi Weekly or Weekly?"] || club?.Weekly || "").trim();
}

function clubMeetingTeaser(club) {
  const days = String(club.MeetingDays || "").trim();
  const place = String(club.MeetingPlaceTime || "").trim();
  const frequency = getClubFrequency(club).toLowerCase();
  const showDays = days && days.toLowerCase() !== "always";

  if (showDays && place) return `${days} · ${place}`;
  if (showDays) return days;
  if (place) return place;
  if (frequency === "weekly") return "Meets weekly";
  if (frequency.includes("bi")) return "Meets biweekly";
  return "";
}

function clubDescriptionTeaser(description) {
  const text = String(description || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  if (text.length <= 90) return text;
  return `${text.slice(0, 87).trim()}…`;
}

export default function Clubs({ clubData }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleClubs, setVisibleClubs] = useState(9);
  const categoryFilter = searchParams.get("category");
  const searchQuery = (searchParams.get("q") || "").toLowerCase();

  const uniqueCategories = useMemo(() => {
    const categories = clubData.map((club) => club.Category).filter(Boolean);
    return [...new Set(categories)];
  }, [clubData]);

  const colorMap = useMemo(
    () => buildCategoryColorMap(uniqueCategories),
    [uniqueCategories],
  );

  function loadMore() {
    setVisibleClubs((prev) => prev + 9);
  }

  function renderClub(club, index) {
    const { Name, Category, Picture, ClubDescription } = club;
    const clubColor = colorMap[Category] || "#5c616a";
    const meeting = clubMeetingTeaser(club);
    const excerpt = meeting || clubDescriptionTeaser(ClubDescription);

    return (
      <Link
        className="club-card"
        key={Name}
        to={Name}
        style={{
          "--club-color": clubColor,
          "--club-delay": `${Math.min(index, 11) * 40}ms`,
        }}
      >
        <div className="club-card__media">
          {Picture ? (
            <SafeImage
              className="club-card__image"
              src={driveThumbnailCandidates(Picture, "w400")}
              alt=""
              variant="club"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="club-card__placeholder" aria-hidden="true">
              <span className="club-card__placeholder-mark">
                {(Name || "?").charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="club-card__body">
          {Category && (
            <span className="club-card__category">{Category}</span>
          )}
          <h3 className="club-card__name">{Name}</h3>
          {excerpt && <p className="club-card__meta">{excerpt}</p>}
          <span className="club-card__cta" aria-hidden="true">
            View club
            <span className="club-card__cta-arrow">→</span>
          </span>
        </div>
      </Link>
    );
  }

  const filteredClubs = useMemo(() => {
    let result = clubData;

    if (categoryFilter) {
      result = result.filter((club) => club.Category === categoryFilter);
    }

    if (searchQuery) {
      const loweredQuery = searchQuery.toLowerCase();
      result = result.filter((club) => {
        const name = club.Name || "";
        const description = club.ClubDescription || "";
        return (
          name.toLowerCase().includes(loweredQuery) ||
          description.toLowerCase().includes(loweredQuery)
        );
      });
    }

    return result;
  }, [clubData, categoryFilter, searchQuery]);

  const visibleSlice = filteredClubs.slice(
    0,
    categoryFilter ? filteredClubs.length : visibleClubs,
  );
  const displayClubs = visibleSlice.map(renderClub);

  const filterButtons = uniqueCategories.map((category) => {
    const clubColor = colorMap[category];
    const isActive = categoryFilter === category;

    return (
      <button
        type="button"
        key={category}
        className={`clubs-page__filter-btn ${isActive ? "clubs-page__filter-btn--active" : ""}`}
        style={{ "--club-color": clubColor }}
        aria-pressed={isActive}
        onClick={() =>
          setSearchParams((prev) => {
            const current = Object.fromEntries(prev.entries());
            if (current.category === category) {
              delete current.category;
            } else {
              current.category = category;
            }
            return current;
          })
        }
      >
        {category}
      </button>
    );
  });

  return (
    <section className="clubs-page">
      <div className="clubs-page__hero">
        <h1>Clubs &amp; Sports</h1>
        <p className="clubs-page__tagline">
          Browse all registered clubs and sports at Lowell. Use filters or
          search to find a specific club.
        </p>
      </div>
      <div className="clubs-page__filters">
        <div className="clubs-page__filters-row">
          <div className="clubs-page__search">
            <label className="clubs-page__search-label" htmlFor="club-search">
              Search clubs
            </label>
            <input
              id="club-search"
              type="search"
              className="clubs-page__search-input"
              placeholder="Search by name or description..."
              value={searchParams.get("q") || ""}
              onChange={(event) => {
                const value = event.target.value;
                setVisibleClubs(9);
                setSearchParams((prev) => {
                  const current = Object.fromEntries(prev.entries());
                  if (value) {
                    current.q = value;
                  } else {
                    delete current.q;
                  }
                  return current;
                });
              }}
            />
          </div>
          <p className="clubs-page__filter-scroll-hint">
            Swipe or scroll sideways{" "}
            <span
              className="clubs-page__filter-scroll-hint-arrows"
              aria-hidden="true"
            >
              ← →
            </span>{" "}
            for all categories
          </p>
          <div
            className="clubs-page__filter-list"
            role="group"
            aria-label="Filter clubs by category"
          >
            {filterButtons}
            {(categoryFilter || searchQuery) && (
              <button
                type="button"
                className="clubs-page__clear"
                onClick={() => {
                  setSearchParams({});
                  setVisibleClubs(9);
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="clubs-page__result-count" aria-live="polite">
        Showing {displayClubs.length} of {filteredClubs.length}{" "}
        {filteredClubs.length === 1 ? "club" : "clubs"}
      </p>
      <div className="clubs-page__grid">
        {filteredClubs.length === 0 ? (
          <div className="clubs-page__empty">
            <h2 className="clubs-page__empty-title">No clubs found</h2>
            <p className="clubs-page__empty-text">
              Try checking your spelling or adjusting the filters. If you are
              looking for a team or activity that is not a club, please also
              check the Organizations tab.
            </p>
          </div>
        ) : (
          displayClubs
        )}
      </div>
      {!categoryFilter &&
        filteredClubs.length > 0 &&
        visibleClubs < filteredClubs.length && (
          <div className="clubs-page__load-wrap">
            <button
              type="button"
              className="clubs-page__load"
              onClick={loadMore}
            >
              Load more clubs
            </button>
          </div>
        )}
    </section>
  );
}

Clubs.propTypes = {
  clubData: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Category: PropTypes.string.isRequired,
      Picture: PropTypes.string,
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
      Banner: PropTypes.string,
    }),
  ).isRequired,
};

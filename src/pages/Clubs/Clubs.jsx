import { Link, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { getCategoryColorMap } from "../../config/clubs/index.js";
import SafeImage from "../../components/SafeImage";
import { driveThumbnailCandidates } from "../../utils/driveMedia.js";

export default function Clubs({ clubData }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleClubs, setVisibleClubs] = useState(9);
  const categoryFilter = searchParams.get("category");
  const searchQuery = (searchParams.get("q") || "").toLowerCase();
  const colorMap = useMemo(() => getCategoryColorMap(), []);

  function loadMore() {
    setVisibleClubs((prev) => prev + 9);
  }

  function getCategoryColor(category, useBackground = true) {
    const color = colorMap[category] || "gray";
    return useBackground
      ? { color: "white", background: color }
      : { color: "white", backgroundColor: color };
  }

  function renderClub(club, index) {
    const { Name, Category, Picture } = club;
    const clubColor = getCategoryColor(Category);

    return (
      <Link className="club-card" key={index} to={Name}>
        <div className="club-card__image-wrap">
          {Picture ? (
            <SafeImage
              className="club-card__image"
              src={driveThumbnailCandidates(Picture, "w300")}
              alt={Name}
              variant="club"
            />
          ) : (
            <div className="club-card__placeholder" style={{ background: clubColor.background || "var(--lowell-red)" }} />
          )}
          <span className="club-card__category" style={clubColor}>
            {Category}
          </span>
        </div>
        <h3 className="club-card__name">{Name}</h3>
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

  const displayClubs = filteredClubs
    .slice(0, categoryFilter ? filteredClubs.length : visibleClubs)
    .map((club, index) => renderClub(club, index));

  const uniqueCategories = useMemo(() => {
    const categories = clubData.map((club) => club.Category);
    return [...new Set(categories)];
  }, [clubData]);

  const filterButtons = uniqueCategories.map((category, index) => {
    const clubColor = getCategoryColor(category, false);
    const isActive = categoryFilter === category;

    return (
      <button
        type="button"
        key={index}
        className={`clubs-page__filter-btn ${isActive ? "clubs-page__filter-btn--active" : ""}`}
        style={isActive ? clubColor : {}}
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
          Browse all registered clubs and sports at Lowell. Use filters or search to find a specific club.
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
              type="text"
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
            <span className="clubs-page__filter-scroll-hint-arrows" aria-hidden="true">
              ← →
            </span>{" "}
            for all categories
          </p>
          <div className="clubs-page__filter-list">
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
      <div className="clubs-page__grid">
        {filteredClubs.length === 0 ? (
          <div className="clubs-page__empty">
            <h2 className="clubs-page__empty-title">No clubs found</h2>
            <p className="clubs-page__empty-text">
              Try checking your spelling or adjusting the filters. If you are looking for a team or activity that is not a club,
              please also check the Organizations tab.
            </p>
          </div>
        ) : (
          displayClubs
        )}
      </div>
      {!categoryFilter && filteredClubs.length > 0 && visibleClubs < filteredClubs.length && (
        <div className="clubs-page__load-wrap">
          <button type="button" className="clubs-page__load" onClick={loadMore}>
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
      MeetingPlaceTime: PropTypes.string,
      President: PropTypes.string,
      VP: PropTypes.string,
      OtherOfficers: PropTypes.string,
      Instagram: PropTypes.string,
      Banner: PropTypes.string,
    })
  ).isRequired,
};

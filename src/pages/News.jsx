import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const INITIAL_VISIBLE_COUNT = 2;
const PREVIEW_LENGTH = 110;

function getPreview(text) {
  if (!text) return "";
  if (text.length <= PREVIEW_LENGTH) return text;
  return `${text.slice(0, PREVIEW_LENGTH).trimEnd()}...`;
}

export default function News({ newsData, previewMode = true }) {
  const newsItems = useMemo(() => (newsData && newsData.length ? newsData : []), [newsData]);
  const [expandedId, setExpandedId] = useState(null);
  const visibleNews = previewMode
    ? newsItems.slice(0, INITIAL_VISIBLE_COUNT)
    : newsItems;
  const hasMore = previewMode && newsItems.length > INITIAL_VISIBLE_COUNT;

  return (
    <div className="news-section center">
      <h2>News & Announcements</h2>
      <div className="news-container">
        {visibleNews.length === 0 && (
          <p className="news-empty">No announcements posted yet.</p>
        )}
        {visibleNews.map((news) => {
          const id = news.id ?? `${news.title}-${news.date}-${news.content}`;
          const isExpanded = expandedId === id;
          const contentToRender = isExpanded ? news.content : getPreview(news.content);

          return (
          <button
            type="button"
            key={id}
            className={`news-item ${isExpanded ? "expanded" : ""}`}
            onClick={() => setExpandedId(isExpanded ? null : id)}
            aria-expanded={isExpanded}
          >
            <h3>{news.title}</h3>
            <p className="news-date">{news.date}</p>
            <p className="news-content">{contentToRender}</p>
            <p className="news-item-hint">
              {isExpanded ? "Click to collapse" : "Click to view more"}
            </p>
          </button>
        )})}
      </div>
      {hasMore && (
        <Link to="/Announcements" className="news-load-more">
          View more announcements
        </Link>
      )}
    </div>
  );
}

News.propTypes = {
  newsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ),
  previewMode: PropTypes.bool,
};

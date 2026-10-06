import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import posts from "../../config/instagramPosts.config.js";
import Logo from "../../assets/LSA-Logo.png";
import "./Events.scss";

const PREVIEW_COUNT = 4;

const PROFILE = "https://www.instagram.com/lowellhs/";
const HANDLE = "lowellhs";
const CAPTION_TOKEN = /(https?:\/\/[^\s]+)|(@[\w.]+)|(#[\w]+)/g;

export default function Events({ preview = false }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const matched = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((post) =>
      [post.caption, post.date].join(" ").toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const openPost = posts.find((post) => post.id === openId) ?? null;
  const visible = preview ? posts.slice(0, PREVIEW_COUNT) : matched;
  const dialog = openPost && (
    <PostDialog post={openPost} onClose={() => setOpenId(null)} />
  );
  const grid = (
    <div className="events-grid">
      {visible.map((post) => (
        <PostCard key={post.id} post={post} onOpen={setOpenId} />
      ))}
    </div>
  );

  if (preview) {
    return (
      <div className="news-section">
        <h2>Events</h2>
        <div className="events-preview">
          {visible.length === 0 ? (
            <p className="events-empty" role="status">
              No events posted yet.
            </p>
          ) : (
            grid
          )}
          {posts.length > PREVIEW_COUNT && (
            <Link to="/Events" className="news-load-more">
              View all events
            </Link>
          )}
          {dialog}
        </div>
      </div>
    );
  }

  return (
    <section className="events-page">
      <header className="events-hero">
        <h1>Events</h1>
        <p>
          Posts from{" "}
          <a href={PROFILE} target="_blank" rel="noopener noreferrer">
            @lowellhs
          </a>{" "}
          on Instagram.
        </p>
      </header>

      <div className="events-main">
        {posts.length > 0 && (
          <div className="events-controls">
            <label className="events-search" htmlFor="events-search">
              <span>Search</span>
              <input
                id="events-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search captions"
              />
            </label>
          </div>
        )}

        {posts.length === 0 ? (
          <p className="events-empty" role="status">
            No posts yet.{" "}
            <a href={PROFILE} target="_blank" rel="noopener noreferrer">
              See @lowellhs on Instagram
            </a>
            .
          </p>
        ) : matched.length === 0 ? (
          <p className="events-empty" role="status">
            No posts match that search.
          </p>
        ) : (
          grid
        )}
      </div>

      {dialog}
    </section>
  );
}

function PostCard({ post, onOpen }) {
  return (
    <button
      type="button"
      className="events-card"
      aria-haspopup="dialog"
      onClick={() => onOpen(post.id)}
    >
      <img src={post.cover} alt="" />
      <div className="events-card__body">
        <p className="events-card__date">{post.date}</p>
        <p className="events-card__caption">{post.caption}</p>
      </div>
    </button>
  );
}

function captionNodes(text) {
  const nodes = [];
  let last = 0;
  for (const match of text.matchAll(CAPTION_TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) {
      nodes.push(<span key={`t${index}`}>{text.slice(last, index)}</span>);
    }
    const token = match[0];
    const href = token.startsWith("@")
      ? `https://www.instagram.com/${token.slice(1)}/`
      : token.startsWith("#")
        ? `https://www.instagram.com/explore/tags/${token.slice(1)}/`
        : token;
    nodes.push(
      <a key={`l${index}`} href={href} target="_blank" rel="noopener noreferrer">
        {token}
      </a>,
    );
    last = index + token.length;
  }
  if (last < text.length) nodes.push(<span key="tail">{text.slice(last)}</span>);
  return nodes;
}

function igDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function dotStates(count, active) {
  const max = 5;
  if (count <= 1) return [];
  if (count <= max) {
    return Array.from({ length: count }, (_, index) => ({ index, edge: false }));
  }
  const start = Math.min(Math.max(active - 2, 0), count - max);
  return Array.from({ length: max }, (_, offset) => {
    const index = start + offset;
    const edge =
      index !== active &&
      ((offset === 0 && start > 0) || (offset === max - 1 && start + max < count));
    return { index, edge };
  });
}

function Chevron({ dir }) {
  const points = dir === "left" ? "15 5 8 12 15 19" : "9 5 16 12 9 19";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PostDialog({ post, onClose }) {
  const slides = useMemo(
    () =>
      post.video
        ? []
        : post.slides?.length
          ? post.slides
          : post.cover
            ? [post.cover]
            : [],
    [post.video, post.slides, post.cover],
  );
  const [slide, setSlide] = useState(0);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const many = slides.length > 1;

  useEffect(() => {
    // Warm every slide up front so Next/Prev never waits on a cold CDN fetch.
    slides.forEach((src) => {
      if (!src) return;
      const image = new Image();
      image.decoding = "async";
      image.src = src;
    });
  }, [slides]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(event) {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSlide((index) => Math.max(0, index - 1));
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSlide((index) => Math.min(slides.length - 1, index + 1));
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [slides.length]);

  const dialog = (
    <div className="ig-backdrop" role="presentation" onClick={onClose}>
      <div
        className="ig-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${HANDLE}, ${post.date}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="ig-close"
          aria-label="Close"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
            <path
              d="M18 6 6 18M6 6l12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="ig-media">
          {post.video ? (
            <video controls playsInline poster={post.cover} src={post.video} />
          ) : (
            <>
              {/* Active slide stays in-flow so the dialog sizes to the flyer. */}
              {slides[slide] && (
                <img
                  key={slides[slide]}
                  src={slides[slide]}
                  alt=""
                  draggable={false}
                  decoding="sync"
                  fetchPriority="high"
                />
              )}
              {/* Keep neighbors decoded/cached without affecting layout. */}
              {slides.map((src, index) =>
                index === slide || !src ? null : (
                  <img
                    key={`preload-${src}-${index}`}
                    className="ig-slide-preload"
                    src={src}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    decoding="async"
                    fetchPriority="low"
                  />
                ),
              )}
            </>
          )}
          {many && slide > 0 && (
            <button
              type="button"
              className="ig-arrow ig-arrow--prev"
              aria-label="Previous"
              onClick={() => setSlide((index) => index - 1)}
            >
              <Chevron dir="left" />
            </button>
          )}
          {many && slide < slides.length - 1 && (
            <button
              type="button"
              className="ig-arrow ig-arrow--next"
              aria-label="Next"
              onClick={() => setSlide((index) => index + 1)}
            >
              <Chevron dir="right" />
            </button>
          )}
          {many && (
            <div className="ig-dots">
              {dotStates(slides.length, slide).map(({ index, edge }) => (
                <button
                  key={index}
                  type="button"
                  className={`ig-dot${index === slide ? " is-active" : ""}${edge ? " is-edge" : ""}`}
                  aria-label={`Slide ${index + 1} of ${slides.length}`}
                  aria-current={index === slide ? "true" : undefined}
                  onClick={() => setSlide(index)}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="ig-side">
          <header className="ig-head">
            <a href={PROFILE} target="_blank" rel="noopener noreferrer">
              <img className="ig-avatar" src={Logo} alt="" />
            </a>
            <a className="ig-user" href={PROFILE} target="_blank" rel="noopener noreferrer">
              {HANDLE}
            </a>
          </header>
          <div className="ig-scroll">
            <div className="ig-comment">
              <img className="ig-avatar" src={Logo} alt="" />
              <div>
                <div className="ig-copy">
                  <a className="ig-user" href={PROFILE} target="_blank" rel="noopener noreferrer">
                    {HANDLE}
                  </a>{" "}
                  {captionNodes(post.caption || "")}
                </div>
                {post.url ? (
                  <a className="ig-time" href={post.url} target="_blank" rel="noopener noreferrer">
                    {igDate(post.date)}
                  </a>
                ) : (
                  <span className="ig-time">{igDate(post.date)}</span>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

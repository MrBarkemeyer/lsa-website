import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import posts from "../../config/instagramPosts.config.js";
import Logo from "../../assets/LSA-Logo.png";
import "./Events.scss";

const PREVIEW_COUNT = 4;

const DEFAULT_HANDLE = "lowellhs";
const CAPTION_TOKEN = /(https?:\/\/[^\s]+)|(@[\w.]+)|(#[\w]+)/g;

function postHandle(post) {
  return post.handle || DEFAULT_HANDLE;
}

function profileUrl(handle) {
  return `https://www.instagram.com/${handle}/`;
}

function accountHandles(list) {
  const handles = [...new Set(list.map(postHandle))];
  handles.sort((a, b) => {
    if (a === DEFAULT_HANDLE) return -1;
    if (b === DEFAULT_HANDLE) return 1;
    return a.localeCompare(b);
  });
  return handles;
}

export default function Events({ preview = false }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const matched = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((post) =>
      [post.caption, post.date, postHandle(post)].join(" ").toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const openPost = posts.find((post) => post.id === openId) ?? null;
  const handles = accountHandles(posts);
  const showHandle = handles.length > 1;
  const visible = preview ? posts.slice(0, PREVIEW_COUNT) : matched;
  const dialog = openPost && (
    <PostDialog post={openPost} onClose={() => setOpenId(null)} />
  );
  const grid = (
    <div className="events-grid">
      {visible.map((post) => (
        <PostCard key={post.id} post={post} showHandle={showHandle} onOpen={setOpenId} />
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
          Posts from <AccountList handles={handles} /> on Instagram.
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
                placeholder="Search posts"
              />
            </label>
          </div>
        )}

        {posts.length === 0 ? (
          <p className="events-empty" role="status">
            No posts yet.{" "}
            <a href={profileUrl(DEFAULT_HANDLE)} target="_blank" rel="noopener noreferrer">
              See @{DEFAULT_HANDLE} on Instagram
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

function AccountList({ handles }) {
  const list = handles.length ? handles : [DEFAULT_HANDLE];
  return list.map((handle, index) => {
    const link = (
      <a key={handle} href={profileUrl(handle)} target="_blank" rel="noopener noreferrer">
        @{handle}
      </a>
    );
    if (index === 0) return link;
    const separator = index === list.length - 1 ? " and " : ", ";
    return (
      <span key={handle}>
        {separator}
        {link}
      </span>
    );
  });
}

function PostCard({ post, showHandle, onOpen }) {
  return (
    <button
      type="button"
      className="events-card"
      aria-haspopup="dialog"
      onClick={() => onOpen(post.id)}
    >
      <img src={post.cover} alt="" />
      <div className="events-card__body">
        <p className="events-card__date">
          {post.date}
          {showHandle ? (
            <span className="events-card__handle"> @{postHandle(post)}</span>
          ) : null}
        </p>
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
  const [dragX, setDragX] = useState(0);
  const [suspendMotion, setSuspendMotion] = useState(false);
  const [motionMs, setMotionMs] = useState(380);
  const closeRef = useRef(null);
  const stageRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const slideRef = useRef(0);
  const dragRef = useRef(null);
  const motionGen = useRef(0);
  const goToRef = useRef(null);
  onCloseRef.current = onClose;
  slideRef.current = slide;
  const many = slides.length > 1;
  const count = slides.length;

  const goTo = (nextIndex) => {
    const next = Math.max(0, Math.min(count - 1, nextIndex));
    const delta = next - slideRef.current;
    if (delta === 0) return;
    motionGen.current += 1;
    dragRef.current = null;
    const distance = Math.abs(delta);
    slideRef.current = next;
    setDragX(0);
    setSuspendMotion(false);
    setMotionMs(Math.min(560, 340 + Math.max(0, distance - 1) * 70));
    setSlide(next);
  };
  goToRef.current = goTo;

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
        goToRef.current?.(slideRef.current - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToRef.current?.(slideRef.current + 1);
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [slides.length]);

  function onPointerDown(event) {
    if (!many || event.button !== 0) return;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      locked: false,
    };
  }

  function onPointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.locked) {
      if (Math.hypot(dx, dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        dragRef.current = null;
        return;
      }
      drag.locked = true;
      motionGen.current += 1;
      setSuspendMotion(true);
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Pointer can vanish before capture; the move still tracks.
      }
    }
    const atStart = slideRef.current <= 0 && dx > 0;
    const atEnd = slideRef.current >= count - 1 && dx < 0;
    setDragX(atStart || atEnd ? dx * 0.32 : dx);
  }

  function onPointerUp(event) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.locked) return;
    const dx = event.clientX - drag.x;
    const width = stageRef.current?.clientWidth || 1;
    const threshold = Math.min(72, width * 0.16);
    let next = slideRef.current;
    if (dx <= -threshold) next += 1;
    else if (dx >= threshold) next -= 1;
    next = Math.max(0, Math.min(count - 1, next));
    const gen = ++motionGen.current;
    setSuspendMotion(false);
    // Let the eased transition apply on the dragged frame before the snap target.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (motionGen.current !== gen) return;
        slideRef.current = next;
        setDragX(0);
        setSlide(next);
      });
    });
  }

  const dialog = (
    <div className="ig-backdrop" role="presentation" onClick={onClose}>
      <div
        className="ig-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${postHandle(post)}, ${post.date}`}
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
          ) : count > 0 ? (
            <>
              {/* In-flow image sizes the dialog; the track slides on top of it. */}
              <img className="ig-sizer" src={slides[0]} alt="" aria-hidden="true" />
              <div
                ref={stageRef}
                className={`ig-stage${many ? " is-slidable" : ""}${suspendMotion ? " is-dragging" : ""}`}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onDragStart={(event) => event.preventDefault()}
              >
                <div
                  className={`ig-track${suspendMotion ? " is-instant" : ""}`}
                  style={{
                    "--ig-count": count,
                    "--ig-index": slide,
                    "--ig-drag": `${dragX}px`,
                    "--ig-ms": `${motionMs}ms`,
                  }}
                >
                  {slides.map((src, index) => (
                    <img
                      key={`${src}-${index}`}
                      src={src}
                      alt=""
                      draggable={false}
                      decoding={index === slide ? "sync" : "async"}
                      fetchPriority={Math.abs(index - slide) <= 1 ? "high" : "low"}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : null}
          {many && slide > 0 && (
            <button
              type="button"
              className="ig-arrow ig-arrow--prev"
              aria-label="Previous"
              onClick={() => goTo(slideRef.current - 1)}
            >
              <Chevron dir="left" />
            </button>
          )}
          {many && slide < count - 1 && (
            <button
              type="button"
              className="ig-arrow ig-arrow--next"
              aria-label="Next"
              onClick={() => goTo(slideRef.current + 1)}
            >
              <Chevron dir="right" />
            </button>
          )}
          {many && (
            <div className="ig-dots">
              {dotStates(count, slide).map(({ index, edge }) => (
                <button
                  key={index}
                  type="button"
                  className={`ig-dot${index === slide ? " is-active" : ""}${edge ? " is-edge" : ""}`}
                  aria-label={`Slide ${index + 1} of ${count}`}
                  aria-current={index === slide ? "true" : undefined}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="ig-side">
          <header className="ig-head">
            <a href={profileUrl(postHandle(post))} target="_blank" rel="noopener noreferrer">
              <img className="ig-avatar" src={Logo} alt="" />
            </a>
            <a className="ig-user" href={profileUrl(postHandle(post))} target="_blank" rel="noopener noreferrer">
              {postHandle(post)}
            </a>
          </header>
          <div className="ig-scroll">
            <div className="ig-comment">
              <img className="ig-avatar" src={Logo} alt="" />
              <div>
                <div className="ig-copy">
                  <a className="ig-user" href={profileUrl(postHandle(post))} target="_blank" rel="noopener noreferrer">
                    {postHandle(post)}
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

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { siteAnswers } from "../config/siteAnswers.config.js";
import { buildSearchDocuments, pageQuery, whoAnswers } from "../utils/siteSearchIndex.js";
import "./SiteSearch.scss";

const SUGGESTION_COUNT = 5;
// ponytail: cap at 4 answers and 12 page hits; raise if a real match is getting cut off
const ANSWER_LIMIT = 4;
const PAGE_LIMIT = 12;

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/['’]/g, "");
}

function queryTokens(query) {
  return normalize(query)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1);
}

function isExternal(to) {
  return /^https?:\/\//i.test(to || "");
}

function makeSnippet(text, tokens, title) {
  const raw = String(text || "").replace(/\s+/g, " ").trim();
  const hay = normalize(raw);
  let index = -1;
  let best = 0;
  for (const token of tokens) {
    let from = 0;
    while (from < hay.length) {
      const at = hay.indexOf(token, from);
      if (at < 0) break;
      const windowText = hay.slice(Math.max(0, at - 40), at + 140);
      const score = tokens.reduce(
        (count, item) => count + (windowText.includes(item) ? 1 : 0),
        0,
      );
      if (score > best) {
        best = score;
        index = at;
      }
      from = at + token.length;
    }
  }
  if (index < 0) return "";
  const start = Math.max(0, index - 48);
  const end = Math.min(raw.length, index + 140);
  let slice = raw.slice(start, end).trim();
  if (start > 0) slice = `…${slice}`;
  if (end < raw.length) slice = `${slice}…`;
  if (normalize(slice) === normalize(title)) return "";
  return slice;
}

function hitScore(title, extra, tokens) {
  const titleText = normalize(title);
  const blob = normalize(`${title} ${extra}`);
  if (!tokens.every((token) => blob.includes(token))) return 0;
  let score = 1;
  for (const token of tokens) {
    if (titleText.includes(token)) score += 5;
  }
  return score;
}

function rank(items, tokens, textOf, limit) {
  return items
    .map((item) => ({ item, score: hitScore(textOf(item).title, textOf(item).extra, tokens) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export default function SiteSearch({
  navLinks = [],
  clubData = [],
  officerData = [],
  newsData = [],
  electionsConfig = null,
  cardinalympicsEvents = [],
  placement = "nav",
}) {
  const location = useLocation();
  const panelId = useId();
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [panelTop, setPanelTop] = useState(128);

  const documents = useMemo(
    () =>
      buildSearchDocuments({
        navLinks,
        clubData,
        officerData,
        newsData,
        electionsConfig,
        cardinalympicsEvents,
      }),
    [
      navLinks,
      clubData,
      officerData,
      newsData,
      electionsConfig,
      cardinalympicsEvents,
    ],
  );
  const tokens = useMemo(() => queryTokens(query), [query]);
  const lookupTokens = useMemo(() => queryTokens(pageQuery(query)), [query]);
  const people = useMemo(() => whoAnswers(documents, query), [documents, query]);
  const answers = useMemo(() => {
    if (tokens.length === 0 || people.length > 0) return [];
    return rank(
      siteAnswers,
      tokens,
      (item) => ({
        title: item.question,
        extra: `${(item.keywords || []).join(" ")} ${item.answer}`,
      }),
      ANSWER_LIMIT,
    );
  }, [people.length, tokens]);
  const pageHits = useMemo(() => {
    if (people.length > 0 || lookupTokens.length === 0) return [];
    return rank(
      documents,
      lookupTokens,
      (item) => ({ title: item.title, extra: item.text }),
      PAGE_LIMIT,
    ).map((item) => ({
      ...item,
      snippet: makeSnippet(item.text, lookupTokens, item.title),
    }));
  }, [documents, lookupTokens, people.length]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const place = () => {
      const anchor = rootRef.current?.closest(".nav-links, .hamburger-menu");
      const rect = anchor?.getBoundingClientRect();
      if (rect) setPanelTop(rect.bottom + 8);
    };
    place();
    inputRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", place);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  function toggle() {
    setOpen((current) => {
      if (!current) setQuery("");
      return !current;
    });
  }

  function close() {
    setOpen(false);
  }

  const searching = tokens.length > 0;
  const suggestions = [
    { question: "Who is the Club Coordinator?" },
    ...siteAnswers.slice(0, SUGGESTION_COUNT - 1),
  ];

  const panel = open
    ? createPortal(
        <>
          <div className="site-search__backdrop" onClick={close} />
          <div
            className="site-search__panel"
            id={panelId}
            role="dialog"
            aria-label="Search the site"
            style={{
              top: panelTop,
              maxHeight: `calc(100vh - ${panelTop}px - 1rem)`,
            }}
          >
            <input
              ref={inputRef}
              className="site-search__input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pages or ask a question"
              aria-label="Search pages or ask a question"
              autoComplete="off"
            />
            <div className="site-search__results">
              {!searching && (
                <section>
                  <h2 className="site-search__label">Questions you can ask</h2>
                  <ul className="site-search__list">
                    {suggestions.map((item) => (
                      <li key={item.question}>
                        <button
                          type="button"
                          className="site-search__suggestion"
                          onClick={() => {
                            setQuery(item.question);
                            inputRef.current?.focus();
                          }}
                        >
                          {item.question}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {searching && (people.length > 0 || answers.length > 0) && (
                <section>
                  <h2 className="site-search__label">Answers</h2>
                  <ul className="site-search__list">
                    {[...people, ...answers].map((item) => (
                      <li key={item.id || item.question} className="site-search__answer">
                        <h3>{item.question}</h3>
                        <p>{item.answer}</p>
                        {item.to ? (
                          isExternal(item.to) ? (
                            <a href={item.to} target="_blank" rel="noopener noreferrer">
                              Open link
                            </a>
                          ) : (
                            <Link to={item.to} onClick={close}>
                              Open this page
                            </Link>
                          )
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {searching && pageHits.length > 0 && (
                <section>
                  <h2 className="site-search__label">Pages</h2>
                  <ul className="site-search__list">
                    {pageHits.map((page) => {
                      const showSection =
                        normalize(page.section) !== normalize(page.title);
                      const content = (
                        <>
                          <span className="site-search__title">{page.title}</span>
                          {page.snippet ? (
                            <span className="site-search__snippet">{page.snippet}</span>
                          ) : null}
                          {showSection ? (
                            <span className="site-search__meta">{page.section}</span>
                          ) : null}
                        </>
                      );
                      return (
                        <li key={page.id || page.to}>
                          {page.external ? (
                            <a
                              className="site-search__page"
                              href={page.to}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={close}
                            >
                              {content}
                            </a>
                          ) : (
                            <Link
                              className="site-search__page"
                              to={page.to}
                              onClick={close}
                            >
                              {content}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {searching &&
                people.length === 0 &&
                answers.length === 0 &&
                pageHits.length === 0 && (
                <p className="site-search__empty">
                  Nothing matched. Try a name, or a question like “Who is the Club
                  Coordinator?”
                </p>
              )}
            </div>
          </div>
        </>,
        document.body,
      )
    : null;

  return (
    <div
      className={`site-search site-search--${placement}`}
      ref={rootRef}
    >
      <button
        type="button"
        className="site-search__button"
        aria-label={open ? "Close search" : "Search the site"}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={toggle}
      >
        <FontAwesomeIcon icon={open ? faXmark : faMagnifyingGlass} />
      </button>
      {panel}
    </div>
  );
}

SiteSearch.propTypes = {
  navLinks: PropTypes.array,
  clubData: PropTypes.array,
  officerData: PropTypes.array,
  newsData: PropTypes.array,
  electionsConfig: PropTypes.object,
  cardinalympicsEvents: PropTypes.array,
  placement: PropTypes.oneOf(["nav", "bar"]),
};

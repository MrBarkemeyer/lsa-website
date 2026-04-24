import { Link, useLocation } from "react-router-dom";
import "./Resources/Resources.scss";

function NotFoundArt() {
  return (
    <svg
      className="not-found__svg"
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="70" cy="70" r="64" fill="url(#notFoundGrad)" opacity="0.95" />
      <circle cx="48" cy="52" r="5" fill="#5c1515" />
      <circle cx="92" cy="52" r="5" fill="#5c1515" />
      <path
        d="M52 78c8 10 28 10 36 0"
        stroke="#5c1515"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse cx="70" cy="95" rx="8" ry="5" fill="#f4a4a4" opacity="0.65" />
      <path
        d="M70 22c-6 8-18 14-26 10 2-12 14-20 26-22 12 2 24 10 26 22-8 4-20-2-26-10z"
        fill="#c41e1e"
      />
      <circle cx="118" cy="32" r="4" fill="#f0b8b8" opacity="0.9" />
      <circle cx="28" cy="38" r="3" fill="#f0b8b8" opacity="0.75" />
      <circle cx="124" cy="88" r="3.5" fill="#e8a0a0" opacity="0.85" />
      <defs>
        <linearGradient id="notFoundGrad" x1="20" y1="20" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffe8e8" />
          <stop offset="1" stopColor="#ffd6d6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function NotFound() {
  const location = useLocation();

  return (
    <main className="resource-page not-found">
      <div className="not-found__inner">
        <div className="not-found__mascot">
          <NotFoundArt />
        </div>
        <p className="not-found__eyebrow">404 · page not found</p>
        <h1 className="not-found__heading">This page is playing hide-and-seek</h1>
        <p className="not-found__text">
          We looked through our routes and could not find{" "}
          <code className="not-found__path">{location.pathname}</code>
          Maybe a typo, or a bookmark from an older site. No worries!
        </p>
        <Link to="/" className="not-found__cta">
          Take me home
        </Link>
      </div>
    </main>
  );
}

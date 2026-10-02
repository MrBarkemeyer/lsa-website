import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./NotFound.scss";

export default function NotFound() {
  const location = useLocation();

  return (
    <main className="not-found">
      <div className="not-found__inner">
        <p className="not-found__eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="not-found__lede">
          Nothing is published at{" "}
          <code className="not-found__path">{location.pathname}</code>. The
          link may be outdated, or the address may be mistyped.
        </p>
        <Link to="/" className="not-found__cta">
          Back home
          <FontAwesomeIcon icon={faArrowRight} aria-hidden />
        </Link>
      </div>
    </main>
  );
}

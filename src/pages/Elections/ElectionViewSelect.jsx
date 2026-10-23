import { useEffect, useId, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useElectionResultsReleased } from "../../utils/electionVotingWindow.js";
import {
  ELECTIONS_BASE,
  isDevElectionResultsPath,
} from "./electionsPaths.js";

const VIEW_OPTIONS = [
  { value: "results", label: "Results" },
  { value: "candidates", label: "Candidates" },
];

export default function ElectionViewSelect({ config, view }) {
  const released = useElectionResultsReleased(config);
  const navigate = useNavigate();
  const location = useLocation();
  const menuId = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const [open, setOpen] = useState(false);
  const current = view === "candidates" ? "candidates" : "results";
  const currentLabel =
    VIEW_OPTIONS.find((option) => option.value === current)?.label ?? "Results";
  const electionsBase = isDevElectionResultsPath(location.pathname)
    ? location.pathname.replace(/\/+$/, "")
    : ELECTIONS_BASE;

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    const selectedIndex = Math.max(
      0,
      VIEW_OPTIONS.findIndex((option) => option.value === current),
    );
    optionRefs.current[selectedIndex]?.focus();

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, current]);

  if (config?.state !== "results" || !released) return null;

  const choose = (nextView) => {
    setOpen(false);
    if (nextView === current) return;
    if (nextView === "candidates") {
      navigate(`${electionsBase}?view=candidates`);
      return;
    }
    navigate(electionsBase);
  };

  const onOptionKeyDown = (event, index) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex =
        (index + direction + VIEW_OPTIONS.length) % VIEW_OPTIONS.length;
      optionRefs.current[nextIndex]?.focus();
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      optionRefs.current[0]?.focus();
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      optionRefs.current[VIEW_OPTIONS.length - 1]?.focus();
      return;
    }
    if (event.key === "Tab") setOpen(false);
  };

  return (
    <div className="elections-view-menu" ref={rootRef}>
      <span className="elections-view-menu__label" id={`${menuId}-label`}>
        View
      </span>
      <button
        ref={triggerRef}
        type="button"
        className={`elections-view-menu__trigger${open ? " elections-view-menu__trigger--open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${menuId}-list`}
        aria-label={`View, ${currentLabel}`}
        onClick={() => setOpen((isOpen) => !isOpen)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span>{currentLabel}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="elections-view-menu__chevron"
          aria-hidden="true"
        />
      </button>
      {open ? (
        <ul
          id={`${menuId}-list`}
          className="elections-view-menu__list"
          role="listbox"
          aria-labelledby={`${menuId}-label`}
        >
          {VIEW_OPTIONS.map((option, index) => {
            const selected = option.value === current;
            return (
              <li key={option.value} role="presentation">
                <button
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  type="button"
                  role="option"
                  className={`elections-view-menu__option${selected ? " elections-view-menu__option--selected" : ""}`}
                  aria-selected={selected}
                  onClick={() => choose(option.value)}
                  onKeyDown={(event) => onOptionKeyDown(event, index)}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

ElectionViewSelect.propTypes = {
  config: PropTypes.object,
  view: PropTypes.oneOf(["results", "candidates"]).isRequired,
};

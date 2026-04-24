import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Logo from "../assets/LSA-Logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faBars,
  faXmark,
  faCaretDown,
  faHouse,
  faCheckToSlot,
  faBook,
  faUser,
  faUsers,
  faThumbTack,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useMemo, useCallback } from "react";
import { buildNavLinks } from "../config/navLinks.js";
import { areElectionBoardsPublic } from "../utils/electionAccess.js";

function normalizeElectionNavKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/_/g, "-");
}

function buildEnabledElectionSlugSet(electionsConfig) {
  const set = new Set();
  const enabled = Array.isArray(electionsConfig?.enabledElectionBoards)
    ? electionsConfig.enabledElectionBoards
    : [];
  const meta = electionsConfig?.electionBoardMeta || {};
  const metaEntries = Object.entries(meta);

  const add = (v) => {
    const key = normalizeElectionNavKey(v);
    if (key) set.add(key);
  };

  // Include slugs currently available in contenders (already merged from sheet/config in App.jsx).
  const contenders = Array.isArray(electionsConfig?.contenders) ? electionsConfig.contenders : [];
  contenders.forEach((c) => {
    add(c?.slug);
    add(c?.board);
  });

  // Include explicit enabled board keys + any mapped meta slug/title.
  enabled.forEach((boardKey) => {
    add(boardKey);
    const match = metaEntries.find(([k]) => k.toLowerCase() === String(boardKey).toLowerCase());
    if (match) {
      const [, item] = match;
      add(item?.slug);
      add(item?.title);
    }
    const year = String(boardKey).match(/\b(20\d{2})\b/);
    if (year) {
      add(`LSA-${year[1]}`);
      add(`LSA ${year[1]}`);
    }
  });

  return set;
}

function filterElectionSubNav(links, electionsConfig) {
  if (!electionsConfig) {
    return links;
  }

  const allowed = buildEnabledElectionSlugSet(electionsConfig);
  const nextLinks = links.map((link) => {
    if (link.name !== "ELECTIONS") return link;
    const subLinks = Array.isArray(link.subLinks) ? link.subLinks : [];
    const filteredSubLinks =
      allowed.size === 0
        ? subLinks
        : subLinks.filter((s) => {
            const toKey = normalizeElectionNavKey(s?.to);
            const nameKey = normalizeElectionNavKey(s?.name);
            return allowed.has(toKey) || allowed.has(nameKey);
          });
    return { ...link, subLinks: filteredSubLinks };
  });

  if (areElectionBoardsPublic(electionsConfig)) {
    return nextLinks;
  }

  return nextLinks.map((link) => {
    if (link.name !== "ELECTIONS") return link;
    return {
      ...link,
      hasDropDown: false,
      subLinks: [],
    };
  });
}

const ICON_FALLBACK = {
  HOME: faHouse,
  "ABOUT LSA": faBook,
  ORGANIZATIONS: faUser,
  CLUBS: faUsers,
  ELECTIONS: faCheckToSlot,
  RESOURCES: faThumbTack,
};

function subLinkHref(parentPath, subLink) {
  if (subLink.directLink) return subLink.to;
  if (subLink.hasDropDown && subLink.to == null) return "#";
  return `${parentPath}/${subLink.to}`;
}

function nestedHref(parentPath, subLink2) {
  return `${parentPath}/${subLink2.to}`;
}

function NavLogo() {
  return (
    <Link className="logo" to="/">
      <img src={Logo} alt="Lowell Student Association" />
    </Link>
  );
}

function HamburgerSubRow({
  parentTo,
  parentId,
  index,
  subLink,
  nestedOpen,
  onToggleNested,
}) {
  const nestedList =
    subLink.hasDropDown && nestedOpen && subLink.subLinks2 ? (
      <ul className="ham-second-dropdowns">
        {subLink.subLinks2.map((subLink2, idx) => (
          <Link
            key={`${parentId}-h-${index}-n-${idx}`}
            to={nestedHref(parentTo, subLink2)}
            className="link"
          >
            {subLink2.name}
          </Link>
        ))}
      </ul>
    ) : null;

  return (
    <li
      className="dropdown relative"
      style={{
        marginBottom:
          nestedOpen && subLink.subLinks2
            ? `${subLink.subLinks2.length * 31 + 10}px`
            : "0px",
      }}
    >
      <Link
        className="link flex-between"
        to={subLinkHref(parentTo, subLink)}
      >
        {subLink.name}
      </Link>
      {subLink.hasDropDown && (
        <FontAwesomeIcon
          icon={nestedOpen ? faMinus : faPlus}
          className="second-dropdown-icon"
          onClick={onToggleNested}
        />
      )}
      {nestedList}
    </li>
  );
}

HamburgerSubRow.propTypes = {
  parentTo: PropTypes.string.isRequired,
  parentId: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  nestedOpen: PropTypes.bool.isRequired,
  onToggleNested: PropTypes.func.isRequired,
  subLink: PropTypes.shape({
    name: PropTypes.string.isRequired,
    to: PropTypes.string,
    hasDropDown: PropTypes.bool,
    directLink: PropTypes.bool,
    subLinks2: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

const subLinkPropType = HamburgerSubRow.propTypes.subLink;

function DesktopBigSubRow({
  parentTo,
  parentId,
  index,
  subLink,
  rowOpen,
  onToggleRow,
}) {
  const linkTo = subLink.directLink
    ? subLink.to
    : subLink.hasDropDown
      ? "#"
      : `${parentTo}/${subLink.to}`;

  const nestedList = subLink.subLinks2 ? (
    <ul
      className="big-second-dropdowns"
      style={{ display: rowOpen ? "flex" : "none" }}
    >
      {subLink.subLinks2.map((subLink2, idx) => (
        <Link
          key={`${parentId}-b-${index}-n-${idx}`}
          to={nestedHref(parentTo, subLink2)}
          className="link"
        >
          {subLink2.name}
        </Link>
      ))}
    </ul>
  ) : null;

  return (
    <li
      className="big-dropdown relative"
      onClick={onToggleRow}
    >
      <Link className="link" to={linkTo}>
        {subLink.name}{" "}
        {subLink.hasDropDown ? (
          <FontAwesomeIcon
            icon={faCaretDown}
            className="big-dropdown-icon right-caret"
          />
        ) : null}
      </Link>
      {nestedList}
    </li>
  );
}

DesktopBigSubRow.propTypes = {
  parentTo: PropTypes.string.isRequired,
  parentId: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  rowOpen: PropTypes.bool.isRequired,
  onToggleRow: PropTypes.func.isRequired,
  subLink: subLinkPropType,
};

function DesktopSmallSubRow({ parentTo, parentId, index, subLink }) {
  const nestedList = subLink.subLinks2 ? (
    <ul className="second-dropdowns">
      {subLink.subLinks2.map((subLink2, idx) => (
        <Link
          key={`${parentId}-s-${index}-n-${idx}`}
          to={nestedHref(parentTo, subLink2)}
          className="link"
        >
          {subLink2.name}
        </Link>
      ))}
    </ul>
  ) : null;

  return (
    <li className="dropdown relative">
      <Link className="link" to={subLinkHref(parentTo, subLink)}>
        {subLink.name}{" "}
        {subLink.hasDropDown ? (
          <FontAwesomeIcon
            icon={faCaretRight}
            className="dropdown-icon right-caret"
          />
        ) : null}
      </Link>
      {nestedList}
    </li>
  );
}

DesktopSmallSubRow.propTypes = {
  parentTo: PropTypes.string.isRequired,
  parentId: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  subLink: subLinkPropType,
};

function HamburgerSection({
  link,
  sectionOpen,
  mobileNestedOpen,
  onToggleSection,
  onToggleNested,
}) {
  const {
    name,
    subLinks = [],
    hasDropDown,
    id,
    to,
    icon = ICON_FALLBACK[name],
  } = link;

  const additionalMargin = subLinks.reduce((acc, subLink, index) => {
    const nestedKey = `${id}-${index}`;
    const nestedOn =
      !!mobileNestedOpen[nestedKey] && subLink.subLinks2?.length;
    return nestedOn
      ? acc + subLink.subLinks2.length * 31 + 10
      : acc;
  }, 0);

  return (
    <div
      className="relative ham-first-dropdowns"
      style={{
        marginBottom: sectionOpen
          ? `${subLinks.length * 42 + additionalMargin}px`
          : "0px",
      }}
    >
      <Link to={to} className="link flex-between">
        <div>
          {icon && <FontAwesomeIcon icon={icon} className="icon" />} {name}
        </div>
      </Link>
      {hasDropDown && (
        <FontAwesomeIcon
          icon={sectionOpen ? faMinus : faPlus}
          className="dropdown-icon"
          onClick={onToggleSection}
        />
      )}

      {hasDropDown && sectionOpen && (
        <ul className="ham-dropdowns">
          {subLinks.map((subLink, index) => (
            <HamburgerSubRow
              key={`${id}-h-${index}`}
              parentTo={to}
              parentId={id}
              index={index}
              subLink={subLink}
              nestedOpen={!!mobileNestedOpen[`${id}-${index}`]}
              onToggleNested={() => onToggleNested(index)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

HamburgerSection.propTypes = {
  link: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    hasDropDown: PropTypes.bool,
    icon: PropTypes.object,
    subLinks: PropTypes.arrayOf(subLinkPropType),
  }).isRequired,
  sectionOpen: PropTypes.bool.isRequired,
  mobileNestedOpen: PropTypes.objectOf(PropTypes.bool).isRequired,
  onToggleSection: PropTypes.func.isRequired,
  onToggleNested: PropTypes.func.isRequired,
};

export default function Navbar({ clubData, electionsEnabled = true, electionsConfig = null }) {
  const location = useLocation();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [mobileSectionOpen, setMobileSectionOpen] = useState({});
  const [mobileNestedOpen, setMobileNestedOpen] = useState({});
  const [openBigSubRow, setOpenBigSubRow] = useState(null);

  const navLinks = useMemo(() => buildNavLinks(clubData), [clubData]);

  const navLinksFiltered = useMemo(() => {
    const base = electionsEnabled
      ? navLinks
      : navLinks.filter((link) => link.name !== "ELECTIONS");
    return filterElectionSubNav(base, electionsConfig);
  }, [navLinks, electionsEnabled, electionsConfig]);

  const toggleMobileSection = useCallback((id) => {
    setMobileSectionOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleMobileNested = useCallback((parentId, childIndex) => {
    const key = `${parentId}-${childIndex}`;
    setMobileNestedOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleBigSubRow = useCallback((parentId, rowIndex) => {
    const nextKey = `${parentId}-${rowIndex}`;
    setOpenBigSubRow((prev) => (prev === nextKey ? null : nextKey));
  }, []);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setHamburgerOpen(false);
  }, [location]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1000px)");
    const onBreakpoint = () => {
      if (!mq.matches) setHamburgerOpen(false);
    };
    mq.addEventListener("change", onBreakpoint);
    return () => mq.removeEventListener("change", onBreakpoint);
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    if (hamburgerOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [hamburgerOpen]);

  useEffect(() => {
    if (!hamburgerOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setHamburgerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hamburgerOpen]);

  const scrolledStyle = {
    background: hasScrolled ? "white" : "transparent",
    opacity: hasScrolled ? 1 : 0.5,
    transition: "all 0.3s ease-in-out",
  };

  const desktopItems = useMemo(
    () =>
      navLinksFiltered.map((link) => {
        const {
          name,
          subLinks = [],
          hasDropDown,
          icon = ICON_FALLBACK[name],
          id,
          to,
          bigSubLink,
        } = link;

        return (
          <div className="relative first-dropdowns" key={id}>
            <Link to={to} className="link">
              {icon && <FontAwesomeIcon icon={icon} className="icon" />}{" "}
              {name}{" "}
              {hasDropDown ? (
                <FontAwesomeIcon
                  icon={faCaretDown}
                  className="dropdown-icon icon"
                />
              ) : null}
            </Link>

            {hasDropDown && !bigSubLink && (
              <ul className="dropdowns">
                {subLinks.map((subLink, index) => (
                  <DesktopSmallSubRow
                    key={`${id}-s-${index}`}
                    parentTo={to}
                    parentId={id}
                    index={index}
                    subLink={subLink}
                  />
                ))}
              </ul>
            )}

            {hasDropDown && bigSubLink && (
              <ul className="big-dropdowns">
                {subLinks.map((subLink, index) => (
                  <DesktopBigSubRow
                    key={`${id}-b-${index}`}
                    parentTo={to}
                    parentId={id}
                    index={index}
                    subLink={subLink}
                    rowOpen={openBigSubRow === `${id}-${index}`}
                    onToggleRow={() => toggleBigSubRow(id, index)}
                  />
                ))}
              </ul>
            )}
          </div>
        );
      }),
    [navLinksFiltered, openBigSubRow, toggleBigSubRow]
  );

  const hamburgerItems = useMemo(
    () =>
      navLinksFiltered.map((link) => (
        <HamburgerSection
          key={link.id}
          link={link}
          sectionOpen={!!mobileSectionOpen[link.id]}
          mobileNestedOpen={mobileNestedOpen}
          onToggleSection={() => toggleMobileSection(link.id)}
          onToggleNested={(index) => toggleMobileNested(link.id, index)}
        />
      )),
    [
      navLinksFiltered,
      mobileSectionOpen,
      mobileNestedOpen,
      toggleMobileSection,
      toggleMobileNested,
    ]
  );

  return (
    <>
      <div
        className={
          location.pathname === "/" ? "ham-offset" : "off-set ham-offset"
        }
      />
      <div className="navbar">
        <ul
          className="nav-links"
          style={hasScrolled ? scrolledStyle : {}}
        >
          <NavLogo />
          {desktopItems}
        </ul>
      </div>

      <div className="hamburger-menu">
        <NavLogo />
        <FontAwesomeIcon
          icon={hamburgerOpen ? faXmark : faBars}
          className="hamburger-button"
          onClick={() => setHamburgerOpen((o) => !o)}
          style={{ display: hamburgerOpen ? "none" : "block" }}
        />
      </div>
      {hamburgerOpen && (
        <div
          className="navbar-drawer-backdrop"
          onClick={() => setHamburgerOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Close menu"
        />
      )}
      <div
        className={
          hamburgerOpen
            ? "hamburger-nav hamburger-nav--open"
            : "hamburger-nav hamburger-nav--closed"
        }
      >
        <FontAwesomeIcon
          icon={hamburgerOpen ? faXmark : faBars}
          className="hamburger-button2"
          onClick={() => setHamburgerOpen((o) => !o)}
        />
        {hamburgerItems}
      </div>
    </>
  );
}

Navbar.propTypes = {
  clubData: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Category: PropTypes.string.isRequired,
    })
  ),
  electionsEnabled: PropTypes.bool,
  electionsConfig: PropTypes.object,
};

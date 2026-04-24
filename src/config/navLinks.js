import {
  faHouse,
  faCheckToSlot,
  faBook,
  faUser,
  faUsers,
  faThumbTack,
} from "@fortawesome/free-solid-svg-icons";

/** Map sheet "Category" values to submenu labels (order = display order). */
const CLUB_CATEGORY_MENU = [
  { label: "Sports", category: "Sports" },
  {
    label: "Volunteer and Public Service Clubs",
    category: "Volunteer and Public Service",
  },
  { label: "STEM Clubs", category: "STEM" },
  { label: "Culture and Religion Clubs", category: "Culture/Religion" },
  {
    label: "Entrepreneurship & Finance Clubs",
    category: "Business",
  },
  { label: "Food and Crafts Clubs", category: "Food and Crafts" },
  { label: "Game and Fantasy Clubs", category: "Game and Fantasy" },
  {
    label: "Literature and Media Clubs",
    category: "Literature and Media Clubs",
  },
  {
    label: "Politics and Public Speaking Clubs",
    category: "Politics",
  },
  {
    label: "Visual and Performing Arts Club",
    category: "VPA",
  },
  {
    label: "Health and Environment Clubs",
    category: "Health & Environment",
  },
];

function clubsInCategory(clubData, category) {
  return clubData
    .filter((club) => club.Category === category)
    .map((c) => ({ name: c.Name, to: c.Name }));
}

function buildClubsSubLinks(clubData) {
  return [
    { name: "Club Resources", to: "ClubResources" },
    ...CLUB_CATEGORY_MENU.map(({ label, category }) => ({
      name: label,
      hasDropDown: true,
      subLinks2: clubsInCategory(clubData, category),
    })),
  ];
}

/**
 * Add or edit entries here; use `hasDropDown`, `subLinks`,
 * `bigSubLink` (wide mega-menu), `directLink` (external URL), and nested
 * `subLinks2` the same way as existing items.
 *
 * @param {Array<{ Name: string, Category: string }>} clubData
 */
export function buildNavLinks(clubData) {
  return [
    {
      id: 1,
      name: "HOME",
      to: "/",
      icon: faHouse,
    },
    {
      id: 2,
      name: "ABOUT LSA",
      to: "/LSA",
      icon: faBook,
      hasDropDown: true,
      subLinks: [
        { name: "2025-26 Student Body Council", to: "SBC" },
        { name: "2026 Senior Board", to: "Senior Board" },
        { name: "2027 Junior Board", to: "Junior Board" },
        { name: "2028 Sophomore Board", to: "Sophomore Board" },
        { name: "2029 Freshman Board", to: "Freshman Board" },
        {
          name: "Committees",
          hasDropDown: true,
          to: "Commitees",
          subLinks2: [
            { name: "Spirit Committees", to: "Spirit Committee" },
            { name: "2026 Senior Prom Committee", to: "2026 Senior Prom Committee" },
            { name: "2027 Junior Prom Committee", to: "2027 Junior Prom Committee" },
            { name: "2026 Senior Boat Committee", to: "2026 Senior Boat Committee" },
            { name: "2027 Junior Escape Committee", to: "2027 Junior Escape Committee" },
          ],
        },
        { name: "Charter of the LSA", to: "Charter" },
        { name: "Director of Student Activities", to: "DSA" },
      ],
    },
    {
      id: 3,
      name: "ORGANIZATIONS",
      to: "/Organizations",
      icon: faUser,
      hasDropDown: true,
      bigSubLink: true,
      subLinks: [
        {
          name: "The Lowell (Journalism)",
          to: "https://thelowell.org/",
          directLink: true,
        },
        {
          name: "VIDEO LOWELL",
          to: "https://www.youtube.com/channel/UCQHQSnxqQIfYs8AjS8FXfvw",
          directLink: true,
        },
        {
          name: "CSF Tutoring",
          to: "https://lowellcsf.weebly.com/",
          directLink: true,
        },
        {
          name: "JROTC",
          to: "https://www.sfbrigade.org/home-of-the-cardinals.html",
          directLink: true,
        },
        {
          name: "Peer Resources",
          to: "https://lhspeermentoring.weebly.com/",
          directLink: true,
        },
        { name: "Mock Trial", to: "MockTrial" },
        {
          name: "Forensic Society (Speech & Debate)",
          to: "https://www.lowellspeechanddebate.org/",
          directLink: true,
        },
        {
          name: "Science Research Program",
          to: "https://sites.google.com/view/lowellscienceresearch/home?authuser=0",
          directLink: true,
        },
        {
          name: "CardinalBotics",
          to: "https://www.team4159.org/",
          directLink: true,
        },
        { name: "Shield and Scroll", to: "ShieldAndScroll" },
        {
          name: "Song",
          to: "http://www.lowellstudentassociation.org/song.html",
          directLink: true,
        },
        {
          name: "Student Advisory Council",
          to: "http://www.lowellstudentassociation.org/student-advisory-council.html",
          directLink: true,
        },
      ],
    },
    {
      id: 4,
      name: "CLUBS",
      to: "/Clubs",
      icon: faUsers,
      hasDropDown: true,
      bigSubLink: true,
      subLinks: buildClubsSubLinks(clubData),
    },
    {
      id: 5,
      name: "ELECTIONS",
      to: "/Elections",
      icon: faCheckToSlot,
      hasDropDown: true,
      subLinks: [
        { name: "SBC", to: "SBC" },
        { name: "LSA 2027", to: "LSA-2027" },
        { name: "LSA 2028", to: "LSA-2028" },
        { name: "LSA 2029", to: "LSA-2029" },
        { name: "LSA 2030", to: "LSA-2030" },
      ],
    },
    {
      id: 6,
      name: "RESOURCES",
      to: "/Resources",
      icon: faThumbTack,
      hasDropDown: true,
      subLinks: [
        {
          name: "Applications open",
          to: "/ApplicationsOpen",
          directLink: true,
        },
        { name: "Lowell Wellness Center", to: "Wellness" },
        { name: "Title IX Support", to: "TitleIX" },
      ],
    },
    {
      id: 7,
      name: "CARDINALYMPICS",
      to: "/Cardinalympics",
    },
    {
      id: 8,
      name: "MORE",
      to: "/More",
      hasDropDown: true,
      subLinks: [
        { name: "Events", to: "/Events", directLink: true },
        { name: "Announcements", to: "/Announcements", directLink: true },
        { name: "Archives", to: "/Archives", directLink: true },
        { name: "Freshmen Corner", to: "/FreshmenCorner", directLink: true },
      ],
    },
  ];
}

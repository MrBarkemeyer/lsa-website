// Elections: polling UI reads candidates from the Google Sheet tab "Elections" (same spreadsheet as Website Info)
// when `enabledElectionBoards` is non-empty. Columns A–G: Name, Grade, Board, Position, WrittenPetition,
// MediaPetition, VideoPetition. Leave `enabledElectionBoards` as [] to use only `contenders` below (manual / demo).

export default {
  // "pending" | "polling" | "results" — see src/utils/electionAccess.js for URL rules
  state: "polling",

  // Which Board values from the sheet to show (case-insensitive). Order = card order on /Elections.
  // Example sheet Board cell: "SBC". Add "2027" etc. when those rows exist in the sheet.
  enabledElectionBoards: ["SBC", "LSA-2027", "LSA-2028", "LSA-2029"],
  
  // Optional display + URL per Board value from the sheet (keys match the Board cell, case-insensitive).
  electionBoardMeta: {
    SBC: {
      slug: "SBC",
      title: "SBC Elections",
      color: "#9c1919",
    },
    "2026": {
      slug: "LSA-2026",
      title: "LSA-2026",
      color: "#9c1919",
    },
    "2027": {
      slug: "LSA-2027",
      title: "LSA-2027 Elections",
      color: "#1565c0",
    },
    "2028": {
      slug: "LSA-2028",
      title: "LSA-2028 Elections",
      color: "#6a1b9a",
    },
    "2029": {
      slug: "LSA-2029",
      title: "LSA-2029 Elections",
      color: "#2e7d32",
    },
  },

  // big banner when elections are happening (polling)
  banner: {
    enabled: true,
    title: "Elections in progress",
    message: "Make your voice heard - vote in LSA elections.",
    ctaText: "Vote now",
    ctaPath: "/Elections",
  },

  // top info bar in layout (shown when state is "results")
  pollingBar: {
    enabled: true,
    message: "Election results are now available.",
    resultsLabel: "View results",
    resultsPath: "/Elections/Results",
  },

  // when elections are off site-wide - message on the Elections page
  notHappeningMessage: "Elections are not currently happening. Check back later for updates.",

  // pending = before the election/campaign phase starts
  pendingTitle: "Elections are coming soon",
  pendingSubtitle: "Please stay tuned for updates.",

  // polling = candidate boards + voting; title + subtitle on /Elections
  pollingTitle: "Elections - vote now",
  pollingSubtitle: "Polls are open. Cast your vote below.",
  // toggle "VOTE NOW" button on candidate cards (/Elections/:slug)
  showVoteNowButtons: false,

  // Used only when `enabledElectionBoards` is empty. Each group: slug, board (title), color, roles[{ role, candidates[{ name, description, pfp, video }] }].
  contenders: [],
};

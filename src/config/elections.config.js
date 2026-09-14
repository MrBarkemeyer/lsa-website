// Elections: polling UI reads candidates from the Google Sheet tab "Elections" (same spreadsheet as Website Info)
// when `enabledElectionBoards` is non-empty. Columns A-G: Name, Grade, Board, Position, WrittenPetition,
// MediaPetition, VideoPetition. Leave `enabledElectionBoards` as [] to use only `contenders` below (manual / demo).

export default {
  // "pending" | "polling" | "results" — see src/utils/electionAccess.js for URL rules
  state: "pending",

  // Which Board values from the sheet to show (case-insensitive). Order = card order on /Elections.
  // Example sheet Board cell: "SBC". Add "2027" etc. when those rows exist in the sheet.
  enabledElectionBoards: ["LSA-2030"],
  
  // Optional display + URL per Board value from the sheet (keys match the Board cell, case-insensitive).
  electionBoardMeta: {
    SBC: {
      slug: "SBC",
      title: "SBC Elections",
      color: "#9c1919",
    },
    "2027": {
      slug: "LSA-2027",
      title: "LSA-2027 Elections",
      color: "#9c1919",
    },
    "2028": {
      slug: "LSA-2028",
      title: "LSA-2028 Elections",
      color: "#1565c0",
    },
    "2029": {
      slug: "LSA-2029",
      title: "LSA-2029 Elections",
      color: "#6a1b9a",
    },
    "2030": {
      slug: "LSA-2030",
      title: "LSA-2030 Elections",
      color: "#2e7d32",
    },
  },

  // Site-wide banner during pending or polling — before votingOpensAt (if set)
  banner: {
    enabled: true,
    title: "Freshman Board elections coming soon",
    message: "This election is for the Class of 2030 freshman board.",
    ctaText: "Learn more",
    ctaPath: "/LSA",
  },

  // After voting opens (votingOpensAt passed, or form live with no schedule): home banner copy
  votingLiveBannerTitle: "Vote now — LSA elections",
  votingLiveBannerMessage:
    "Polls are open. Check your school email for the Google Form link to cast your ballot.",

  // When state is "results" and results are live: same red banner as voting-live (see ElectionBanner).
  // `pollingBar.message` is used as fallback body if `resultsBannerMessage` is empty (e.g. sheet merge).
  resultsBannerTitle: "Election results — LSA elections",
  resultsBannerMessage:
    "Full counts are posted. Open the Elections page to see results for each board and position.",

  // Enables the results banner + optional CTA when state is "results" (Layout, Home, under hero on results page).
  pollingBar: {
    enabled: true,
    message: "Election results are now available.",
    resultsLabel: "View results",
    resultsPath: "/Elections/Results",
  },

  // when elections are off site-wide - message on the Elections page
  notHappeningMessage: "Elections are not currently happening. Check back later for updates.",

  // pending = before the election/campaign phase starts
  pendingTitle: "Freshman Board elections are coming soon",
  pendingSubtitle: "This election is for the Class of 2030 freshman board.",
  // Shown on /Elections and in the site banner. Example: "Thursday, September 24, 2026"
  pendingDate: "",

  // polling = candidate boards; title + subtitle on /Elections before voting opens
  pollingTitle: "Elections",
  pollingSubtitle: "Browse each board to learn about the candidates. Voting opens at the time below.",

  // After voting opens: replaces polling title + subtitle on /Elections (and a line under board hero)
  votingLivePollingTitle: "Vote now",
  votingLivePollingSubtitle:
    "Polls are open. Check your school email for the Google Form link to cast your ballot.",

  // Google Form URL for optional in-app links (e.g. candidate card). Email is primary per votingLive copy.
  votingFormUrl: "",
  voteButtonText: "Open voting form",

  // When `state` is "results", tables stay hidden until this instant (visitor's browser clock vs ISO time).
  // Empty = show results as soon as state is "results". Use timezone offset so "today 3:45 PM" is unambiguous.
  // Example same-day 3:45 PM Pacific: "2026-05-01T15:45:00-07:00"
  resultsReleaseAt: "2026-05-01T15:42:00-07:00",

  // Copy on /Elections/Results before `resultsReleaseAt` (when state is already "results").
  resultsPendingTitle: "Results go live soon",
  resultsPendingSubtitle: "", // empty = default line with formatted date/time below

  // When set (ISO 8601), vote links stay disabled until this local instant. Empty = active whenever votingFormUrl is set.
  // Example: "2026-04-27T10:20:00-07:00"
  votingOpensAt: "2026-04-27T10:20:00-07:00", // 10:20 AM PDT

  // Unused for vote links; presence of votingFormUrl controls vote CTAs. Kept for older references.
  showVoteNowButtons: false,

  // Used only when `enabledElectionBoards` is empty. Each group: slug, board (title), color, roles[{ role, candidates[{ name, description, pfp, video }] }].
  contenders: [],
};

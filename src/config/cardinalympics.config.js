/**
 * Toggle Cardinalympics features without code changes in page components.
 * - showScoresAndScoreboard: class spirit totals, detailed scoreboard table, and the Home page scores widget.
 * - showScoreBreakdown: detailed scoreboard table on /Cardinalympics.
 * - showWinningChances: "Projected winning chances" bars below the detailed scoreboard.
 * - showEvents: sheet-driven event cards on /Cardinalympics (Cardinalympics Events tab).
 * - showHomeEventsSignupNow: Home page "Cardinalympics events sign up now" section.
 * - displayMode: "activeGame" shows "Leading" on the top class and projected winning chances; "results"
 *   (or "result") shows "Winner" and hides projected winning chances (toggle + bars).
 *   A complete scoreboard also switches to winner mode: every dated event on the Google
 *   Sheet has all four class scores filled in (0 counts; cancelled events count as done).
 */
export default {
  showScoresAndScoreboard: true,
  showScoreBreakdown: true,
  showWinningChances: true,
  showEvents: true,
  showHomeEventsSignupNow: true,
  displayMode: "results",
};

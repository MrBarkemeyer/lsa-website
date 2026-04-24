// Homepage club spotlight: cycles through the Website Info sheet top-to-bottom (API row order).

/** Clubs with a name, in the same order as the Google Sheet rows (after the header). */
export function getClubsInSheetOrder(clubData) {
  if (!Array.isArray(clubData)) return [];
  return clubData.filter((row) => row?.Name && String(row.Name).trim());
}

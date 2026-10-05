// Homepage club spotlight: one club per day. Each cycle shuffles the sheet
// roster so every club appears once before any club repeats.

/** Clubs with a name, in the same order as the Google Sheet rows (after the header). */
export function getClubsInSheetOrder(clubData) {
  if (!Array.isArray(clubData)) return [];
  return clubData.filter((row) => row?.Name && String(row.Name).trim());
}

/** Deterministic PRNG (mulberry32) so all visitors see the same club each day. */
function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shuffleWithSeed(items, seed) {
  const arr = items.slice();
  const random = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function cycleSeed(cycleIndex, pool) {
  const names = pool.map((club) => String(club.Name).trim()).join("|");
  return (cycleIndex * 2654435761 + hashString(names) + pool.length * 97) >>> 0;
}

/**
 * Pick today's spotlight club. Within each cycle of `pool.length` days, every
 * club appears exactly once (shuffled order). The next cycle reshuffles.
 */
export function getSpotlightClubForDay(clubData, dayIndex) {
  const pool = getClubsInSheetOrder(clubData);
  if (!pool.length) return null;

  const cycleIndex = Math.floor(dayIndex / pool.length);
  const offsetInCycle = dayIndex % pool.length;
  const shuffled = shuffleWithSeed(pool, cycleSeed(cycleIndex, pool));
  return shuffled[offsetInCycle];
}

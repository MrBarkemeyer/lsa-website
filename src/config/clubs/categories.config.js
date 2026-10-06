// club categories + colors for filters and badges (Clubs page + nav)
export const clubCategories = [
  { name: "Sports", color: "#c62828" },
  { name: "VPA", color: "#6a1b9a" },
  { name: "Volunteering and Public Service", color: "#2e7d32" },
  { name: "Culture/Religion", color: "#ef6c00" },
  { name: "Finance", color: "#c9a227" },
  { name: "Food/Crafts", color: "#795548" },
  { name: "Games and Fantasy", color: "#1565c0" },
  { name: "Literature and Media", color: "#00838f" },
  { name: "Politics and Public Speaking", color: "#ad1457" },
  { name: "Visual and Performing Arts Club", color: "#8e24aa" },
  { name: "Health and Environmental", color: "#558b2f" },
  { name: "STEM", color: "#00695c" },
];

// Distinct palette for any category not listed above (sheet names vary)
const EXTRA_CATEGORY_COLORS = [
  "#283593",
  "#d84315",
  "#00897b",
  "#5e35b1",
  "#f9a825",
  "#4527a0",
  "#0277bd",
  "#6d4c41",
  "#c2185b",
  "#37474f",
  "#7b1fa2",
  "#0097a7",
];

// turns category list into a name -> color map (old code still uses this unforunately)
export function getCategoryColorMap() {
  return Object.fromEntries(clubCategories.map((c) => [c.name, c.color]));
}

/**
 * Build a color map for every category present in the data.
 * Known categories keep their configured color; others get unique extras.
 */
export function buildCategoryColorMap(categories = []) {
  const map = getCategoryColorMap();
  const used = new Set(Object.values(map).map((c) => c.toLowerCase()));
  let extraIndex = 0;

  for (const category of categories) {
    if (!category || map[category]) continue;

    while (
      extraIndex < EXTRA_CATEGORY_COLORS.length &&
      used.has(EXTRA_CATEGORY_COLORS[extraIndex].toLowerCase())
    ) {
      extraIndex += 1;
    }

    const color =
      EXTRA_CATEGORY_COLORS[extraIndex] ||
      `hsl(${(extraIndex * 47) % 360} 55% 38%)`;
    extraIndex += 1;
    map[category] = color;
    used.add(color.toLowerCase());
  }

  return map;
}

export default clubCategories;

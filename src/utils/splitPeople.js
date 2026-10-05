/**
 * Split a free-text people field into { name, role } entries.
 * Supports comma / semicolon / newline / "and" separators and "Name (Role)".
 */
export function splitPeople(value, fallbackRole) {
  return String(value || "")
    .split(/\s*(?:,|;|\n|\band\b)\s*/i)
    .map((part) => {
      const trimmed = part.trim();
      const paren = trimmed.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
      const name = (paren ? paren[1] : trimmed).trim();
      const role = (paren ? paren[2] : fallbackRole).trim();
      return { name, role };
    })
    .filter((person) => {
      const words = person.name.split(/\s+/).filter(Boolean);
      if (words.length === 0 || words.length > 5) return false;
      if (/^(n\/?a|none|tbd|unknown|-+)$/i.test(person.name)) return false;
      return /[a-z]/i.test(person.name);
    });
}

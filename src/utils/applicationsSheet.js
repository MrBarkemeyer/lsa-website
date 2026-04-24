/**
 * Shared parsing for the Google Sheet behind "applications open" (clubs/orgs).
 */

export const STATUS_OPEN_VALUES = ["open", "applications open", "active"];

function getByKey(row, ...possibleKeys) {
  const keys = Object.keys(row || {});
  for (const want of possibleKeys) {
    const found = keys.find(
      (k) => String(k).trim().toLowerCase() === want.toLowerCase()
    );
    if (found && row[found] != null && String(row[found]).trim() !== "") {
      return String(row[found]).trim();
    }
    if (row[want] != null && String(row[want]).trim() !== "") {
      return String(row[want]).trim();
    }
  }
  return "";
}

export function normalizeApplicationRow(row) {
  if (!row || typeof row !== "object") return null;
  const name =
    getByKey(row, "Name of Org/Club", "Name", "name") ||
    (row["Name of Org/Club"] ?? row["Name"] ?? row["name"] ?? "");
  const statusRaw =
    getByKey(row, "Status", "status") || (row["Status"] ?? row["status"] ?? "");
  const status = String(statusRaw).trim().toLowerCase();
  const dateAdded =
    getByKey(row, "Date Added", "dateAdded") ||
    (row["Date Added"] ?? row["dateAdded"] ?? "");
  const notes =
    getByKey(row, "Notes", "notes") || (row["Notes"] ?? row["notes"] ?? "");
  const link =
    getByKey(row, "Application URL", "Link", "Application Link", "link") ||
    (row["Application URL"] ??
      row["Link"] ??
      row["Application Link"] ??
      row["link"] ??
      "");
  return { name, status, dateAdded, notes, link };
}

export function isApplicationOpen(row) {
  return STATUS_OPEN_VALUES.includes(row.status);
}

/** Skip header echo rows and blank names */
export function isLikelyDataRow(row) {
  if (!row?.name || typeof row.name !== "string") return false;
  const n = row.name.trim();
  if (!n) return false;
  if (n === "Name of Org/Club") return false;
  if (/^name of org\/club$/i.test(n)) return false;
  return true;
}

export function parseDateAdded(str) {
  if (!str) return 0;
  const parts = String(str).trim().split(/[/-]/);
  if (parts.length >= 3) {
    const m = parseInt(parts[0], 10);
    const d = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if (!Number.isNaN(m) && !Number.isNaN(d) && !Number.isNaN(y)) {
      return new Date(y, m - 1, d).getTime();
    }
  }
  const t = new Date(str).getTime();
  return Number.isNaN(t) ? 0 : t;
}

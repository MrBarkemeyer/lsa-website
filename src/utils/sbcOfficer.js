/** Name of an SBC officer for a sheet Role, or "" if that seat is empty. */
export function sbcOfficerName(officers, role) {
  const wanted = String(role || "")
    .trim()
    .toLowerCase();
  if (!wanted) return "";
  const match = (officers || []).find(
    (officer) =>
      String(officer?.Team || "")
        .trim()
        .toLowerCase() === "sbc" &&
      String(officer?.Role || "")
        .trim()
        .toLowerCase() === wanted,
  );
  return String(match?.Name || "").trim();
}

export function extractDriveFileId(urlRaw) {
  const url = String(urlRaw ?? "").trim();
  if (!url) return "";

  // Common Drive forms:
  // - .../file/d/<id>/view
  // - .../file/u/4/d/<id>/view
  // - ...open?id=<id>
  // - ...uc?export=view&id=<id>
  const fromPath = url.match(/\/file\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/);
  if (fromPath?.[1]) return fromPath[1];

  const fromQuery = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (fromQuery?.[1]) return fromQuery[1];

  // "Open image in new tab" / some share flows use lh3 host (file id before = or end of path)
  const fromLh3 = url.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/i);
  if (fromLh3?.[1]) return fromLh3[1];

  return "";
}

export function driveThumbnailCandidates(urlRaw, size = "w600") {
  const url = String(urlRaw ?? "").trim();
  if (!url) return [];

  const id = extractDriveFileId(url);
  const candidates = [];
  if (id) {
    candidates.push(
      `https://drive.google.com/thumbnail?id=${id}&sz=${size}`,
      `https://drive.google.com/uc?export=view&id=${id}`,
      `https://lh3.googleusercontent.com/d/${id}=${size}`
    );
  }

  // Non-Drive URL, or last resort: try the cell value as-is (some schools host images elsewhere)
  if (/^https?:\/\//i.test(url) && !candidates.includes(url)) {
    candidates.push(url);
  }

  return candidates;
}

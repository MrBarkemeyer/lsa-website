// Parse the "Elections" tab (columns A–G): Name, Grade, Board, Position, WrittenPetition, MediaPetition, VideoPetition.
// Build `contenders` for polling when `enabledElectionBoards` is set in elections.config.js.

const FIELD_KEYS = [
  "name",
  "grade",
  "board",
  "position",
  "writtenPetition",
  "mediaPetition",
  "videoPetition",
];

// output keys must match FIELD_KEYS / rowToCandidate
const HEADER_ALIASES = {
  name: ["name"],
  grade: ["grade"],
  board: ["board"],
  position: ["position"],
  writtenPetition: ["writtenpetition"],
  mediaPetition: ["mediapetition"],
  videoPetition: ["videopetition"],
};

function normHeader(h) {
  return String(h ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function cellStr(row, index) {
  if (index == null || index < 0) return "";
  const v = row[index];
  return v != null ? String(v).trim() : "";
}

/** Map header row to field -> column index; fall back to A–G order when headers don't match. */
function buildColumnIndexMap(headerRow) {
  const map = {};
  if (!headerRow || headerRow.length === 0) {
    FIELD_KEYS.forEach((key, i) => {
      map[key] = i;
    });
    return map;
  }

  const normalizedHeaders = headerRow.map((h) => normHeader(h));

  for (const [fieldKey, aliases] of Object.entries(HEADER_ALIASES)) {
    const fieldNorm = normHeader(fieldKey);
    let idx = normalizedHeaders.findIndex((h) => h === fieldNorm);
    if (idx < 0) {
      for (const a of aliases) {
        const an = normHeader(a);
        idx = normalizedHeaders.findIndex((h) => h === an);
        if (idx >= 0) break;
      }
    }
    if (idx >= 0) map[fieldKey] = idx;
  }

  const mapped = ["name", "grade", "board", "position"].every((k) => map[k] != null);
  if (!mapped && headerRow.length >= 5) {
    FIELD_KEYS.forEach((key, i) => {
      if (map[key] == null) map[key] = i;
    });
  }

  return map;
}

function rowToCandidate(row, col) {
  const name = cellStr(row, col.name);
  const board = cellStr(row, col.board);
  const position = cellStr(row, col.position);
  if (!name || !board || !position) return null;

  const written = cellStr(row, col.writtenPetition);
  const media = cellStr(row, col.mediaPetition);
  const video = cellStr(row, col.videoPetition);

  return {
    name,
    grade: cellStr(row, col.grade),
    board,
    position,
    writtenPetition: written,
    mediaPetition: media,
    videoPetition: video,
  };
}

function normalizeBoardKey(boardRaw, gradeRaw = "") {
  const board = String(boardRaw ?? "").trim();
  const grade = String(gradeRaw ?? "").trim();
  if (!board) return "";
  if (/^lsa$/i.test(board) && /^\d{4}$/.test(grade)) {
    return `LSA-${grade}`;
  }
  return board;
}

function extractGoogleDriveFileId(urlRaw) {
  const url = String(urlRaw ?? "").trim();
  if (!url) return "";
  const isDriveUrl = /(^https?:\/\/)?(drive|docs)\.google\.com\//i.test(url);
  if (!isDriveUrl) return "";
  const fromPath = url.match(/\/file\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/);
  if (fromPath?.[1]) return fromPath[1];
  const fromOpen = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (fromOpen?.[1]) return fromOpen[1];
  const fromUc = url.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (fromUc?.[1]) return fromUc[1];
  return "";
}

function toMediaUrl(urlRaw) {
  const url = String(urlRaw ?? "").trim();
  if (!url) return "";
  // Keep original URL; view-layer handles multiple Drive fallback formats.
  return url;
}

function toVideoUrl(urlRaw) {
  const url = String(urlRaw ?? "").trim();
  if (!url) return "";
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
}

export function parseElectionCandidateRows(values) {
  if (!values || values.length < 2) return [];
  const col = buildColumnIndexMap(values[0]);
  if (col.name == null || col.board == null || col.position == null) return [];

  const out = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!Array.isArray(row)) continue;
    const c = rowToCandidate(row, col);
    if (c) out.push(c);
  }
  return out;
}

export function slugifyBoard(board) {
  return String(board ?? "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");
}

function metaForBoard(meta, ...boardCandidates) {
  if (!meta || typeof meta !== "object") return {};
  const keys = Object.keys(meta);
  for (const candidate of boardCandidates) {
    const lower = String(candidate ?? "").trim().toLowerCase();
    if (!lower) continue;
    const key = keys.find((k) => k.trim().toLowerCase() === lower);
    if (key != null) return meta[key] || {};
  }
  return {};
}

function boardEnabled(boardRaw, enabledList) {
  const b = String(boardRaw).trim().toLowerCase();
  return enabledList.some((e) => String(e).trim().toLowerCase() === b);
}

/**
 * When `config.enabledElectionBoards` is a non-empty array, contenders are built only from the sheet
 * (filtered by Board). Order follows `enabledElectionBoards`. Otherwise returns `config` unchanged.
 */
export function mergeElectionConfigWithSheet(config, values) {
  const enabled = config?.enabledElectionBoards;
  if (!Array.isArray(enabled) || enabled.length === 0) {
    return config;
  }

  const candidates = parseElectionCandidateRows(values);
  const metaRoot = config.electionBoardMeta || {};

  const contenders = [];

  for (const enabledKey of enabled) {
    const rows = candidates.filter((r) =>
      boardEnabled(normalizeBoardKey(r.board, r.grade), [enabledKey])
    );
    if (rows.length === 0) continue;

    const sampleBoard = rows[0].board;
    const normalizedBoard = normalizeBoardKey(rows[0].board, rows[0].grade);
    const sampleGrade = String(rows[0].grade ?? "").trim();
    const meta = metaForBoard(metaRoot, enabledKey, normalizedBoard, sampleBoard, sampleGrade);
    const slug = (meta.slug && String(meta.slug).trim()) || slugifyBoard(normalizedBoard) || slugifyBoard(enabledKey);
    const title = (meta.title && String(meta.title).trim()) || `${String(normalizedBoard).trim()} Elections`;
    const color = meta.color;

    const positionOrder = [];
    const byPosition = new Map();
    for (const r of rows) {
      const pos = r.position;
      if (!byPosition.has(pos)) {
        byPosition.set(pos, []);
        positionOrder.push(pos);
      }
      const pfp =
        toMediaUrl(r.mediaPetition) ||
        `https://i.pravatar.cc/400?u=${encodeURIComponent(r.name)}`;
      const video = toVideoUrl(r.videoPetition);
      console.log("[Elections Candidate Media]", {
        candidate: r.name,
        board: normalizedBoard,
        imageSource: pfp,
      });
      byPosition.get(pos).push({
        name: r.name,
        description: r.writtenPetition || "",
        pfp,
        video,
      });
    }

    const roles = positionOrder.map((role) => ({
      role,
      candidates: byPosition.get(role) || [],
    }));

    contenders.push({
      slug,
      board: title,
      color,
      roles,
    });
  }

  return { ...config, contenders };
}

/** True if the sheet's first row looks like candidate rows (Name + Board + Position). */
export function isElectionCandidateSheetFormat(values) {
  if (!values?.length) return false;
  const lc = (values[0] || []).map((h) => normHeader(h));
  const has = (s) => lc.includes(normHeader(s));
  return has("name") && has("board") && has("position");
}

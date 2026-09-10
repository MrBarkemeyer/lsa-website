export function parseAnnouncementDate(input) {
  if (!input) return null;
  const value = String(input).trim();
  const mdy = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);

  if (mdy) {
    const month = parseInt(mdy[1], 10) - 1;
    const day = parseInt(mdy[2], 10);
    let year = parseInt(mdy[3], 10);
    if (year < 100) year += 2000;
    const date = new Date(year, month, day);
    if (!Number.isNaN(date.getTime())) return date;
  }

  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) return new Date(parsed);

  const monthYear = value.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!monthYear) return null;
  const parsedMonth = Date.parse(`${monthYear[1]} 1, ${monthYear[2]}`);
  return Number.isNaN(parsedMonth) ? null : new Date(parsedMonth);
}

export function announcementMonthValue(input) {
  const date = parseAnnouncementDate(input);
  if (!date) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function parseAnnouncementsSheet(values) {
  if (!Array.isArray(values) || values.length < 2) return [];

  const headers = values[0].map((header) => String(header || "").trim().toLowerCase());
  const normalizedHeaders = headers.map((header) =>
    header.replace(/\([^)]*\)/g, "").replace(/[^a-z0-9]/g, "")
  );
  let titleIndex = headers.findIndex(
    (header) => header === "name" || header === "title" || header === "event name"
  );
  if (titleIndex < 0) {
    titleIndex = normalizedHeaders.findIndex((header) => header === "eventname");
  }
  if (titleIndex < 0) titleIndex = 0;

  let dateIndex = headers.findIndex(
    (header) => header === "date (mm/dd/yy)" || header.includes("mm/dd/yy")
  );
  if (dateIndex < 0) {
    dateIndex = headers.findIndex((header) => header === "year" || header === "date");
  }
  const contentIndex = headers.findIndex(
    (header) => header === "description" || header === "content"
  );
  if (contentIndex < 0) return [];

  return values.slice(1).reduce((announcements, row, rowIndex) => {
    const item = {
      id: `${String(row?.[titleIndex] ?? "").trim()}-${String(
        row?.[dateIndex] ?? ""
      ).trim()}-${rowIndex}`,
      title: String(row?.[titleIndex] ?? "").trim(),
      date: String(row?.[dateIndex] ?? "").trim() || "Unknown",
      content: String(row?.[contentIndex] ?? "").trim(),
    };
    if (item.title && item.content) announcements.push(item);
    return announcements;
  }, []).sort((a, b) => {
      const aDate = parseAnnouncementDate(a.date);
      const bDate = parseAnnouncementDate(b.date);
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return bDate.getTime() - aDate.getTime();
  });
}

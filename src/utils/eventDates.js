/** First and last calendar day in strings like "8/11/2025" or "10/6/2025-10/10/2025". */
export function eventRange(dateStr) {
  const dates = String(dateStr || "")
    .split(/,|-|—|-/)
    .map((part) => {
      const match = part.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!match) return null;
      const date = new Date(
        Number(match[3]),
        Number(match[1]) - 1,
        Number(match[2]),
      );
      return Number.isNaN(date.getTime()) ? null : date;
    })
    .filter(Boolean)
    .sort((a, b) => a - b);

  if (!dates.length) return null;
  return { start: dates[0], end: dates[dates.length - 1] };
}

export function isEventPast(dateStr, today = new Date()) {
  const range = eventRange(dateStr);
  if (!range) return false;
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return range.end < todayStart;
}

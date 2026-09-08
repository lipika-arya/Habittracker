// Dates are represented as "YYYY-MM-DD" strings throughout the app (local
// calendar days, not UTC). Because that format sorts and compares
// lexicographically the same way it compares chronologically, plain string
// comparison is safe for equality/ordering — no Date parsing needed for that.

export function todayISO() {
  return toISO(new Date());
}

// Format a Date object as a local "YYYY-MM-DD" string.
export function toISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Parse a "YYYY-MM-DD" string into a local midnight Date. Using local
// midnight (rather than `new Date(isoString)`, which parses as UTC) keeps
// this consistent with todayISO()/toISO() above and avoids off-by-one bugs
// in timezones behind UTC.
export function parseISO(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Add (or subtract, with a negative amount) whole days to an ISO date string.
export function addDays(isoDate, amount) {
  const date = parseISO(isoDate);
  date.setDate(date.getDate() + amount);
  return toISO(date);
}

// Whole-day difference between two ISO date strings (to - from). Rounded to
// guard against DST days that are 23 or 25 hours long.
export function diffInDays(fromISO, toDateISO) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const from = parseISO(fromISO);
  const to = parseISO(toDateISO);
  return Math.round((to.getTime() - from.getTime()) / msPerDay);
}

// True if `isoDate` is strictly after `referenceISO` (defaults to today).
export function isFutureDate(isoDate, referenceISO = todayISO()) {
  return isoDate > referenceISO;
}

// True if `nextISO` is exactly one calendar day after `previousISO`.
export function isConsecutiveDay(previousISO, nextISO) {
  return diffInDays(previousISO, nextISO) === 1;
}

// Day of week for an ISO date string: 0 = Sunday ... 6 = Saturday.
export function getDayOfWeek(isoDate) {
  return parseISO(isoDate).getDay();
}

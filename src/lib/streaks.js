// Pure, reusable streak/statistics calculations for a habit.
//
// A habit's check-ins are stored as an array of "YYYY-MM-DD" strings
// (see src/lib/storage.js). These functions never touch localStorage or
// React state — they take plain data in and return plain data out — so
// they can be unit tested in isolation and reused anywhere (components,
// future dashboards, etc).
//
// Every function accepts an optional `referenceISO` (defaults to today)
// so callers/tests can pin "today" to a fixed date instead of depending on
// the real clock.

import { addDays, diffInDays, isConsecutiveDay, isFutureDate, todayISO } from "./dates.js";

// De-duplicates, drops any dates in the future relative to `referenceISO`,
// and returns the remaining check-in dates sorted ascending.
export function getValidSortedCheckIns(checkIns, referenceISO = todayISO()) {
  if (!Array.isArray(checkIns)) return [];
  const unique = new Set(
    checkIns.filter((date) => typeof date === "string" && !isFutureDate(date, referenceISO)),
  );
  return Array.from(unique).sort();
}

// The current streak, counted back from `referenceISO` ("today"):
// - If today was completed, the streak includes today.
// - If today was NOT completed but yesterday was, the streak still counts
//   the consecutive run ending yesterday (a day isn't "missed" until it's
//   over).
// - If the most recent completion is any older than yesterday, the streak
//   has been broken by a gap, so the current streak is 0.
export function calculateCurrentStreak(checkIns, referenceISO = todayISO()) {
  const dates = getValidSortedCheckIns(checkIns, referenceISO);
  if (dates.length === 0) return 0;

  const mostRecent = dates[dates.length - 1];
  const yesterday = addDays(referenceISO, -1);

  if (mostRecent !== referenceISO && mostRecent !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = dates.length - 1; i > 0; i--) {
    if (isConsecutiveDay(dates[i - 1], dates[i])) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

// The longest run of consecutive completed days anywhere in the habit's
// history (not just the streak leading up to today).
export function calculateBestStreak(checkIns, referenceISO = todayISO()) {
  const dates = getValidSortedCheckIns(checkIns, referenceISO);
  if (dates.length === 0) return 0;

  let best = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    current = isConsecutiveDay(dates[i - 1], dates[i]) ? current + 1 : 1;
    if (current > best) best = current;
  }
  return best;
}

// Total number of distinct days completed (duplicates and future dates
// already excluded).
export function calculateTotalCompletedDays(checkIns, referenceISO = todayISO()) {
  return getValidSortedCheckIns(checkIns, referenceISO).length;
}

// Completed days as a fraction (0..1) of days elapsed since the habit was
// created, inclusive of both the creation day and today.
export function calculateCompletionRate(checkIns, createdAt, referenceISO = todayISO()) {
  const totalCompleted = calculateTotalCompletedDays(checkIns, referenceISO);
  const daysSinceCreation = Math.max(1, diffInDays(createdAt, referenceISO) + 1);
  const rate = totalCompleted / daysSinceCreation;
  return Math.min(1, rate);
}

// Convenience bundle of all four stats for a single habit object
// ({ createdAt, checkIns }).
export function getHabitStats(habit, referenceISO = todayISO()) {
  const checkIns = habit?.checkIns ?? [];
  const createdAt = habit?.createdAt ?? referenceISO;
  return {
    currentStreak: calculateCurrentStreak(checkIns, referenceISO),
    bestStreak: calculateBestStreak(checkIns, referenceISO),
    totalCompletedDays: calculateTotalCompletedDays(checkIns, referenceISO),
    completionRate: calculateCompletionRate(checkIns, createdAt, referenceISO),
  };
}

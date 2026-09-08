// Pure, reusable streak/statistics calculations for a habit.
//
// A habit's check-ins are stored as an array of "YYYY-MM-DD" strings
// (see src/lib/storage.js). These functions never touch localStorage or
// React state — they take plain data in and return plain data out — so
// they can be unit tested in isolation and reused anywhere (components,
// future dashboards, etc).
//
// A habit also carries a `frequency` (see src/lib/frequency.js). Days the
// habit isn't scheduled for are transparent to streak math: they never
// break a streak and never count against completion rate. For the default
// daily frequency this reduces to plain consecutive-calendar-day counting.
//
// Every function accepts an optional `referenceISO` (defaults to today)
// so callers/tests can pin "today" to a fixed date instead of depending on
// the real clock.

import { addDays, isFutureDate, todayISO } from "./dates.js";
import { DAILY_FREQUENCY, isScheduledDay } from "./frequency.js";

// De-duplicates, drops any dates in the future relative to `referenceISO`,
// and returns the remaining check-in dates sorted ascending.
export function getValidSortedCheckIns(checkIns, referenceISO = todayISO()) {
  if (!Array.isArray(checkIns)) return [];
  const unique = new Set(
    checkIns.filter((date) => typeof date === "string" && !isFutureDate(date, referenceISO)),
  );
  return Array.from(unique).sort();
}

// The current streak, counted back from `referenceISO` ("today") through
// scheduled days only:
// - If today is scheduled but not yet completed, it's given a grace period
//   (a day isn't "missed" until it's over) and skipped without breaking
//   the streak.
// - Any other scheduled day that's missing a check-in stops the count.
// - Non-scheduled days are skipped entirely — they neither extend nor
//   break the streak.
export function calculateCurrentStreak(checkIns, frequency = DAILY_FREQUENCY, referenceISO = todayISO()) {
  const dates = getValidSortedCheckIns(checkIns, referenceISO);
  if (dates.length === 0) return 0;

  const doneSet = new Set(dates);
  const earliest = dates[0];

  let streak = 0;
  let cursor = referenceISO;
  let isToday = true;

  while (cursor >= earliest) {
    if (isScheduledDay(frequency, cursor)) {
      if (doneSet.has(cursor)) {
        streak += 1;
      } else if (isToday) {
        // Grace period: today isn't over yet.
      } else {
        break;
      }
    }
    isToday = false;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

// The longest run of consecutive completed *scheduled* days anywhere in
// the habit's history (not just the streak leading up to today).
export function calculateBestStreak(checkIns, frequency = DAILY_FREQUENCY, referenceISO = todayISO()) {
  const dates = getValidSortedCheckIns(checkIns, referenceISO);
  if (dates.length === 0) return 0;

  const doneSet = new Set(dates);
  let best = 0;
  let current = 0;
  let cursor = dates[0];

  while (cursor <= referenceISO) {
    if (isScheduledDay(frequency, cursor)) {
      current = doneSet.has(cursor) ? current + 1 : 0;
      if (current > best) best = current;
    }
    cursor = addDays(cursor, 1);
  }
  return best;
}

// Total number of distinct days completed (duplicates and future dates
// already excluded).
export function calculateTotalCompletedDays(checkIns, referenceISO = todayISO()) {
  return getValidSortedCheckIns(checkIns, referenceISO).length;
}

// Number of scheduled days between `fromISO` and `toISO`, inclusive.
export function countScheduledDays(frequency, fromISO, toISO) {
  let count = 0;
  let cursor = fromISO;
  while (cursor <= toISO) {
    if (isScheduledDay(frequency, cursor)) count += 1;
    cursor = addDays(cursor, 1);
  }
  return count;
}

// Completed days as a fraction (0..1) of scheduled days elapsed since the
// habit was created, inclusive of both the creation day and today.
export function calculateCompletionRate(checkIns, createdAt, frequency = DAILY_FREQUENCY, referenceISO = todayISO()) {
  const totalCompleted = calculateTotalCompletedDays(checkIns, referenceISO);
  const scheduledElapsed = Math.max(1, countScheduledDays(frequency, createdAt, referenceISO));
  const rate = totalCompleted / scheduledElapsed;
  return Math.min(1, rate);
}

// True when a habit has an active streak that will break if it isn't
// completed before `referenceISO` ("today") ends: today is a scheduled
// day, there's a nonzero current streak (relying on the grace period
// described above), but today itself isn't checked in yet.
export function isStreakAtRisk(checkIns, frequency = DAILY_FREQUENCY, referenceISO = todayISO()) {
  if (!isScheduledDay(frequency, referenceISO)) return false;
  const streak = calculateCurrentStreak(checkIns, frequency, referenceISO);
  if (streak === 0) return false;
  const dates = getValidSortedCheckIns(checkIns, referenceISO);
  return !dates.includes(referenceISO);
}

// Convenience bundle of all stats for a single habit object
// ({ createdAt, checkIns, frequency }).
export function getHabitStats(habit, referenceISO = todayISO()) {
  const checkIns = habit?.checkIns ?? [];
  const createdAt = habit?.createdAt ?? referenceISO;
  const frequency = habit?.frequency ?? DAILY_FREQUENCY;
  return {
    currentStreak: calculateCurrentStreak(checkIns, frequency, referenceISO),
    bestStreak: calculateBestStreak(checkIns, frequency, referenceISO),
    totalCompletedDays: calculateTotalCompletedDays(checkIns, referenceISO),
    completionRate: calculateCompletionRate(checkIns, createdAt, frequency, referenceISO),
    atRisk: isStreakAtRisk(checkIns, frequency, referenceISO),
  };
}

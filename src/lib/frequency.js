// A habit's frequency controls which calendar days it's "on the schedule"
// for. Two shapes:
//   { type: "daily" }                 — scheduled every day (the default)
//   { type: "custom", days: [0..6] }  — scheduled only on these weekdays
//                                        (0 = Sunday ... 6 = Saturday)
//
// Streak/completion math in streaks.js treats non-scheduled days as
// transparent: they never break a streak and never count against
// completion rate.

import { getDayOfWeek } from "./dates.js";

export const DAILY_FREQUENCY = { type: "daily" };

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export function isScheduledDay(frequency, isoDate) {
  if (!frequency || frequency.type !== "custom") return true;
  const days = frequency.days ?? [];
  if (days.length === 0 || days.length === 7) return true;
  return days.includes(getDayOfWeek(isoDate));
}

export function normalizeFrequency(days) {
  if (!Array.isArray(days) || days.length === 0 || days.length === 7) {
    return DAILY_FREQUENCY;
  }
  return { type: "custom", days: [...days].sort((a, b) => a - b) };
}

export function formatFrequency(frequency) {
  if (!frequency || frequency.type !== "custom" || !frequency.days?.length) {
    return "Every day";
  }
  return frequency.days.map((d) => DAY_NAMES[d]).join(", ");
}

// V3: a lightweight gamification layer on top of the streak engine. XP is
// derived entirely from existing habit data (check-ins + best streaks) —
// nothing new is persisted, so there's no migration and it can never drift
// out of sync with the habits themselves.

import { todayISO } from "./dates.js";
import { calculateBestStreak, calculateTotalCompletedDays } from "./streaks.js";
import { DAILY_FREQUENCY } from "./frequency.js";

const XP_PER_CHECKIN = 10;
const XP_PER_BEST_STREAK_DAY = 3;

export const RANKS = [
  { name: "Rookie", threshold: 0 },
  { name: "Contender", threshold: 150 },
  { name: "Ranked Fighter", threshold: 400 },
  { name: "Top Contender", threshold: 900 },
  { name: "Champion", threshold: 1800 },
  { name: "World Champion", threshold: 3500 },
  { name: "Undisputed", threshold: 6000 },
];

export function calculateHabitXP(habit, referenceISO = todayISO()) {
  const checkIns = habit?.checkIns ?? [];
  const frequency = habit?.frequency ?? DAILY_FREQUENCY;
  const completed = calculateTotalCompletedDays(checkIns, referenceISO);
  const best = calculateBestStreak(checkIns, frequency, referenceISO);
  return completed * XP_PER_CHECKIN + best * XP_PER_BEST_STREAK_DAY;
}

export function calculateTotalXP(habits, referenceISO = todayISO()) {
  const list = Array.isArray(habits) ? habits : [];
  return list.reduce((sum, habit) => sum + calculateHabitXP(habit, referenceISO), 0);
}

// { name, xp, next: { name, threshold } | null, progress: 0..1 }
export function getRank(xp) {
  let index = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].threshold) index = i;
  }
  const current = RANKS[index];
  const next = RANKS[index + 1] ?? null;
  const progress = next
    ? Math.min(1, (xp - current.threshold) / (next.threshold - current.threshold))
    : 1;
  return { name: current.name, xp, next, progress };
}

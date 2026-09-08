// Pure helpers for the daily dashboard (header greeting/date, today's
// completion summary, and the contextual progress message). These are
// separate from src/lib/streaks.js on purpose — nothing here changes how a
// streak is calculated, it only aggregates/display-formats habit data for
// the home screen.

import { todayISO } from "./dates.js";
import { isStreakAtRisk } from "./streaks.js";

export function isCompletedToday(habit, referenceISO = todayISO()) {
  return Array.isArray(habit?.checkIns) && habit.checkIns.includes(referenceISO);
}

// { completed, total, percentage } for today, across all habits.
export function getDailySummary(habits, referenceISO = todayISO()) {
  const list = Array.isArray(habits) ? habits : [];
  const total = list.length;
  const completed = list.filter((habit) => isCompletedToday(habit, referenceISO)).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

// Number of habits whose active streak will break if not completed before
// the day ends.
export function countAtRisk(habits, referenceISO = todayISO()) {
  const list = Array.isArray(habits) ? habits : [];
  return list.filter((habit) =>
    isStreakAtRisk(habit?.checkIns ?? [], habit?.frequency, referenceISO),
  ).length;
}

// Streak lengths worth calling out with a small celebration.
export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100, 200, 365];

const MILESTONE_MESSAGES = {
  3: "3 days in — you're building something.",
  7: "One full week. Round 1: won.",
  14: "Two weeks strong.",
  30: "30 days. That's a real habit now.",
  50: "50 days deep.",
  100: "100 days. Absolute knockout.",
  200: "200 days. Legendary form.",
  365: "One full year. Undefeated.",
};

// If a check-in just pushed a habit's current streak from `oldStreak` to
// `newStreak` and that crossed one of STREAK_MILESTONES, returns
// { streak, message }. Otherwise returns null. Only fires going forward
// (oldStreak < newStreak) so unchecking a day never re-triggers it.
export function getCrossedMilestone(oldStreak, newStreak) {
  if (newStreak <= oldStreak) return null;
  const milestone = STREAK_MILESTONES.find((m) => oldStreak < m && m <= newStreak);
  if (milestone == null) return null;
  return { streak: milestone, message: MILESTONE_MESSAGES[milestone] };
}

// Takes raw completed/total (not the rounded percentage) so a value like
// 199/200 doesn't round up to a false "Perfect day" message.
export function getProgressMessage(completed, total) {
  if (total === 0 || completed === 0) return "Let's get started.";
  if (completed === total) return "Perfect day. You knocked it out.";
  const percentage = (completed / total) * 100;
  if (percentage < 50) return "You're getting there.";
  if (percentage < 80) return "You're building momentum.";
  return "Almost there.";
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

export function formatFriendlyDate(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

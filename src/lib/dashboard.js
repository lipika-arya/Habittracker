// Pure helpers for the daily dashboard (header greeting/date, today's
// completion summary, and the contextual progress message). These are
// separate from src/lib/streaks.js on purpose — nothing here changes how a
// streak is calculated, it only aggregates/display-formats habit data for
// the home screen.

import { todayISO } from "./dates.js";

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

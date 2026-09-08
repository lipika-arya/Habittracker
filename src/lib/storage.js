import { DEFAULT_CATEGORY_ID } from "./categories.js";
import { DAILY_FREQUENCY } from "./frequency.js";

const STORAGE_KEY = "habit-tracker:habits";
const THEME_KEY = "habit-tracker:theme";

// Fills in defaults for fields added after a habit may have been saved
// (categoryId, frequency), so every habit read from storage has the full
// shape the rest of the app expects.
function normalizeHabit(habit) {
  return {
    ...habit,
    checkIns: Array.isArray(habit?.checkIns) ? habit.checkIns : [],
    categoryId: habit?.categoryId ?? DEFAULT_CATEGORY_ID,
    frequency: habit?.frequency ?? DAILY_FREQUENCY,
  };
}

export function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeHabit) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch {
    // localStorage unavailable (e.g. private browsing) — app still works for this session
  }
}

export function loadTheme() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

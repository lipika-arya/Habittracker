// Knockout Buddy: a small, separate gamification layer. Unlike lib/xp.js
// (which derives a "fighter rank" from habit stats on every render), the
// Buddy's XP is a real persisted counter tied to discrete actions — it only
// ever goes up, and lives entirely independently of habit data so existing
// habits/streaks/categories are untouched.

const STORAGE_KEY = "habit-tracker:buddy";

export const XP_PER_CHECKIN = 10;
export const XP_PER_PERFECT_DAY = 50;

// Thresholds live in one place so they're easy to retune.
export const LEVELS = [
  { level: 1, name: "New Buddy", threshold: 0 },
  { level: 2, name: "Growing Buddy", threshold: 100 },
  { level: 3, name: "Strong Buddy", threshold: 250 },
  { level: 4, name: "Elite Buddy", threshold: 500 },
  { level: 5, name: "Knockout Buddy", threshold: 1000 },
];

const DEFAULT_BUDDY = { xp: 0, perfectDays: [], lastPlayedDate: null };

// Fills in defaults so old/partial/corrupt localStorage data never breaks
// the app — mirrors the normalize pattern already used for habits.
function normalizeBuddy(raw) {
  return {
    xp: typeof raw?.xp === "number" && raw.xp >= 0 ? raw.xp : 0,
    perfectDays: Array.isArray(raw?.perfectDays) ? raw.perfectDays.filter((d) => typeof d === "string") : [],
    lastPlayedDate: typeof raw?.lastPlayedDate === "string" ? raw.lastPlayedDate : null,
  };
}

export function loadBuddy() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeBuddy(JSON.parse(raw)) : { ...DEFAULT_BUDDY };
  } catch {
    return { ...DEFAULT_BUDDY };
  }
}

export function saveBuddy(buddy) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buddy));
  } catch {
    // localStorage unavailable — Buddy still works for this session
  }
}

export function hasPerfectDay(buddy, referenceISO) {
  return Boolean(buddy?.perfectDays?.includes(referenceISO));
}

// { level, name, xp, next: { name, threshold } | null, progress: 0..1 }
export function getLevelInfo(xp) {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].threshold) index = i;
  }
  const current = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  const progress = next
    ? Math.min(1, (xp - current.threshold) / (next.threshold - current.threshold))
    : 1;
  return { level: current.level, name: current.name, xp, next, progress };
}

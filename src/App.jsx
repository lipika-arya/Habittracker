import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import DailySummary from "./components/DailySummary.jsx";
import FighterCard from "./components/FighterCard.jsx";
import KnockoutBuddy from "./components/KnockoutBuddy.jsx";
import PerfectDayCelebration from "./components/PerfectDayCelebration.jsx";
import CatchTheStars from "./components/CatchTheStars.jsx";
import AddHabitForm from "./components/AddHabitForm.jsx";
import HabitList from "./components/HabitList.jsx";
import CelebrationToast from "./components/CelebrationToast.jsx";
import { loadHabits, saveHabits, loadTheme, saveTheme } from "./lib/storage.js";
import { todayISO } from "./lib/dates.js";
import { calculateBestStreak, calculateCurrentStreak } from "./lib/streaks.js";
import { countAtRisk, getCrossedMilestone, getDailySummary } from "./lib/dashboard.js";
import { calculateTotalXP, getRank } from "./lib/xp.js";
import { DEFAULT_CATEGORY_ID } from "./lib/categories.js";
import { DAILY_FREQUENCY } from "./lib/frequency.js";
import { loadBuddy, saveBuddy, getLevelInfo, hasPerfectDay, XP_PER_CHECKIN, XP_PER_PERFECT_DAY } from "./lib/buddy.js";

const CELEBRATION_DURATION_MS = 3200;
const BUDDY_PULSE_DURATION_MS = 900;
const BUDDY_XP_POPUP_DURATION_MS = 1100;

function getPreferredTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [habits, setHabits] = useState(() => loadHabits());
  const [celebration, setCelebration] = useState(null);
  const [theme, setTheme] = useState(() => loadTheme() ?? getPreferredTheme());

  const [buddy, setBuddy] = useState(() => loadBuddy());
  const [buddyPulse, setBuddyPulse] = useState(false);
  const [buddyXpPopup, setBuddyXpPopup] = useState(null);
  const [showPerfectDayCelebration, setShowPerfectDayCelebration] = useState(false);
  const [showBuddyGame, setShowBuddyGame] = useState(false);

  const today = todayISO();
  const summary = getDailySummary(habits, today);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    saveBuddy(buddy);
  }, [buddy]);

  useEffect(() => {
    if (!buddyPulse) return undefined;
    const timer = setTimeout(() => setBuddyPulse(false), BUDDY_PULSE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [buddyPulse]);

  useEffect(() => {
    if (!buddyXpPopup) return undefined;
    const timer = setTimeout(() => setBuddyXpPopup(null), BUDDY_XP_POPUP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [buddyXpPopup]);

  // Detects "today just reached 100%" off the same daily summary the rest of
  // the dashboard renders, rather than duplicating completion logic. Guarded
  // by buddy.perfectDays so a reload — or editing/deleting a habit that
  // happens to leave the day at 100% — never awards it twice.
  useEffect(() => {
    if (summary.total === 0 || summary.percentage !== 100) return;
    if (hasPerfectDay(buddy, today)) return;

    setBuddy((prev) =>
      hasPerfectDay(prev, today)
        ? prev
        : { ...prev, xp: prev.xp + XP_PER_PERFECT_DAY, perfectDays: [...prev.perfectDays, today] },
    );
    setBuddyPulse(true);
    setBuddyXpPopup({ amount: XP_PER_PERFECT_DAY, key: `perfect-${today}` });
    setShowPerfectDayCelebration(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary.total, summary.percentage, today]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!celebration) return undefined;
    const timer = setTimeout(() => setCelebration(null), CELEBRATION_DURATION_MS);
    return () => clearTimeout(timer);
  }, [celebration]);

  function handleAddHabit(name, categoryId = DEFAULT_CATEGORY_ID, frequency = DAILY_FREQUENCY) {
    const newHabit = {
      id: crypto.randomUUID(),
      name,
      createdAt: todayISO(),
      checkIns: [],
      categoryId,
      frequency,
    };
    setHabits((prev) => [...prev, newHabit]);
  }

  function handleToggleToday(habitId) {
    const today = todayISO();
    const targetHabit = habits.find((habit) => habit.id === habitId);
    if (!targetHabit) return;

    const isDone = targetHabit.checkIns.includes(today);
    const nextCheckIns = isDone
      ? targetHabit.checkIns.filter((d) => d !== today)
      : [...targetHabit.checkIns, today];

    const nextHabits = habits.map((habit) =>
      habit.id === habitId ? { ...habit, checkIns: nextCheckIns } : habit,
    );

    setHabits(nextHabits);

    // Only celebrate on a fresh check-in, never on an uncheck. Buddy XP is
    // purely additive too — an uncheck never takes XP back.
    if (isDone) return;

    setBuddy((prev) => ({ ...prev, xp: prev.xp + XP_PER_CHECKIN }));
    setBuddyPulse(true);
    setBuddyXpPopup({ amount: XP_PER_CHECKIN, key: `checkin-${habitId}-${today}-${Date.now()}` });

    const oldRank = getRank(calculateTotalXP(habits, today)).name;
    const newRank = getRank(calculateTotalXP(nextHabits, today)).name;
    if (newRank !== oldRank) {
      setCelebration({
        type: "rank",
        rank: newRank,
        message: `You've climbed to ${newRank}. Keep the pressure on.`,
      });
      return;
    }

    const oldStreak = calculateCurrentStreak(targetHabit.checkIns, targetHabit.frequency, today);
    const newStreak = calculateCurrentStreak(nextCheckIns, targetHabit.frequency, today);
    const crossed = getCrossedMilestone(oldStreak, newStreak);

    if (crossed) {
      setCelebration({
        type: "milestone",
        habitName: targetHabit.name,
        streak: crossed.streak,
        message: crossed.message,
      });
      return;
    }

    const prevSummary = getDailySummary(habits, today);
    const nextSummary = getDailySummary(nextHabits, today);
    if (nextSummary.total > 0 && nextSummary.percentage === 100 && prevSummary.percentage !== 100) {
      setCelebration({ type: "perfectDay", message: "Every habit, done. Flawless round." });
    }
  }

  function handleEditHabit(habitId, newName) {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === habitId ? { ...habit, name: newName } : habit)),
    );
  }

  function handleChangeCategory(habitId, categoryId) {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === habitId ? { ...habit, categoryId } : habit)),
    );
  }

  function handleDelete(habitId) {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
  }

  const atRiskCount = countAtRisk(habits, today);
  const rank = getRank(calculateTotalXP(habits, today));
  const bestStreakOverall = habits.reduce(
    (max, habit) => Math.max(max, calculateBestStreak(habit.checkIns, habit.frequency, today)),
    0,
  );

  const buddyLevelInfo = getLevelInfo(buddy.xp);
  const buddyCanPlay = hasPerfectDay(buddy, today);
  const buddyMood =
    habits.length === 0 ? "resting" : buddyPulse ? "happy" : summary.percentage === 100 ? "excited" : "idle";

  return (
    <main className="app">
      <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
      <KnockoutBuddy
        mood={buddyMood}
        levelInfo={buddyLevelInfo}
        xpPopup={buddyXpPopup}
        hasHabits={habits.length > 0}
        canPlay={buddyCanPlay}
        onPlay={() => setShowBuddyGame(true)}
      />
      {habits.length > 0 && <FighterCard rank={rank} bestStreak={bestStreakOverall} />}
      <DailySummary
        completed={summary.completed}
        total={summary.total}
        percentage={summary.percentage}
        atRiskCount={atRiskCount}
      />
      <AddHabitForm onAddHabit={handleAddHabit} />
      <HabitList
        habits={habits}
        onToggleToday={handleToggleToday}
        onEdit={handleEditHabit}
        onDelete={handleDelete}
        onChangeCategory={handleChangeCategory}
      />
      <CelebrationToast celebration={celebration} onDismiss={() => setCelebration(null)} />

      {showPerfectDayCelebration && (
        <PerfectDayCelebration
          onClose={() => setShowPerfectDayCelebration(false)}
          onPlay={() => {
            setShowPerfectDayCelebration(false);
            setShowBuddyGame(true);
          }}
        />
      )}

      {showBuddyGame && <CatchTheStars onClose={() => setShowBuddyGame(false)} />}
    </main>
  );
}

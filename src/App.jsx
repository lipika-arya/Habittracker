import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import DailySummary from "./components/DailySummary.jsx";
import FighterCard from "./components/FighterCard.jsx";
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

const CELEBRATION_DURATION_MS = 3200;

function getPreferredTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [habits, setHabits] = useState(() => loadHabits());
  const [celebration, setCelebration] = useState(null);
  const [theme, setTheme] = useState(() => loadTheme() ?? getPreferredTheme());

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

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

    // Only celebrate on a fresh check-in, never on an uncheck.
    if (isDone) return;

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

  const today = todayISO();
  const summary = getDailySummary(habits, today);
  const atRiskCount = countAtRisk(habits, today);
  const rank = getRank(calculateTotalXP(habits, today));
  const bestStreakOverall = habits.reduce(
    (max, habit) => Math.max(max, calculateBestStreak(habit.checkIns, habit.frequency, today)),
    0,
  );

  return (
    <main className="app">
      <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
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
    </main>
  );
}

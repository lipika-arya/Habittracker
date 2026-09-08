import { isCompletedToday } from "../lib/dashboard.js";
import { getHabitStats } from "../lib/streaks.js";

export default function HabitCard({ habit, onToggleToday, onDelete }) {
  const done = isCompletedToday(habit);
  const { currentStreak, bestStreak, completionRate } = getHabitStats(habit);
  const ratePercent = Math.round(completionRate * 100);

  return (
    <li className={done ? "habit-card habit-card-done" : "habit-card"}>
      <button
        type="button"
        className="habit-check"
        aria-pressed={done}
        aria-label={
          done ? `Mark ${habit.name} as not done today` : `Mark ${habit.name} as done today`
        }
        onClick={() => onToggleToday(habit.id)}
      >
        <span className="habit-check-mark" aria-hidden="true">
          {done ? "✓" : ""}
        </span>
      </button>

      <div className="habit-card-body">
        <span className="habit-name">{habit.name}</span>
        <div className="habit-card-stats">
          <span className="habit-stat">
            <span className="habit-stat-value">{currentStreak}</span>
            <span className="habit-stat-label">day streak</span>
          </span>
          <span className="habit-stat">
            <span className="habit-stat-value">{bestStreak}</span>
            <span className="habit-stat-label">best</span>
          </span>
          <span className="habit-stat">
            <span className="habit-stat-value">{ratePercent}%</span>
            <span className="habit-stat-label">completion</span>
          </span>
        </div>
      </div>

      <button
        type="button"
        className="habit-delete"
        aria-label={`Delete ${habit.name}`}
        onClick={() => onDelete(habit.id)}
      >
        ×
      </button>
    </li>
  );
}

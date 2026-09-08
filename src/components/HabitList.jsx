import { useMemo, useState } from "react";
import HabitCard from "./HabitCard.jsx";
import EmptyState from "./EmptyState.jsx";
import { CATEGORIES } from "../lib/categories.js";

export default function HabitList({ habits, onToggleToday, onEdit, onDelete, onChangeCategory }) {
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const usedCategories = useMemo(() => {
    const ids = new Set(habits.map((h) => h.categoryId));
    return CATEGORIES.filter((c) => ids.has(c.id));
  }, [habits]);

  if (habits.length === 0) {
    return <EmptyState />;
  }

  const visibleHabits = activeCategoryId
    ? habits.filter((h) => h.categoryId === activeCategoryId)
    : habits;

  return (
    <div className="habit-list-wrap">
      {usedCategories.length > 1 && (
        <div className="category-filter" role="radiogroup" aria-label="Filter by category">
          <button
            type="button"
            role="radio"
            aria-checked={activeCategoryId === null}
            className={`category-chip${activeCategoryId === null ? " category-chip-selected" : ""}`}
            onClick={() => setActiveCategoryId(null)}
          >
            All
          </button>
          {usedCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="radio"
              aria-checked={activeCategoryId === category.id}
              className={`category-chip${activeCategoryId === category.id ? " category-chip-selected" : ""}`}
              style={{ "--chip-color": category.color }}
              onClick={() => setActiveCategoryId(category.id)}
            >
              <span className="category-chip-dot" />
              {category.label}
            </button>
          ))}
        </div>
      )}

      {visibleHabits.length === 0 ? (
        <p className="habit-list-empty">No habits in this category yet.</p>
      ) : (
        <ul className="habit-list">
          {visibleHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggleToday={onToggleToday}
              onEdit={onEdit}
              onDelete={onDelete}
              onChangeCategory={onChangeCategory}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

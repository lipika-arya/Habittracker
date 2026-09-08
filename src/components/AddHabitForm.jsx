import { useState } from "react";
import { PlusIcon } from "./icons.jsx";
import { CATEGORIES, DEFAULT_CATEGORY_ID } from "../lib/categories.js";
import { DAY_LETTERS, normalizeFrequency } from "../lib/frequency.js";

const MAX_LENGTH = 80;

export default function AddHabitForm({ onAddHabit }) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(DEFAULT_CATEGORY_ID);
  const [days, setDays] = useState([]);

  function toggleDay(dayIndex) {
    setDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex].sort(),
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddHabit(trimmed, categoryId, normalizeFrequency(days));
    setName("");
    setCategoryId(DEFAULT_CATEGORY_ID);
    setDays([]);
  }

  return (
    <form className="add-habit-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="habit-name">
        Add a habit
      </label>
      <div className="add-habit-row">
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="Add a new habit…"
          autoComplete="off"
        />
        <button type="submit" aria-label="Add habit">
          <PlusIcon />
          Add
        </button>
      </div>

      <div className="add-habit-options">
        <div className="add-habit-categories" role="radiogroup" aria-label="Category">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              role="radio"
              aria-checked={categoryId === category.id}
              className={`category-chip${categoryId === category.id ? " category-chip-selected" : ""}`}
              style={{ "--chip-color": category.color }}
              onClick={() => setCategoryId(category.id)}
            >
              <span className="category-chip-dot" />
              {category.label}
            </button>
          ))}
        </div>

        <div className="add-habit-frequency" role="group" aria-label="Repeat on">
          <span className="add-habit-frequency-label">
            {days.length === 0 ? "Every day" : "Custom days"}
          </span>
          <div className="day-picker">
            {DAY_LETTERS.map((letter, index) => (
              <button
                key={index}
                type="button"
                aria-pressed={days.includes(index)}
                aria-label={letter}
                className={`day-chip${days.includes(index) ? " day-chip-selected" : ""}`}
                onClick={() => toggleDay(index)}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}

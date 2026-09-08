import { useState } from "react";

const MAX_LENGTH = 80;

export default function AddHabitForm({ onAddHabit }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddHabit(trimmed);
    setName("");
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
          Add
        </button>
      </div>
    </form>
  );
}

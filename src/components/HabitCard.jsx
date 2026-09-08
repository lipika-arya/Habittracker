import { useEffect, useRef, useState } from "react";
import { isCompletedToday } from "../lib/dashboard.js";
import { getHabitStats } from "../lib/streaks.js";
import { CATEGORIES, getCategory } from "../lib/categories.js";
import { formatFrequency } from "../lib/frequency.js";
import Heatmap from "./Heatmap.jsx";
import {
  CalendarIcon,
  CheckIcon,
  FlameIcon,
  PencilIcon,
  TargetIcon,
  TrashIcon,
  TrophyIcon,
  WarningIcon,
} from "./icons.jsx";

const MAX_LENGTH = 80;

export default function HabitCard({ habit, onToggleToday, onEdit, onDelete, onChangeCategory }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(habit.name);
  const [isPickingCategory, setIsPickingCategory] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const inputRef = useRef(null);

  const done = isCompletedToday(habit);
  const { currentStreak, bestStreak, completionRate, atRisk } = getHabitStats(habit);
  const ratePercent = Math.round(completionRate * 100);
  const category = getCategory(habit.categoryId);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  function startEditing() {
    setDraftName(habit.name);
    setIsEditing(true);
  }

  function commitEdit() {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== habit.name) {
      onEdit(habit.id, trimmed);
    }
    setIsEditing(false);
  }

  function cancelEdit() {
    setDraftName(habit.name);
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  }

  function selectCategory(categoryId) {
    onChangeCategory(habit.id, categoryId);
    setIsPickingCategory(false);
  }

  const cardClassName = [
    "habit-card",
    done && "habit-card-done",
    atRisk && "habit-card-at-risk",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li className={cardClassName} style={{ "--category-color": category.color }}>
      <div className="habit-card-main">
        <button
          type="button"
          className="habit-check"
          aria-pressed={done}
          aria-label={
            done ? `Mark ${habit.name} as not done today` : `Mark ${habit.name} as done today`
          }
          onClick={() => onToggleToday(habit.id)}
        >
          {done && <CheckIcon className="habit-check-icon" />}
        </button>

        <div className="habit-card-body">
          <div className="habit-card-heading">
            <button
              type="button"
              className="category-dot"
              style={{ "--chip-color": category.color }}
              aria-label={`Category: ${category.label}. Click to change.`}
              onClick={() => setIsPickingCategory((v) => !v)}
            />
            {isEditing ? (
              <input
                ref={inputRef}
                className="habit-name-input"
                type="text"
                value={draftName}
                maxLength={MAX_LENGTH}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={handleKeyDown}
                aria-label={`Rename ${habit.name}`}
              />
            ) : (
              <span className="habit-name">{habit.name}</span>
            )}
          </div>

          {isPickingCategory && (
            <div className="category-swatches" role="radiogroup" aria-label="Change category">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={c.id === habit.categoryId}
                  aria-label={c.label}
                  title={c.label}
                  className={`category-swatch${c.id === habit.categoryId ? " category-swatch-selected" : ""}`}
                  style={{ "--chip-color": c.color }}
                  onClick={() => selectCategory(c.id)}
                />
              ))}
            </div>
          )}

          <span className="habit-frequency">{formatFrequency(habit.frequency)}</span>

          <div className="habit-card-stats">
            <span className="habit-stat">
              <span className="habit-stat-top">
                <FlameIcon className="habit-stat-icon" />
                <span className="habit-stat-value">{currentStreak}</span>
              </span>
              <span className="habit-stat-label">day streak</span>
            </span>
            <span className="habit-stat">
              <span className="habit-stat-top">
                <TrophyIcon className="habit-stat-icon" />
                <span className="habit-stat-value">{bestStreak}</span>
              </span>
              <span className="habit-stat-label">best</span>
            </span>
            <span className="habit-stat">
              <span className="habit-stat-top">
                <TargetIcon className="habit-stat-icon" />
                <span className="habit-stat-value">{ratePercent}%</span>
              </span>
              <span className="habit-stat-label">completion</span>
            </span>
          </div>

          {atRisk && (
            <span className="at-risk-badge">
              <WarningIcon className="at-risk-icon" />
              Streak at risk — complete today to keep it alive
            </span>
          )}

          {isHistoryOpen && (
            <Heatmap
              checkIns={habit.checkIns}
              frequency={habit.frequency}
              createdAt={habit.createdAt}
              color={category.color}
            />
          )}
        </div>

        <div className="habit-card-actions">
          <button
            type="button"
            className={`habit-icon-button${isHistoryOpen ? " habit-icon-button-active" : ""}`}
            aria-label={isHistoryOpen ? "Hide history" : "Show history"}
            aria-pressed={isHistoryOpen}
            onClick={() => setIsHistoryOpen((v) => !v)}
          >
            <CalendarIcon />
          </button>
          {!isEditing && (
            <button
              type="button"
              className="habit-icon-button"
              aria-label={`Rename ${habit.name}`}
              onClick={startEditing}
            >
              <PencilIcon />
            </button>
          )}
          <button
            type="button"
            className="habit-icon-button habit-icon-button-danger"
            aria-label={`Delete ${habit.name}`}
            onClick={() => onDelete(habit.id)}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </li>
  );
}

import HabitCard from "./HabitCard.jsx";
import EmptyState from "./EmptyState.jsx";

export default function HabitList({ habits, onToggleToday, onDelete }) {
  if (habits.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggleToday={onToggleToday}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

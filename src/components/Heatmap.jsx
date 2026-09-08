import { useMemo } from "react";
import { addDays, getDayOfWeek, todayISO } from "../lib/dates.js";
import { getValidSortedCheckIns } from "../lib/streaks.js";
import { isScheduledDay } from "../lib/frequency.js";

// A compact GitHub-style contribution grid for one habit's recent history.
// Columns are calendar weeks (Sunday-aligned), rows are days of the week,
// read chronologically left-to-right. Days before the habit existed, or
// that its frequency doesn't schedule, render as neutral "off" cells so
// they never read as missed days.
export default function Heatmap({ checkIns, frequency, createdAt, weeks = 12, color = "#e8482c" }) {
  const referenceISO = todayISO();
  const doneSet = useMemo(
    () => new Set(getValidSortedCheckIns(checkIns, referenceISO)),
    [checkIns, referenceISO],
  );

  const days = useMemo(() => {
    const totalDays = weeks * 7;
    const rangeStart = addDays(referenceISO, -(totalDays - 1));
    const alignedStart = addDays(rangeStart, -getDayOfWeek(rangeStart));
    const list = [];
    let cursor = alignedStart;
    while (cursor <= referenceISO) {
      list.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return list;
  }, [referenceISO, weeks]);

  return (
    <div className="heatmap" style={{ "--heatmap-color": color }}>
      <div className="heatmap-grid">
        {days.map((day) => {
          const isFuture = day > referenceISO;
          const done = !isFuture && doneSet.has(day);
          const scheduled = !isFuture && day >= createdAt && isScheduledDay(frequency, day);
          const missed = !isFuture && scheduled && !done;
          const className = [
            "heatmap-cell",
            isFuture && "heatmap-cell-future",
            !isFuture && !done && !scheduled && "heatmap-cell-off",
            done && "heatmap-cell-done",
            missed && "heatmap-cell-missed",
            day === referenceISO && "heatmap-cell-today",
          ]
            .filter(Boolean)
            .join(" ");
          return <span key={day} className={className} title={day} />;
        })}
      </div>
    </div>
  );
}

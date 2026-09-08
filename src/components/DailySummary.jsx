import { getProgressMessage } from "../lib/dashboard.js";
import { WarningIcon } from "./icons.jsx";

export default function DailySummary({ completed, total, percentage, atRiskCount }) {
  const message = getProgressMessage(completed, total);

  return (
    <section className="daily-summary" aria-label="Today's progress">
      <div className="daily-summary-top">
        <span className="daily-summary-count">
          {completed}
          <span className="daily-summary-count-total">/{total}</span>
        </span>
        <span className="daily-summary-percentage">{percentage}%</span>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Habits completed today"
      >
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>

      <p className="daily-summary-message">{message}</p>

      {atRiskCount > 0 && (
        <p className="daily-summary-risk">
          <WarningIcon className="daily-summary-risk-icon" />
          {atRiskCount === 1
            ? "1 streak is at risk — complete it before the day ends."
            : `${atRiskCount} streaks are at risk — complete them before the day ends.`}
        </p>
      )}
    </section>
  );
}

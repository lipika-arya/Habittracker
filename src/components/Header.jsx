import { getGreeting, formatFriendlyDate } from "../lib/dashboard.js";

export default function Header() {
  const now = new Date();

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-name">Knockout</span>
      </div>
      <p className="greeting">{getGreeting(now)}</p>
      <p className="today-date">{formatFriendlyDate(now)}</p>
    </header>
  );
}

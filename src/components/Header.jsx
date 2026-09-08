import { getGreeting, formatFriendlyDate } from "../lib/dashboard.js";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Header({ theme, onToggleTheme }) {
  const now = new Date();

  return (
    <header className="app-header">
      <div className="app-header-top">
        <span className="brand-name">Knockout</span>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
      <p className="greeting">{getGreeting(now)}</p>
      <p className="today-date">{formatFriendlyDate(now)}</p>
    </header>
  );
}

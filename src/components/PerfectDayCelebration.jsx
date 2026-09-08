import { useEffect } from "react";

const STAR_COUNT = 10;
const stars = Array.from({ length: STAR_COUNT }, (_, i) => i);

export default function PerfectDayCelebration({ onClose, onPlay }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="buddy-overlay" role="dialog" aria-modal="true" aria-label="Perfect day">
      <button type="button" className="buddy-overlay-backdrop" aria-label="Close" onClick={onClose} />

      <div className="perfect-day-card">
        <div className="perfect-day-stars" aria-hidden="true">
          {stars.map((i) => (
            <span key={i} className="perfect-day-star" style={{ "--i": i }}>
              ✦
            </span>
          ))}
        </div>

        <div className="buddy-creature buddy-creature-lg buddy-mood-excited" aria-hidden="true">
          <span className="buddy-eye buddy-eye-left" />
          <span className="buddy-eye buddy-eye-right" />
          <span className="buddy-cheek buddy-cheek-left" />
          <span className="buddy-cheek buddy-cheek-right" />
          <span className="buddy-mouth" />
        </div>

        <h2 className="perfect-day-title">PERFECT DAY! 🎉</h2>
        <p className="perfect-day-subtitle">Your Buddy is celebrating with you.</p>
        <span className="perfect-day-xp">+50 XP</span>

        <div className="perfect-day-actions">
          <button type="button" className="buddy-play-button" onClick={onPlay}>
            Play with Buddy
          </button>
          <button type="button" className="perfect-day-dismiss" onClick={onClose}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

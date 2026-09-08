// A small CSS/HTML creature (no image assets) with a handful of mood
// states. Purely presentational — all XP/level/mood state lives in App.jsx
// and src/lib/buddy.js.

const LEVEL_LABELS = {
  1: "New Buddy",
  2: "Growing Buddy",
  3: "Strong Buddy",
  4: "Elite Buddy",
  5: "Knockout Buddy",
};

export default function KnockoutBuddy({ mood, levelInfo, xpPopup, hasHabits, canPlay, onPlay }) {
  const progressPercent = Math.round(levelInfo.progress * 100);

  return (
    <section className="buddy-card" aria-label="Knockout Buddy">
      <div className="buddy-card-top">
        <span className="buddy-card-title">Knockout Buddy</span>
        <span className="buddy-level-tag">Level {levelInfo.level}</span>
      </div>

      <div className="buddy-card-body">
        <div className={`buddy-stage buddy-mood-${mood}`}>
          <div className="buddy-creature" aria-hidden="true">
            <span className="buddy-eye buddy-eye-left" />
            <span className="buddy-eye buddy-eye-right" />
            <span className="buddy-cheek buddy-cheek-left" />
            <span className="buddy-cheek buddy-cheek-right" />
            <span className="buddy-mouth" />
          </div>

          {mood === "excited" && (
            <div className="buddy-sparkles" aria-hidden="true">
              <span className="buddy-sparkle" style={{ "--i": 0 }}>✦</span>
              <span className="buddy-sparkle" style={{ "--i": 1 }}>✦</span>
              <span className="buddy-sparkle" style={{ "--i": 2 }}>✦</span>
            </div>
          )}

          {mood === "resting" && (
            <span className="buddy-zzz" aria-hidden="true">z z z</span>
          )}

          {xpPopup && (
            <span key={xpPopup.key} className="buddy-xp-popup" aria-live="polite">
              +{xpPopup.amount} XP
            </span>
          )}
        </div>

        <div className="buddy-progress">
          <span className="buddy-progress-name">{LEVEL_LABELS[levelInfo.level]}</span>
          <div
            className="buddy-progress-track"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Buddy XP progress"
          >
            <div className="buddy-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="buddy-progress-label">
            {levelInfo.next ? `${levelInfo.xp} / ${levelInfo.next.threshold} XP` : `${levelInfo.xp} XP · Max level`}
          </span>
        </div>
      </div>

      <p className="buddy-tagline">
        {hasHabits ? "Your Buddy is powered by your progress." : "Add a habit to wake your Buddy up."}
      </p>

      {canPlay && (
        <button type="button" className="buddy-play-button" onClick={onPlay}>
          Play with Buddy
        </button>
      )}
    </section>
  );
}

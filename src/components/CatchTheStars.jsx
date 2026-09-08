import { useEffect, useState } from "react";

const TOTAL_STARS = 5;
const CATCH_ANIMATION_MS = 220;

// Percentage-based spawn box, kept away from the edges and the buddy
// sitting at the bottom-center of the field.
function randomStarPosition() {
  return {
    top: `${10 + Math.random() * 55}%`,
    left: `${8 + Math.random() * 78}%`,
  };
}

export default function CatchTheStars({ onClose }) {
  const [collected, setCollected] = useState(0);
  const [starKey, setStarKey] = useState(0);
  const [position, setPosition] = useState(randomStarPosition);
  const [isCatching, setIsCatching] = useState(false);

  const done = collected >= TOTAL_STARS;

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleCatch() {
    if (isCatching || done) return;
    setIsCatching(true);
    // Let the "caught" pop animation play on this star before swapping it
    // for the next one — no failure state, no timer, just a beat of delight.
    window.setTimeout(() => {
      setCollected((count) => count + 1);
      setPosition(randomStarPosition());
      setStarKey((key) => key + 1);
      setIsCatching(false);
    }, CATCH_ANIMATION_MS);
  }

  return (
    <div className="buddy-overlay" role="dialog" aria-modal="true" aria-label="Catch the Stars">
      <button type="button" className="buddy-overlay-backdrop" aria-label="Close" onClick={onClose} />

      <div className="stars-game-card">
        <div className="stars-game-header">
          <span className="stars-game-title">Catch the Stars ⭐</span>
          <button type="button" className="buddy-overlay-close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>

        {!done ? (
          <>
            <p className="stars-game-hint">Tap all 5 stars — no rush.</p>
            <div className="stars-game-field">
              <div className="buddy-creature buddy-creature-md buddy-mood-happy stars-game-buddy" aria-hidden="true">
                <span className="buddy-eye buddy-eye-left" />
                <span className="buddy-eye buddy-eye-right" />
                <span className="buddy-cheek buddy-cheek-left" />
                <span className="buddy-cheek buddy-cheek-right" />
                <span className="buddy-mouth" />
              </div>
              <button
                key={starKey}
                type="button"
                className={`stars-game-star${isCatching ? " stars-game-star-caught" : ""}`}
                style={position}
                onClick={handleCatch}
                aria-label={`Catch star ${collected + 1} of ${TOTAL_STARS}`}
              >
                ⭐
              </button>
            </div>
            <div className="stars-game-progress" aria-live="polite">
              {collected} / {TOTAL_STARS} collected
            </div>
          </>
        ) : (
          <div className="stars-game-done">
            <p className="stars-game-done-title">You did it! ⭐</p>
            <p className="stars-game-done-message">Your Buddy is glowing with pride.</p>
            <button type="button" className="buddy-play-button" onClick={onClose}>
              Nice!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

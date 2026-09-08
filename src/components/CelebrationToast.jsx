import { useMemo } from "react";
import { CloseIcon, FlameIcon, GloveIcon, TrophyIcon } from "./icons.jsx";

const CONFETTI_COLORS = ["#e8482c", "#f2a641", "#2f6f4f", "#1f5fae"];

function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.round(Math.random() * 100),
        delay: Math.round(Math.random() * 150),
        duration: 900 + Math.round(Math.random() * 500),
        rotate: Math.round(Math.random() * 360),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    [],
  );

  return (
    <div className="confetti-burst" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}ms`,
            animationDuration: `${p.duration}ms`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function CelebrationToast({ celebration, onDismiss }) {
  if (!celebration) return null;

  const isMilestone = celebration.type === "milestone";
  const isRankUp = celebration.type === "rank";

  const icon = isMilestone ? <FlameIcon /> : isRankUp ? <GloveIcon /> : <TrophyIcon />;
  const title = isMilestone
    ? `${celebration.habitName} · ${celebration.streak}-day streak`
    : isRankUp
      ? `Rank up · ${celebration.rank}`
      : "Perfect day";

  return (
    <div className="celebration-toast" role="status">
      <ConfettiBurst />
      <div className="celebration-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="celebration-body">
        <span className="celebration-title">{title}</span>
        <span className="celebration-message">{celebration.message}</span>
      </div>
      <button
        type="button"
        className="celebration-dismiss"
        aria-label="Dismiss"
        onClick={onDismiss}
      >
        <CloseIcon />
      </button>
    </div>
  );
}

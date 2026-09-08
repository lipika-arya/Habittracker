import { BoltIcon, FlameIcon, GloveIcon } from "./icons.jsx";

export default function FighterCard({ rank, bestStreak }) {
  const { name, xp, next, progress } = rank;
  const progressPercent = Math.round(progress * 100);

  return (
    <section className="fighter-card" aria-label="Your rank">
      <div className="fighter-card-badge">
        <GloveIcon />
      </div>

      <div className="fighter-card-main">
        <div className="fighter-card-top">
          <span className="fighter-card-rank">{name}</span>
          <span className="fighter-card-xp">
            <BoltIcon className="fighter-card-xp-icon" />
            {xp.toLocaleString()} XP
          </span>
        </div>

        <div className="fighter-card-track" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <div className="fighter-card-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <p className="fighter-card-next">
          {next ? `${(next.threshold - xp).toLocaleString()} XP to ${next.name}` : "Peak rank reached — undisputed."}
        </p>
      </div>

      {bestStreak > 0 && (
        <div className="fighter-card-best" title="Longest streak across all habits">
          <FlameIcon />
          <span>{bestStreak}</span>
        </div>
      )}
    </section>
  );
}

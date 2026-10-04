import { disciplines } from "../content";

export default function Marquee() {
  const row = [...disciplines, ...disciplines];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-ink-2 py-6" aria-label="Disciplines we support">
      <div className="marquee flex w-max gap-12 whitespace-nowrap">
        {row.map((d, i) => (
          <span key={i} className="flex items-center gap-12 font-display text-2xl italic text-paper/50">
            {d}<span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

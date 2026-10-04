import { disciplines } from "../content";

export default function Marquee() {
  const row = [...disciplines, ...disciplines];
  return (
    <div className="overflow-hidden border-y border-line py-7" aria-hidden>
      <div className="marquee flex w-max">
        {row.map((d, i) => (
          <span key={i} className="flex items-center font-display text-[2.4rem] italic text-ink/45">
            <span className="px-10">{d}</span><span className="text-2xl not-italic text-blue">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}

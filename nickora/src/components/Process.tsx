import type { ReactNode } from "react";
import { steps } from "../content";
import { Chapter, Reveal } from "./ui";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.2 } as const;
const art: ReactNode[] = [
  <svg viewBox="0 0 200 110" className="h-full w-full"><path {...S} d="M40 30h70a12 12 0 0 1 12 12v18a12 12 0 0 1-12 12H66l-16 14V72H40a12 12 0 0 1-12-12V42a12 12 0 0 1 12-12Z" /><path {...S} d="M132 44h28a10 10 0 0 1 10 10v14a10 10 0 0 1-10 10h-4v12l-14-12h-10" opacity=".5" /></svg>,
  <svg viewBox="0 0 200 110" className="h-full w-full"><rect {...S} x="60" y="14" width="80" height="84" rx="4" />{[34, 52, 70].map((y) => <g key={y}><path {...S} d={`M72 ${y}l4 4 8-8`} /><path {...S} d={`M92 ${y}h36`} opacity=".5" /></g>)}</svg>,
  <svg viewBox="0 0 200 110" className="h-full w-full">{[24, 38, 52, 66, 80].map((y, k) => <path key={y} {...S} d={`M40 ${y}h${k === 2 ? 70 : 120}`} opacity={k === 2 ? 1 : 0.35} />)}<path {...S} d="M114 58l40-30 8 8-40 30-12 4z" /></svg>,
  <svg viewBox="0 0 200 110" className="h-full w-full"><path {...S} d="M100 22 40 46l60 24 60-24z" /><path {...S} d="M64 56v20c0 8 16 14 36 14s36-6 36-14V56" /><path {...S} d="M160 46v28" opacity=".5" /></svg>,
];

export default function Process() {
  return (
    <section id="process" className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
      <Reveal className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <Chapter n="03">Process</Chapter>
          <h2 className="mt-6 font-display text-[clamp(3.2rem,9vw,8.5rem)] leading-[0.9] tracking-[-0.025em]">Clear steps,<br /><em className="text-blue">real progress.</em></h2>
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-muted lg:justify-self-end">Four steps. You always know what happens next and what it costs.</p>
      </Reveal>
      <ol className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <li className="group h-full rounded-2xl border border-line bg-card p-7 transition hover:-translate-y-1 hover:border-ink/30">
              <div className="flex items-center justify-between"><span className="label text-muted">Step 0{i + 1}</span><span className="h-1.5 w-1.5 rounded-full bg-blue" /></div>
              <h3 className="mt-6 font-display text-5xl">{s.title}</h3>
              <div className="my-7 h-28 rounded-xl bg-paper p-3 text-ink/70 transition group-hover:text-blue">{art[i]}</div>
              <p className="text-[15px] leading-relaxed text-muted">{s.text}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

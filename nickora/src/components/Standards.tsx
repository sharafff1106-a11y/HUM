import { Check, X } from "lucide-react";
import { donts, dos } from "../content";
import { Eyebrow, Reveal } from "./ui";

export default function Standards() {
  return (
    <section id="standards" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <Reveal className="max-w-3xl">
        <Eyebrow>Our standards</Eyebrow>
        <h2 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">Trust is the whole point.</h2>
        <p className="mt-6 max-w-xl text-lg text-slate">Academic help has a bad reputation, and some of it is deserved. These are the lines we hold, in writing.</p>
      </Reveal>
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <Reveal className="rounded-3xl bg-tint p-8 md:p-10">
          <h3 className="font-display text-3xl">What we do</h3>
          <ul className="mt-6 space-y-4">
            {dos.map((d) => (
              <li key={d} className="flex gap-3 leading-snug"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald text-white"><Check size={14} strokeWidth={3} /></span>{d}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.08} className="rounded-3xl border border-line bg-white p-8 md:p-10">
          <h3 className="font-display text-3xl">What we never do</h3>
          <ul className="mt-6 space-y-4">
            {donts.map((d) => (
              <li key={d} className="flex gap-3 leading-snug text-ink/80"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-white"><X size={14} strokeWidth={3} /></span>{d}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

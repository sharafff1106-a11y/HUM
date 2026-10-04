import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { services } from "../content";
import { Eyebrow, Reveal, spotlight } from "./ui";

export default function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-7xl px-6 py-32">
      <Reveal className="max-w-3xl">
        <Eyebrow>What we do</Eyebrow>
        <h2 className="mt-6 font-display text-5xl font-light leading-[1.05] tracking-tight md:text-7xl">
          Six ways we move you <span className="text-gradient italic">forward.</span>
        </h2>
        <p className="mt-6 max-w-xl text-lg text-paper/60">One partner for the whole academic journey — from choosing a university to defending a doctorate.</p>
      </Reveal>

      <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const Icon = (Icons as unknown as Record<string, LucideIcon>)[s.icon];
          return (
            <Reveal key={s.id} delay={(i % 3) * 0.08} onMouseMove={spotlight}
              className="spot group relative bg-ink p-8 transition-colors hover:bg-ink-2 md:p-10">
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold transition group-hover:rotate-6 group-hover:bg-gold group-hover:text-ink"><Icon size={26} /></span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/40">{s.tag}</span>
                </div>
                <h3 className="mt-10 font-display text-3xl leading-tight">{s.title}</h3>
                <p className="mt-4 leading-relaxed text-paper/60">{s.text}</p>
                <a href="#contact" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gold">
                  Enquire <Icons.ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

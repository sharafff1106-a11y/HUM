import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { phdStages } from "../content";
import { Eyebrow, Reveal } from "./ui";

export default function Research() {
  const [active, setActive] = useState(2);
  const pct = (active / (phdStages.length - 1)) * 100;

  return (
    <section id="research" className="relative overflow-hidden py-32">
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-iris/15 blur-[140px]" />
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center"><Eyebrow>Research & PhD</Eyebrow></div>
          <h2 className="mt-6 font-display text-5xl font-light leading-[1.05] tracking-tight md:text-7xl">
            From first idea to <span className="text-gradient italic">“Doctor.”</span>
          </h2>
          <p className="mt-6 text-lg text-paper/60">Tap a stage to see how we support each milestone of your research.</p>
        </Reveal>

        <Reveal className="mt-20">
          <div className="relative">
            <div className="absolute left-0 right-0 top-[18px] h-px bg-white/15" />
            <motion.div className="absolute left-0 top-[18px] h-px bg-gradient-to-r from-gold to-aqua" animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 90, damping: 20 }} />
            <ol className="relative flex justify-between">
              {phdStages.map((s, i) => (
                <li key={s.label}>
                  <button onClick={() => setActive(i)} className="group flex w-14 flex-col items-center gap-3 md:w-24" aria-pressed={i === active}>
                    <span className={`grid h-9 w-9 place-items-center rounded-full border font-mono text-xs transition ${i <= active ? "border-gold bg-gold text-ink" : "border-white/25 bg-ink text-paper/60 group-hover:border-gold"} ${i === active ? "scale-125 shadow-[0_0_30px_rgba(244,184,96,.6)]" : ""}`}>{i + 1}</span>
                    <span className={`text-[11px] transition md:text-sm ${i === active ? "text-gold" : "text-paper/50"}`}>{s.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="mx-auto mt-16 min-h-[180px] max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">Stage {active + 1} of {phdStages.length}</p>
                <h3 className="mt-3 font-display text-4xl">{phdStages[active].label}</h3>
                <p className="mt-3 text-lg text-paper/65">{phdStages[active].note}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

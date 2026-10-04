import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { phdStages } from "../content";
import { Eyebrow, Reveal } from "./ui";

export default function Research() {
  const [active, setActive] = useState(2);
  const pct = (active / (phdStages.length - 1)) * 100;

  return (
    <section id="research" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <Reveal className="mx-auto max-w-3xl text-center">
        <Eyebrow>Research & PhD</Eyebrow>
        <h2 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">From first idea to <em className="text-emerald">viva.</em></h2>
        <p className="mt-6 text-lg text-slate">Select a stage to see where we support a research project.</p>
      </Reveal>

      <Reveal className="mt-16">
        <div className="relative">
          <div className="absolute left-0 right-0 top-[18px] h-px bg-line" />
          <motion.div className="absolute left-0 top-[17px] h-[3px] rounded bg-emerald" animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 90, damping: 20 }} />
          <ol className="relative flex justify-between">
            {phdStages.map((s, i) => (
              <li key={s.label}>
                <button onClick={() => setActive(i)} aria-pressed={i === active} className="group flex w-12 flex-col items-center gap-3 md:w-24">
                  <span className={`grid h-9 w-9 place-items-center rounded-full border text-xs font-semibold transition ${i <= active ? "border-emerald bg-emerald text-white" : "border-line bg-white text-slate group-hover:border-emerald"} ${i === active ? "scale-125 ring-4 ring-tint" : ""}`}>{i + 1}</span>
                  <span className={`text-[11px] font-medium transition md:text-sm ${i === active ? "text-ink" : "text-slate"}`}>{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="mx-auto mt-14 max-w-2xl rounded-3xl bg-snow p-10 text-center">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald">Stage {active + 1} of {phdStages.length}</p>
              <h3 className="mt-3 font-display text-4xl">{phdStages[active].label}</h3>
              <p className="mt-2 text-lg text-slate">{phdStages[active].note}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}

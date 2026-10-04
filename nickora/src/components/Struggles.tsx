import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { struggles } from "../content";
import { Chapter, Reveal } from "./ui";

export default function Struggles() {
  const [i, setI] = useState(1);
  return (
    <section id="struggles" className="border-y border-line bg-card py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <Chapter n="02">Where students get stuck</Chapter>
          <h2 className="mt-6 max-w-5xl font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.02em]">
            Most students aren't failing. They're <em className="text-blue">stuck.</em>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div className="flex flex-wrap gap-3" role="tablist" aria-label="Common problems">
            {struggles.map((s, k) => (
              <button key={s.id} role="tab" aria-selected={k === i} onClick={() => setI(k)} onMouseEnter={() => setI(k)}
                className={`rounded-full border px-5 py-2.5 text-[15px] transition ${k === i ? "border-ink bg-ink text-white" : "border-line text-ink/70 hover:border-ink/40"}`}>{s.label}</button>
            ))}
          </div>
          <div className="min-h-[150px] border-l border-blue pl-8">
            <p className="label text-blue">How we help</p>
            <AnimatePresence mode="wait">
              <motion.p key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}
                className="mt-4 font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.15]">{struggles[i].fix}</motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

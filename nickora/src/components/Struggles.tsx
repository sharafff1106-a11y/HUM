import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { struggles } from "../content";
import { Eyebrow, Reveal } from "./ui";

export default function Struggles() {
  const [id, setId] = useState<string>(struggles[1].id);
  const cur = struggles.find((s) => s.id === id)!;

  return (
    <section id="struggles" className="bg-navy py-24 text-white md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow light>Sound familiar?</Eyebrow>
          <h2 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
            Most students aren't failing. They're <em className="text-mint">stuck.</em>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-white/65">Pick the one that feels closest to your week. We'll show you what we'd do about it.</p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <ul className="grid gap-2" role="tablist" aria-label="Common struggles">
            {struggles.map((s) => (
              <li key={s.id}>
                <button role="tab" aria-selected={s.id === id} onClick={() => setId(s.id)}
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left text-[15px] font-medium transition ${s.id === id ? "border-mint bg-white text-ink" : "border-white/12 bg-white/[0.04] text-white/85 hover:border-white/35"}`}>
                  {s.label}
                  <ArrowRight size={18} className={`shrink-0 transition ${s.id === id ? "text-emerald" : "opacity-0"}`} />
                </button>
              </li>
            ))}
          </ul>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <AnimatePresence mode="wait">
              <motion.div key={cur.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                className="rounded-3xl bg-navy-2 p-8 ring-1 ring-white/10 md:p-10">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/45">What it feels like</p>
                <p className="mt-3 font-display text-3xl leading-snug md:text-[2rem]">{cur.feel}</p>
                <div className="my-8 h-px bg-white/10" />
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-mint">What we do</p>
                <p className="mt-3 text-lg leading-relaxed text-white/80">{cur.fix}</p>
                <p className="mt-6 inline-block rounded-full bg-mint/15 px-4 py-1.5 text-sm font-medium text-mint">{cur.service}</p>
                <div className="mt-8">
                  <a href="#contact" className="inline-flex items-center gap-2 font-semibold text-white underline decoration-mint decoration-2 underline-offset-8 hover:text-mint">
                    Talk to us about this <ArrowRight size={16} />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

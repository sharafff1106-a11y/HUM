import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { faqs } from "../content";
import { Eyebrow, Reveal } from "./ui";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-32">
      <Reveal>
        <Eyebrow>Questions</Eyebrow>
        <h2 className="mt-6 font-display text-5xl font-light tracking-tight md:text-6xl">Good to know.</h2>
      </Reveal>
      <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
        {faqs.map((f, i) => (
          <div key={f.q}>
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-2xl transition hover:text-gold">
              {f.q}
              <Plus className={`shrink-0 text-gold transition-transform duration-300 ${open === i ? "rotate-45" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <p className="max-w-2xl pb-6 text-lg leading-relaxed text-paper/60">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

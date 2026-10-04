import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { faqs } from "../content";
import { Chapter, Reveal } from "./ui";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto grid max-w-[1400px] gap-14 px-5 py-28 md:px-10 md:py-40 lg:grid-cols-[1fr_1.3fr]">
      <Reveal>
        <Chapter n="06">FAQ</Chapter>
        <h2 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.02em]">Before you <em className="text-blue">ask.</em></h2>
      </Reveal>
      <div className="border-t border-line">
        {faqs.map((f, i) => (
          <div key={f.q} className="border-b border-line">
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="grid w-full grid-cols-[56px_1fr_auto] items-center gap-2 py-7 text-left">
              <span className="label text-muted">Q.0{i + 1}</span>
              <span className="font-display text-[clamp(1.6rem,2.6vw,2.3rem)] leading-tight">{f.q}</span>
              <Plus size={22} strokeWidth={1.3} className={`transition-transform duration-300 ${open === i ? "rotate-45 text-blue" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <p className="max-w-xl pb-8 pl-[64px] text-[16px] leading-relaxed text-muted">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

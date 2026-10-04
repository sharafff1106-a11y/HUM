import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { services } from "../content";
import { Chapter, PillButton, Reveal } from "./ui";

export default function Services() {
  const [active, setActive] = useState(0);
  const s = services[active];

  return (
    <section id="services" className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
      <Reveal className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <Chapter n="01">Services</Chapter>
          <h2 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.02em]">Six ways <em className="text-blue">forward.</em></h2>
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-muted">One partner for every stage of your academic journey.</p>
      </Reveal>

      <div className="mt-16 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="label hidden grid-cols-[60px_1fr_auto] border-b border-line pb-4 text-muted md:grid"><span>No.</span><span>Service</span><span>For</span></div>
          <ul>
            {services.map((x, i) => (
              <li key={x.id} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}
                className={`relative grid grid-cols-[44px_1fr] items-baseline gap-x-4 border-b py-7 transition-all duration-500 md:grid-cols-[60px_1fr_auto] ${i === active ? "border-blue" : "border-line"}`}>
                <span className={`label transition ${i === active ? "text-blue" : "text-muted/60"}`}>0{i + 1}</span>
                <button onClick={() => setActive(i)} className="text-left">
                  <span className={`font-display text-[clamp(2.4rem,4.6vw,4.2rem)] leading-none tracking-[-0.02em] transition-colors duration-500 ${i === active ? "text-ink" : "text-ink/25"}`}>{x.title}</span>
                  <span className={`mt-2 block font-display text-[clamp(1.2rem,1.8vw,1.6rem)] italic transition-colors duration-500 ${i === active ? "text-blue" : "text-ink/20"}`}>{x.line}</span>
                </button>
                <span className={`label hidden transition md:block ${i === active ? "text-ink" : "text-muted/50"}`}>{x.for}</span>
                <p className="col-span-2 mt-3 text-[15px] text-muted lg:hidden">{x.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-32 rounded-2xl border border-line bg-card p-8">
            <AnimatePresence mode="wait">
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between"><span className="label text-blue">● 0{active + 1}</span><span className="label text-muted">{s.for}</span></div>
                <h3 className="mt-10 font-display text-5xl leading-none">{s.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">{s.text}</p>
                <ul className="mt-8 space-y-3 border-t border-line pt-6">
                  {s.includes.map((it) => <li key={it} className="flex gap-3 text-[15px]"><span className="text-blue">—</span>{it}</li>)}
                </ul>
              </motion.div>
            </AnimatePresence>
            <div className="mt-10"><PillButton href="#contact">Enquire</PillButton></div>
          </div>
        </div>
      </div>
    </section>
  );
}

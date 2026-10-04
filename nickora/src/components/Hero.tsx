import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, Lock, PenLine, ShieldCheck, FileText } from "lucide-react";

const tasks = [
  "Open each section with one clear claim",
  "Replace two summaries with a comparison of authors",
  "Move the methods justification before the results",
];

const trust = [
  { Icon: ShieldCheck, t: "Your work stays yours", s: "Guidance and editing, never ghostwriting" },
  { Icon: Lock, t: "Strictly confidential", s: "Drafts and details are never shared" },
  { Icon: FileText, t: "Written scope first", s: "Know what's included before you commit" },
  { Icon: PenLine, t: "Free first conversation", s: "No obligation, no pressure" },
];

export default function Hero() {
  const [done, setDone] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDone((d) => (d >= tasks.length ? 0 : d + 1)), 1700);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden bg-snow pt-[76px]">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full bg-tint blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:pb-28 lg:pt-24">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-7 text-[12px] font-semibold uppercase tracking-[0.2em] text-emerald">
            Private academic consultancy
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(3.1rem,7.4vw,6.6rem)] leading-[0.98] tracking-[-0.02em] text-ink">
            Get unstuck.<br />Stay original.<br /><em className="text-emerald">Finish strong.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-slate">
            Nickora supports students and researchers through admissions, dissertations, editing and referencing. We coach you
            to do your best work. We never do it for you.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" className="group inline-flex items-center gap-3 rounded-full bg-emerald px-8 py-4 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(10,133,103,.7)] transition hover:bg-emerald-dark">
              Book a free consultation <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </a>
            <a href="#struggles" className="rounded-full border border-ink/15 bg-white px-8 py-4 font-semibold text-ink transition hover:border-ink">What are you stuck on?</a>
          </motion.div>
          <p className="mt-8 text-sm text-slate">Undergraduate · Masters · PhD · International applicants</p>
        </div>

        {/* Product-style preview: unclear feedback turned into a plan */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_40px_80px_-30px_rgba(11,26,59,.3)] md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">Supervisor feedback</p>
            <p className="mt-3 rounded-2xl bg-snow p-4 font-display text-2xl italic leading-snug text-ink/80">“The argument isn't clear. Restructure Chapter 3.”</p>
            <div className="my-5 flex items-center gap-3 text-emerald">
              <span className="h-px flex-1 bg-line" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Your Nickora plan</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <ul className="space-y-3">
              {tasks.map((t, i) => (
                <li key={t} className="flex items-start gap-3">
                  <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-500 ${i < done ? "border-emerald bg-emerald text-white" : "border-line text-transparent"}`}>
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className={`text-[15px] leading-snug transition ${i < done ? "text-slate line-through decoration-slate/40" : "text-ink"}`}>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-xs text-slate">
              <span>Illustrative example</span>
              <span className="font-semibold text-emerald">{Math.min(done, tasks.length)} of {tasks.length} done</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative border-t border-line bg-white">
        <ul className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
          {trust.map(({ Icon, t, s }) => (
            <li key={t} className="flex items-start gap-3">
              <Icon size={22} className="mt-0.5 shrink-0 text-emerald" strokeWidth={1.7} />
              <span><b className="block text-sm font-semibold">{t}</b><span className="text-[13px] text-slate">{s}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

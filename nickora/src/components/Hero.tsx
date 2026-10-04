import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, BookOpenCheck, FileCheck2, Telescope } from "lucide-react";
import Constellation from "./Constellation";

const words = ["Shape", "your", "academic"];

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="top" className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden">
      <div className="aurora absolute -left-1/4 top-[-20%] -z-10 h-[70vw] w-[70vw] rounded-full bg-iris/25 blur-[140px]" />
      <div className="aurora absolute -right-1/4 bottom-[-30%] -z-10 h-[60vw] w-[60vw] rounded-full bg-aqua/15 blur-[140px]" style={{ animationDelay: "-9s" }} />
      <Constellation />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#070b1a_85%)]" />

      <motion.div style={{ y, opacity: fade }} className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-6 pb-20 pt-36 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-paper/80 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aqua" /> Education consultancy · Admissions to PhD
          </motion.p>

          <h1 className="font-display text-[clamp(3rem,8.2vw,7.5rem)] font-light leading-[0.95] tracking-[-0.03em]">
            {words.map((w, i) => (
              <span key={w} className="mr-[0.25em] inline-block overflow-hidden align-top">
                <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span>
              </span>
            ))}
            <br />
            <span className="inline-block overflow-hidden align-top">
              <motion.span className="text-gradient inline-block pr-3 italic" initial={{ y: "110%" }} animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}>future,</motion.span>
            </span>
            <span className="inline-block overflow-hidden align-top">
              <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}>with clarity.</motion.span>
            </span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-10 max-w-xl text-lg leading-relaxed text-paper/70">
            Nickora guides students and researchers from university admissions to PhD defence — mentoring, research
            support, editing and flawless referencing, tailored to you.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-4 font-semibold text-ink transition hover:bg-paper">
              Start with a free consultation
              <ArrowRight className="transition group-hover:translate-x-1" size={18} />
            </a>
            <a href="#services" className="rounded-full border border-white/20 px-7 py-4 font-medium text-paper transition hover:border-gold hover:text-gold">Explore services</a>
          </motion.div>
        </div>

        {/* Floating glass "orbit" cards */}
        <div className="relative mx-auto hidden h-[480px] w-full max-w-md lg:block" aria-hidden>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-dashed border-white/15" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute inset-20 rounded-full border border-gold/20" />
          <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold font-display text-5xl text-ink shadow-[0_0_80px_rgba(244,184,96,.55)]">N</div>
          {[
            { Icon: Telescope, t: "PhD Research", s: "Proposal → Viva", cls: "-left-6 top-[46%]", d: 0 },
            { Icon: FileCheck2, t: "Proofread", s: "Clear. Precise. Yours.", cls: "right-0 top-[20%]", d: 1.2 },
            { Icon: BookOpenCheck, t: "Citations", s: "APA · Harvard · IEEE", cls: "bottom-4 left-6", d: 2.4 },
          ].map(({ Icon, t, s, cls, d }) => (
            <motion.div key={t} animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, delay: d, ease: "easeInOut" }}
              className={`absolute ${cls} flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 shadow-2xl backdrop-blur-xl`}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold"><Icon size={20} /></span>
              <span><b className="block text-sm font-semibold">{t}</b><span className="text-xs text-paper/60">{s}</span></span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40 md:flex">
        Scroll
        <span className="h-10 w-px bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}

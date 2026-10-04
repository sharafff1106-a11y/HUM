import { useState } from "react";
import { motion } from "motion/react";
import { styles } from "../content";
import { Eyebrow, Reveal } from "./ui";

// Illustrative sample reference rendered in each style.
const sample: Record<string, string> = {
  "APA 7": "Rivera, A., & Chen, L. (2023). Learning how to learn: Metacognition in higher education. Journal of Academic Practice, 14(2), 45–62.",
  Harvard: "Rivera, A. and Chen, L. (2023) 'Learning how to learn: metacognition in higher education', Journal of Academic Practice, 14(2), pp. 45–62.",
  "MLA 9": "Rivera, Ana, and Li Chen. “Learning How to Learn: Metacognition in Higher Education.” Journal of Academic Practice, vol. 14, no. 2, 2023, pp. 45–62.",
  Chicago: "Rivera, Ana, and Li Chen. 2023. “Learning How to Learn: Metacognition in Higher Education.” Journal of Academic Practice 14 (2): 45–62.",
  IEEE: "[1] A. Rivera and L. Chen, “Learning how to learn: Metacognition in higher education,” J. Acad. Pract., vol. 14, no. 2, pp. 45–62, 2023.",
  Vancouver: "1. Rivera A, Chen L. Learning how to learn: metacognition in higher education. J Acad Pract. 2023;14(2):45-62.",
  OSCOLA: "Ana Rivera and Li Chen, ‘Learning How to Learn: Metacognition in Higher Education’ (2023) 14(2) Journal of Academic Practice 45.",
  AMA: "Rivera A, Chen L. Learning how to learn: metacognition in higher education. J Acad Pract. 2023;14(2):45-62.",
};

const before = "Students who is using many strategy's performs more better, however the results was not significant (Rivera 2023).";
const after = "Students who use multiple strategies perform better; however, the results were not statistically significant (Rivera & Chen, 2023).";

export default function Craft() {
  const [style, setStyle] = useState("APA 7");
  const [edited, setEdited] = useState(false);

  return (
    <section id="craft" className="grain relative bg-paper py-32 text-ink">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <Eyebrow dark>The craft</Eyebrow>
          <h2 className="mt-6 font-display text-5xl font-light leading-[1.05] tracking-tight md:text-7xl">
            Details are where <span className="italic text-[#b8741a]">grades are won.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <Reveal className="rounded-3xl bg-white p-8 shadow-[0_30px_80px_-30px_rgba(7,11,26,.25)] md:p-10">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-3xl">Editing, felt.</h3>
              <button onClick={() => setEdited(!edited)} role="switch" aria-checked={edited}
                className={`relative h-10 w-[150px] rounded-full text-xs font-semibold transition ${edited ? "bg-ink text-gold" : "bg-ink/10 text-ink/60"}`}>
                <span className={`absolute top-1 h-8 w-[70px] rounded-full bg-gold transition-all ${edited ? "left-[76px]" : "left-1"}`} />
                <span className="absolute left-0 top-3 z-10 w-[75px] text-center text-ink">Raw</span>
                <span className={`absolute right-0 top-3 z-10 w-[75px] text-center ${edited ? "text-ink" : "text-ink/60"}`}>Polished</span>
              </button>
            </div>
            <motion.p key={String(edited)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-8 font-display text-2xl leading-relaxed ${edited ? "text-ink" : "text-ink/55 line-through decoration-red-400/70 decoration-1"}`}>
              {edited ? after : before}
            </motion.p>
            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-ink/50">
              {edited ? "Grammar · agreement · precision · citation" : "6 issues detected — flip the switch"}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="rounded-3xl bg-ink p-8 text-paper shadow-[0_30px_80px_-30px_rgba(7,11,26,.6)] md:p-10">
            <h3 className="font-display text-3xl">One source, any style.</h3>
            <div className="mt-6 flex flex-wrap gap-2">
              {styles.map((s) => (
                <button key={s} onClick={() => setStyle(s)} aria-pressed={s === style}
                  className={`rounded-full border px-4 py-1.5 text-sm transition ${s === style ? "border-gold bg-gold text-ink" : "border-white/20 text-paper/70 hover:border-gold"}`}>{s}</button>
              ))}
            </div>
            <motion.p key={style} initial={{ opacity: 0, filter: "blur(6px)" }} animate={{ opacity: 1, filter: "blur(0px)" }}
              className="mt-8 min-h-[120px] rounded-2xl border border-white/10 bg-white/5 p-5 font-mono text-[13px] leading-relaxed text-paper/85">
              {sample[style]}
            </motion.p>
            <p className="mt-4 text-sm text-paper/50">Illustrative example. We format your real bibliography to your institution's exact guide.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

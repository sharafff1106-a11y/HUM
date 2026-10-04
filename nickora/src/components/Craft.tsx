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
    <section id="craft" className="bg-snow py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>The craft</Eyebrow>
          <h2 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">Small details decide grades.</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-3xl border border-line bg-white p-8 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-display text-3xl">Editing, in your own voice</h3>
              <div role="group" aria-label="Before or after editing" className="inline-flex rounded-full bg-snow p-1 text-sm font-semibold">
                {[false, true].map((v) => (
                  <button key={String(v)} onClick={() => setEdited(v)} aria-pressed={edited === v}
                    className={`rounded-full px-5 py-2 transition ${edited === v ? "bg-ink text-white" : "text-slate"}`}>{v ? "Edited" : "Draft"}</button>
                ))}
              </div>
            </div>
            <motion.p key={String(edited)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-8 min-h-[130px] font-display text-[1.7rem] leading-relaxed ${edited ? "text-ink" : "text-slate"}`}>
              {edited ? after : before}
            </motion.p>
            <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-slate">
              {edited ? "Agreement, precision, punctuation, citation fixed" : "6 issues, press Edited to see the fix"}
            </p>
          </Reveal>

          <Reveal delay={0.08} className="rounded-3xl bg-navy p-8 text-white md:p-10">
            <h3 className="font-display text-3xl">One source, any style</h3>
            <div className="mt-6 flex flex-wrap gap-2">
              {styles.map((s) => (
                <button key={s} onClick={() => setStyle(s)} aria-pressed={s === style}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${s === style ? "border-mint bg-mint text-ink" : "border-white/20 text-white/75 hover:border-white/50"}`}>{s}</button>
              ))}
            </div>
            <motion.p key={style} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="mt-8 min-h-[130px] rounded-2xl bg-white/[0.06] p-5 text-[15px] leading-relaxed text-white/90 ring-1 ring-white/10">
              {sample[style]}
            </motion.p>
            <p className="mt-4 text-sm text-white/50">Illustrative example. We format your real bibliography to your institution's exact guide.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { Chapter, Reveal } from "./ui";

const edits = [
  ["The aim of this study are to explore how student learns.", "This study explores how students learn."],
  ["Many researcher has argued that feedback is important (smith 2019).", "Many researchers argue that feedback matters (Smith, 2019)."],
  ["However the result's was not significant.", "However, the results were not significant."],
  ["In conclusion it can be said that more research is needed in the future.", "Further research is needed."],
];

export default function Promise() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(Math.min(Math.max(v, 0), 1)));
  const done = Math.round(p * edits.length);

  return (
    <section id="promise" ref={ref} className="bg-ink px-5 py-28 text-white md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="rounded-2xl bg-white/[0.04] p-7 ring-1 ring-white/10 md:p-9">
          <div className="flex justify-between"><span className="label text-white/50">Scroll to review the draft</span><span className="label text-white/50"><b className="font-normal text-[#8f9bff]">{Math.round(p * 100)}%</b> reviewed</span></div>
          <div className="mt-8 space-y-5 rounded-xl bg-paper p-6 text-ink md:p-8">
            <p className="label text-muted">Chapter 1 · Introduction</p>
            {edits.map(([a, b], i) => (
              <p key={i} className="font-display text-[1.35rem] leading-snug">
                {i < done ? <span>{b}</span> : <span className="text-ink/45 line-through decoration-[#d14b3a] decoration-1">{a}</span>}
              </p>
            ))}
          </div>
          <div className="mt-5 h-px bg-white/10"><div className="h-px bg-[#8f9bff] transition-all" style={{ width: `${p * 100}%` }} /></div>
        </Reveal>

        <Reveal delay={0.1}>
          <Chapter n="04">Our promise</Chapter>
          <h2 className="mt-6 font-display text-[clamp(2.8rem,5.6vw,5.4rem)] leading-[0.98] tracking-[-0.02em]">
            We never write your work. <em className="text-[#8f9bff]">We make you better at it.</em>
          </h2>
          <p className="mt-8 max-w-lg text-[16px] leading-relaxed text-white/60">Guidance, mentoring and careful editing. Every word you submit stays yours, so you're safe under university rules and stronger for the next one.</p>
          <dl className="mt-10 divide-y divide-white/10 border-y border-white/10 text-[15px]">
            {[["Focus", "Admissions · Research · Editing"], ["Levels", "Undergraduate · Masters · PhD"], ["Privacy", "Your drafts are never shared"]].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] py-4"><dt className="label text-white/40">{k}</dt><dd className="text-white/85">{v}</dd></div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

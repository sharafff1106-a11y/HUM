import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { steps } from "../content";
import { Chapter, Reveal } from "./ui";
import { FinishScene, PlanScene, TalkScene, WorkScene } from "./ProcessScenes";

const scenes = [TalkScene, PlanScene, WorkScene, FinishScene];
const STEP_MS = 4200;

export default function Process() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);

  // Walk through the steps like a flow explainer; hovering a card takes over.
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => { setActive((a) => (a + 1) % steps.length); setCycle((c) => c + 1); }, STEP_MS);
    return () => clearTimeout(id);
  }, [active, paused, cycle]);

  const go = (i: number) => { if (i !== active) { setActive(i); setCycle((c) => c + 1); } };

  return (
    <section id="process" className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
      <Reveal className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <Chapter n="03">Process</Chapter>
          <h2 className="mt-6 font-display text-[clamp(3.2rem,9vw,8.5rem)] leading-[0.9] tracking-[-0.025em]">Clear steps,<br /><em className="text-blue">real progress.</em></h2>
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-muted lg:justify-self-end">Four steps. You always know what happens next and what it costs.</p>
      </Reveal>

      {/* Flow line connecting the steps */}
      <div className="relative mt-20 hidden h-8 lg:block" aria-hidden>
        <div className="absolute left-[12.5%] right-[12.5%] top-1/2 h-px bg-line" />
        <motion.div className="absolute left-[12.5%] top-1/2 h-[2px] -translate-y-px bg-blue" animate={{ width: `${(active / 3) * 75}%` }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
        {steps.map((s, i) => (
          <button key={s.title} onClick={() => go(i)} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${12.5 + i * 25}%` }} tabIndex={-1}>
            <span className={`grid h-8 w-8 place-items-center rounded-full border font-mono text-[10px] transition-colors duration-500 ${i <= active ? "border-blue bg-blue text-white" : "border-line bg-paper text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
            {i === active && <span className="absolute inset-0 animate-ping rounded-full bg-blue/30" />}
          </button>
        ))}
      </div>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-6 lg:grid-cols-4" onMouseLeave={() => setPaused(false)}>
        {steps.map((s, i) => {
          const Scene = scenes[i];
          const on = i === active;
          return (
            <Reveal key={s.title} delay={i * 0.08}>
              <li onMouseEnter={() => { setPaused(true); go(i); }} onClick={() => go(i)}
                className={`h-full cursor-pointer rounded-2xl border bg-card p-7 transition-all duration-500 ${on ? "-translate-y-1 border-blue/50 shadow-[0_24px_50px_-28px_rgba(42,58,209,.55)]" : "border-line"}`}>
                <div className="flex items-center justify-between">
                  <span className={`label transition-colors ${on ? "text-blue" : "text-muted"}`}>Step 0{i + 1}</span>
                  <span className={`h-1.5 w-1.5 rounded-full transition-colors ${on ? "bg-blue" : "bg-line"}`} />
                </div>
                <h3 className="mt-6 font-display text-5xl">{s.title}</h3>
                <div className={`my-7 h-36 overflow-hidden rounded-xl p-2 transition-colors duration-500 ${on ? "bg-blue-soft/50" : "bg-paper"}`}>
                  <Scene key={on ? `run-${cycle}` : "rest"} run={on} />
                </div>
                <p className="text-[15px] leading-relaxed text-muted">{s.text}</p>
                <div className="mt-6 h-[2px] overflow-hidden rounded bg-line/60">
                  {on && !paused && <motion.div key={cycle} className="h-full bg-blue" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: STEP_MS / 1000, ease: "linear" }} />}
                  {on && paused && <div className="h-full w-full bg-blue" />}
                </div>
              </li>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}

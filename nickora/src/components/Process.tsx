import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { journey } from "../content";
import { Eyebrow, Reveal } from "./ui";

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="process" className="relative bg-ink-2 py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1.4fr]">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>The Nickora method</Eyebrow>
          <h2 className="mt-6 font-display text-5xl font-light leading-[1.05] tracking-tight md:text-6xl">
            A clear path, <span className="text-gradient italic">step by step.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-paper/60">No guesswork, no overwhelm. Every student gets a plan, a mentor and honest feedback.</p>
        </Reveal>

        <div ref={ref} className="relative pl-12">
          <div className="absolute bottom-0 left-[15px] top-0 w-px bg-white/10" />
          <motion.div style={{ scaleY }} className="absolute bottom-0 left-[15px] top-0 w-px origin-top bg-gradient-to-b from-gold to-aqua" />
          {journey.map((s) => (
            <Reveal key={s.n} className="relative pb-16 last:pb-0">
              <span className="absolute -left-12 top-1 grid h-8 w-8 place-items-center rounded-full border border-gold bg-ink font-mono text-[10px] text-gold">{s.n}</span>
              <h3 className="font-display text-4xl">{s.title}</h3>
              <p className="mt-3 max-w-lg text-lg leading-relaxed text-paper/60">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

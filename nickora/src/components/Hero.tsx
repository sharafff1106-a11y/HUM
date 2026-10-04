import { motion } from "motion/react";
import Pages from "./Pages";
import { PillButton } from "./ui";
import { sec } from "../router";

const line = (text: string, delay: number, cls = "") => (
  <span className="block overflow-hidden pb-[0.16em] -mb-[0.08em]">
    <motion.span className={`block ${cls}`} initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}>{text}</motion.span>
  </span>
);

export default function Hero() {
  return (
    <section id="top" className="relative flex flex-col justify-end overflow-hidden px-5 pb-16 pt-24 md:min-h-[100svh] md:px-10 md:pb-16 md:pt-28">
      <div className="relative -mx-2 mb-4 h-[min(62vw,330px)] md:absolute md:left-1/2 md:top-[86px] md:mx-0 md:mb-0 md:h-[42vh] lg:h-[50vh] md:w-[min(820px,96vw)] md:-translate-x-1/2">
        <Pages />
        <p className="label pointer-events-none absolute right-2 top-3 hidden text-muted md:block">Click the book to turn the page</p>
      </div>
      <p className="label -mt-1 mb-8 text-center text-muted md:hidden">Tap the book to turn the page</p>

      <div className="relative mx-auto grid w-full max-w-[1400px] items-end gap-10 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="label text-ink">Education consultancy</p>
          <p className="label mt-2 text-muted">Admissions · Mentoring · Research · Editing</p>
          <h1 className="mt-6 font-display text-[clamp(3.4rem,9.6vw,9.5rem)] leading-[0.92] tracking-[-0.025em]">
            {line("Turn the page", 0.2)}
            {line("on being stuck.", 0.35, "italic text-blue")}
          </h1>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex flex-col items-start gap-6 lg:items-end">
          <p className="max-w-xs text-[15px] leading-relaxed text-muted lg:text-right">Expert guidance from admission to PhD. Your work, made stronger.</p>
          <div className="flex flex-wrap items-center gap-6">
            <PillButton href={sec("contact")}>Talk with Nick</PillButton>
            <a href={sec("services")} className="border-b border-ink/40 pb-1 text-[15px] transition hover:border-blue hover:text-blue">Our services</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { sec } from "../router";

// Slides up on view; stays readable if the observer never fires.
export function Reveal({ children, delay = 0, className, ...rest }: { children: ReactNode; delay?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div initial={{ opacity: 0.2, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }} className={className} {...rest}>
      {children}
    </motion.div>
  );
}

export function Chapter({ n, children }: { n: string; children: ReactNode }) {
  return <p className="label text-muted">{n} — {children}</p>;
}

export function Wordmark() {
  return (
    <a href={sec("top")} aria-label="Nickora home" className="leading-none">
      <span className="block text-[17px] font-semibold tracking-[0.32em]">NICKORA</span>
      <span className="mt-1 block text-[12px] text-muted">Education Consultancy</span>
    </a>
  );
}

export function PillButton({ href, children, dark = true }: { href: string; children: ReactNode; dark?: boolean }) {
  return (
    <a href={href} className={`group inline-flex items-center gap-4 rounded-full border py-2 pl-7 pr-2 text-[15px] font-medium transition ${dark ? "border-ink bg-ink text-white hover:bg-blue hover:border-blue" : "border-line bg-card text-ink hover:border-ink"}`}>
      {children}
      <span className="grid h-11 w-11 place-items-center rounded-full bg-blue text-white transition group-hover:bg-white group-hover:text-blue">
        <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

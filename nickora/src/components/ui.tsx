import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

// Slides up on view; stays readable if the observer never fires.
export function Reveal({ children, delay = 0, className, ...rest }: { children: ReactNode; delay?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0.25, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span className={`text-[12px] font-semibold uppercase tracking-[0.2em] ${light ? "text-mint" : "text-emerald"}`}>{children}</span>
  );
}

export function Wordmark({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <a href="#top" aria-label="Nickora home" className={`font-display text-[1.75rem] leading-none tracking-tight ${light ? "text-white" : "text-ink"} ${className}`}>
      Nickora
    </a>
  );
}

import { motion, type HTMLMotionProps } from "motion/react";
import type { MouseEvent, ReactNode } from "react";

export function Reveal({ children, delay = 0, className, ...rest }: { children: ReactNode; delay?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] ${dark ? "text-ink/60" : "text-gold"}`}>
      <span className={`h-px w-8 ${dark ? "bg-ink/40" : "bg-gold/70"}`} />
      {children}
    </span>
  );
}

export function spotlight(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Nickora home">
      <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden>
        <rect width="64" height="64" rx="16" fill="#f4b860" />
        <path d="M18 46V18l28 28V18" fill="none" stroke="#070b1a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="46" cy="18" r="3.5" fill="#070b1a" />
      </svg>
      <span className="font-display text-2xl tracking-tight">Nickora</span>
    </a>
  );
}

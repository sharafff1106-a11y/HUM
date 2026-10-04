import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";
import { brand } from "../content";
import NickAvatar from "./NickAvatar";
import { Wordmark } from "./ui";
import { JOURNAL, sec } from "../router";

type Page = "home" | "journal" | "article";

const links = [
  { n: "01", label: "Services", key: "services", href: sec("services"), ids: ["services", "struggles"] },
  { n: "02", label: "Process", key: "process", href: sec("process"), ids: ["process"] },
  { n: "03", label: "Promise", key: "promise", href: sec("promise"), ids: ["promise"] },
  { n: "04", label: "Journal", key: "journal", href: JOURNAL, ids: ["journal-teaser"] },
  { n: "05", label: "FAQ", key: "faq", href: sec("faq"), ids: ["faq"] },
];

// Table-of-contents entries for the mobile menu, with "page numbers" like a real book.
const contents = [
  { label: "Services", href: sec("services"), page: 3 },
  { label: "Common struggles", href: sec("struggles"), page: 9 },
  { label: "Process", href: sec("process"), page: 14 },
  { label: "Our promise", href: sec("promise"), page: 21 },
  { label: "Journal", href: JOURNAL, page: 28 },
  { label: "FAQ", href: sec("faq"), page: 36 },
  { label: "Contact", href: sec("contact"), page: 42 },
];

function Squiggle({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 60 8" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-1.5 left-0 h-2 w-full" aria-hidden>
      <motion.path d="M1 5 C10 1 18 7 28 4 S48 2 59 5" fill="none" stroke="#2a3ad1" strokeWidth="1.6" strokeLinecap="round"
        initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.35, ease: "easeOut" }} />
    </svg>
  );
}

function TalkButton({ compact = false }: { compact?: boolean }) {
  return (
    <a href={sec("contact")} className="group flex items-center gap-3 rounded-full border border-ink/10 bg-card py-1.5 pl-1.5 pr-2 shadow-[0_8px_24px_-12px_rgba(17,19,24,.35)] transition hover:border-ink/30">
      <span className="transition-transform duration-300 group-hover:-rotate-6"><NickAvatar size={compact ? 34 : 38} /></span>
      {!compact && (
        <span className="leading-tight">
          <span className="label block text-[9.5px] text-muted">Free 1:1 call</span>
          <span className="block text-[14px] font-semibold">Talk with Nick</span>
        </span>
      )}
      <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white transition group-hover:bg-blue">
        <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

export default function Nav({ page }: { page: Page }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(page === "home" ? null : "journal");
  const { scrollY, scrollYProgress } = useScroll();
  const ink = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // Hide while reading down, reveal on the way up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(!open && y > 300 && y > prev + 2);
    if (y < prev - 2) setHidden(false);
  });

  // Which chapter is on screen.
  useEffect(() => {
    if (page !== "home") { setActive("journal"); return; }
    const f = () => {
      const mark = scrollY.get() + innerHeight * 0.4;
      let cur: string | null = null;
      for (const l of links) for (const id of l.ids) { const el = document.getElementById(id); if (el && el.offsetTop <= mark) cur = l.key; }
      const contact = document.getElementById("contact");
      if (contact && contact.offsetTop <= mark) cur = null;
      setActive(cur);
    };
    f();
    const un = scrollY.on("change", f);
    return () => un();
  }, [page, scrollY]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <motion.header className="fixed inset-x-0 top-0 z-50" animate={{ y: hidden ? -100 : 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
        <div className="absolute inset-0 border-b border-line/70 bg-paper/80 backdrop-blur-xl" />
        <motion.div className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-blue" style={{ scaleX: ink }} />
        <nav className="relative mx-auto flex h-[78px] max-w-[1400px] items-center justify-between gap-6 px-5 md:px-10">
          <Wordmark />

          <ul className="relative hidden items-center gap-1 rounded-full border border-ink/10 bg-card/80 p-1.5 shadow-[0_10px_30px_-18px_rgba(17,19,24,.4)] lg:flex" onMouseLeave={() => setHover(null)}>
            {links.map((l) => {
              const on = active === l.key;
              return (
                <li key={l.href} className="relative">
                  {on && <motion.span layoutId="ink-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <a href={l.href} onMouseEnter={() => setHover(l.href)}
                    className={`relative flex items-baseline gap-1.5 rounded-full px-4 py-2 text-[14px] transition-colors ${on ? "text-white" : "text-ink/70 hover:text-ink"}`}>
                    <span className={`font-mono text-[9.5px] ${on ? "text-[#8f9bff]" : "text-blue"}`}>{l.n}</span>
                    <span className="relative">{l.label}{!on && <Squiggle on={hover === l.href} />}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block"><TalkButton /></div>
            <div className="sm:hidden"><TalkButton compact /></div>
            <button onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-card lg:hidden">
              <motion.span className="absolute h-[1.6px] w-5 bg-ink" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} />
              <motion.span className="absolute h-[1.6px] w-5 bg-ink" animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div data-lenis-prevent className="fixed inset-0 z-40 overflow-y-auto bg-paper px-5 pb-10 pt-[100px] lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}>
            <p className="label text-muted">Table of contents</p>
            <h2 className="mt-2 font-display text-5xl italic text-blue">Contents</h2>
            <ol className="mt-8">
              {contents.map((c, i) => (
                <motion.li key={c.href} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }}>
                  <a href={c.href} onClick={() => setOpen(false)} className="flex items-baseline gap-3 border-b border-line py-4">
                    <span className="font-mono text-[11px] text-blue">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-[1.9rem] leading-none">{c.label}</span>
                    <span className="mb-1 flex-1 border-b border-dotted border-ink/30" />
                    <span className="font-mono text-[12px] text-muted">p. {c.page}</span>
                  </a>
                </motion.li>
              ))}
            </ol>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10 rounded-2xl bg-ink p-6 text-white">
              <div className="flex items-center gap-4">
                <NickAvatar size={52} />
                <div>
                  <p className="font-display text-3xl leading-none">Talk with Nick</p>
                  <p className="mt-1 text-[14px] text-white/60">Free first conversation</p>
                </div>
              </div>
              <a href={sec("contact")} onClick={() => setOpen(false)} className="mt-6 flex items-center justify-between rounded-full bg-white px-6 py-3.5 font-medium text-ink">
                Book your call <ArrowRight size={18} />
              </a>
              <p className="mt-4 select-all text-center text-[13px] text-white/50">{brand.email}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

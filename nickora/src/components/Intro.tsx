import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SIGNATURE, SIGNATURE_VIEWBOX } from "./signature";

const KEY = "nickora-intro-seen";
const WRITE_MS = 2300;

// A fountain pen, nib tip at (0,0), body extending along +x. Rotated so it rests like a writing hand.
function Pen() {
  return (
    <svg width="260" height="60" viewBox="-4 -30 264 60" overflow="visible" style={{ position: "absolute", left: -4, top: -30, transform: "rotate(-38deg)", transformOrigin: "4px 30px", filter: "drop-shadow(6px 14px 10px rgba(17,19,24,.22))" }}>
      <defs>
        <linearGradient id="nib" x1="0" y1="-12" x2="0" y2="12" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#f2f3f6" /><stop offset=".55" stopColor="#c3c7cf" /><stop offset="1" stopColor="#7d838e" /></linearGradient>
        <linearGradient id="body" x1="0" y1="-14" x2="0" y2="14" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#3a3e49" /><stop offset=".35" stopColor="#15171d" /><stop offset="1" stopColor="#0b0c10" /></linearGradient>
      </defs>
      <path d="M0 0 L42 -10 Q48 0 42 10 Z" fill="url(#nib)" />
      <path d="M2 0 L30 0" stroke="#4b505a" strokeWidth="1.1" />
      <circle cx="30" cy="0" r="2" fill="#4b505a" />
      <rect x="42" y="-10" width="40" height="20" rx="4" fill="url(#body)" />
      <rect x="80" y="-13" width="170" height="26" rx="12" fill="url(#body)" />
      <rect x="136" y="-13.2" width="7" height="26.4" fill="#cfd2d9" />
      <rect x="144" y="-13.2" width="5" height="26.4" fill="#2a3ad1" />
      <path d="M92 -7 H236" stroke="rgba(255,255,255,.28)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M170 -14 H226 Q232 -14 232 -8 V-4" stroke="#cfd2d9" strokeWidth="3" fill="none" />
    </svg>
  );
}

export default function Intro() {
  const [show, setShow] = useState(() => {
    try {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      return !sessionStorage.getItem(KEY);
    } catch { return true; }
  });
  const [stage, setStage] = useState<"write" | "done">("write");
  const svg = useRef<SVGSVGElement>(null);
  const pen = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;
    try { sessionStorage.setItem(KEY, "1"); } catch { /* storage may be blocked */ }
    document.documentElement.style.overflow = "hidden";
    const paths = [...svg.current!.querySelectorAll<SVGPathElement>("path.ink")];
    const lens = paths.map((p) => p.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0);
    paths.forEach((p, i) => { p.style.strokeDasharray = `${lens[i]}`; p.style.strokeDashoffset = `${lens[i]}`; });

    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      // Ease the overall pace, then distribute distance across strokes in order.
      const t = Math.min((now - t0) / WRITE_MS, 1);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      let dist = e * total, idx = 0;
      for (; idx < paths.length; idx++) {
        const l = lens[idx];
        if (dist <= l) break;
        paths[idx].style.strokeDashoffset = "0";
        dist -= l;
      }
      if (idx < paths.length) {
        paths[idx].style.strokeDashoffset = `${lens[idx] - dist}`;
        for (let j = idx + 1; j < paths.length; j++) paths[j].style.strokeDashoffset = `${lens[j]}`;
        const pt = paths[idx].getPointAtLength(dist).matrixTransform(paths[idx].getScreenCTM()!);
        if (pen.current) pen.current.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
      }
      if (t < 1) raf = requestAnimationFrame(tick);
      else setStage("done");
    };
    raf = requestAnimationFrame(tick);
    const end = setTimeout(() => setShow(false), WRITE_MS + 1500);
    return () => { cancelAnimationFrame(raf); clearTimeout(end); document.documentElement.style.overflow = ""; };
  }, [show]);

  useEffect(() => { if (!show) document.documentElement.style.overflow = ""; }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div key="intro" data-lenis-prevent className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-paper"
          exit={{ y: "-100%" }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}>
          <div className="relative w-[min(620px,78vw)]">
            <svg ref={svg} viewBox={SIGNATURE_VIEWBOX} className="block h-auto w-full overflow-visible" aria-label="Nickora">
              <g fill="none" stroke="#1e2a86" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round">
                {SIGNATURE.map((d, i) => <path key={i} className="ink" d={d} />)}
              </g>
            </svg>
            <motion.svg viewBox="0 0 600 30" className="mt-3 h-auto w-full" initial={false}>
              <motion.path d="M20 18 C160 6 420 6 590 14" fill="none" stroke="#2a3ad1" strokeWidth="3" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: stage === "done" ? 1 : 0, opacity: stage === "done" ? 1 : 0 }} transition={{ duration: 0.5, ease: "easeOut" }} />
            </motion.svg>
            <motion.p className="label mt-4 text-center text-muted" initial={{ opacity: 0, y: 8 }} animate={{ opacity: stage === "done" ? 1 : 0, y: stage === "done" ? 0 : 8 }} transition={{ delay: 0.2 }}>
              Education consultancy
            </motion.p>
          </div>
          <div ref={pen} className="pointer-events-none fixed left-0 top-0" style={{ transform: "translate(-400px,-400px)" }}>
            <motion.div animate={stage === "done" ? { opacity: 0, x: 140, y: -140 } : { opacity: 1 }} transition={{ duration: 0.7, ease: "easeIn" }}>
              <Pen />
            </motion.div>
          </div>
          <button onClick={() => setShow(false)} className="label absolute bottom-8 right-8 text-muted transition hover:text-ink">Skip</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

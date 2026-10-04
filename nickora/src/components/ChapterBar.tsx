import { useEffect, useRef, useState } from "react";
import { chapters } from "../content";

// Fixed "table of contents" ruler: segments sized to each section, playhead at scroll position, drag to scroll.
export default function ChapterBar() {
  const bar = useRef<HTMLDivElement>(null);
  const [segs, setSegs] = useState<{ id: string; label: string; w: number }[]>([]);
  const [p, setP] = useState(0);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const measure = () => {
      const total = document.documentElement.scrollHeight;
      setSegs(chapters.map((c, i) => {
        const el = document.getElementById(c.id)!;
        const next = chapters[i + 1] && document.getElementById(chapters[i + 1].id);
        const end = next ? next.offsetTop : total;
        return { ...c, w: (end - el.offsetTop) / total };
      }));
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setP(max > 0 ? scrollY / max : 0);
      const cur = [...chapters].reverse().find((c) => (document.getElementById(c.id)?.offsetTop ?? 0) <= scrollY + innerHeight * 0.4);
      setActive(cur?.id ?? "top");
    };
    measure(); onScroll();
    const ro = new ResizeObserver(measure); ro.observe(document.body);
    addEventListener("scroll", onScroll, { passive: true });
    return () => { ro.disconnect(); removeEventListener("scroll", onScroll); };
  }, []);

  const seek = (clientX: number) => {
    const r = bar.current!.getBoundingClientRect();
    const f = Math.min(Math.max((clientX - r.left) / r.width, 0), 1);
    scrollTo({ top: f * (document.documentElement.scrollHeight - innerHeight) });
  };
  const down = (e: React.PointerEvent) => {
    seek(e.clientX);
    const mv = (ev: PointerEvent) => seek(ev.clientX);
    const up = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); };
    addEventListener("pointermove", mv); addEventListener("pointerup", up);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 hidden border-t border-line bg-paper/85 backdrop-blur-xl md:block">
      <div className="mx-auto flex h-11 max-w-[1400px] items-center gap-6 px-10">
        <span className="label shrink-0 text-muted">Drag to scroll</span>
        <div ref={bar} onPointerDown={down} className="relative flex h-7 flex-1 select-none gap-1" aria-label="Page chapters">
          {segs.map((s) => (
            <div key={s.id} style={{ flexGrow: s.w }}
              className={`relative flex items-center overflow-hidden rounded-[3px] border px-2 text-[12px] transition ${active === s.id ? "border-blue/40 bg-blue-soft text-blue" : "border-line text-muted"}`}>
              <span className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 7px)", maskImage: "linear-gradient(transparent 72%, #000 72%)", WebkitMaskImage: "linear-gradient(transparent 72%, #000 72%)" }} />
              <span className="relative z-10 -mt-1.5 truncate">{s.label}</span>
            </div>
          ))}
          <div className="pointer-events-none absolute -top-2 bottom-0 w-px bg-blue" style={{ left: `${p * 100}%` }}>
            <span className="absolute -left-[4px] -top-[2px] h-0 w-0 border-x-[4.5px] border-t-[6px] border-x-transparent border-t-blue" />
          </div>
        </div>
      </div>
    </div>
  );
}

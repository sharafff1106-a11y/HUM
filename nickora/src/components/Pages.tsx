import { useEffect, useRef } from "react";

// An open book drawn in ink: pages fan and turn continuously; the cursor sets the pace.
export default function Pages() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, t = 0, speed = 1, target = 1;
    const resize = () => {
      const d = Math.min(devicePixelRatio, 2);
      w = c.offsetWidth; h = c.offsetHeight;
      c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      target = 0.4 + Math.min(Math.max(nx, 0), 1) * 2.2;
    };

    const N = 46;
    const draw = () => {
      speed += (target - speed) * 0.04;
      t += 0.0016 * speed;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.78, R = Math.min(w * 0.46, h * 0.95);
      for (let i = 0; i < N; i++) {
        // Each page's progress loops 0→1; easing bunches pages into the two stacks.
        const p = (i / N + t) % 1;
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        const a = e * Math.PI;
        const lift = Math.sin(a);
        const ex = cx + Math.cos(a) * R, ey = cy - lift * R * 0.62 + (1 - lift) * 6;
        const kx = cx + Math.cos(a) * R * 0.5 + Math.cos(a) * 18, ky = cy - lift * R * 0.85 - 10;
        const alpha = 0.12 + lift * 0.55;
        ctx.strokeStyle = `rgba(42,58,209,${alpha})`;
        ctx.lineWidth = 0.6 + lift * 0.9;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.quadraticCurveTo(kx, ky, ex, ey); ctx.stroke();
        if (lift > 0.85) { ctx.fillStyle = "rgba(42,58,209,.9)"; ctx.beginPath(); ctx.arc(ex, ey, 2.2, 0, 6.283); ctx.fill(); }
      }
      // Spine and resting stacks
      ctx.strokeStyle = "rgba(17,19,24,.55)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - R, cy + 6); ctx.quadraticCurveTo(cx - R * 0.5, cy + 16, cx, cy); ctx.quadraticCurveTo(cx + R * 0.5, cy + 16, cx + R, cy + 6); ctx.stroke();
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    addEventListener("resize", resize); addEventListener("pointermove", onMove);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("pointermove", onMove); };
  }, []);

  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}

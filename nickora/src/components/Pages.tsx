import { useEffect, useRef } from "react";

// A hardcover book lying open, drawn in 3D perspective on canvas.
// Curved page surfaces, stacked page edges, printed lines, a shadowed gutter,
// and a page that lifts, curls and turns. The cursor tilts the camera.
export default function Pages() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    let yaw = 0, pitch = 0.98, tYaw = 0, tPitch = 0.98;
    const start = performance.now();

    const resize = () => {
      const d = Math.min(devicePixelRatio, 2);
      w = c.offsetWidth; h = c.offsetHeight;
      c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const onMove = (e: PointerEvent) => {
      tYaw = (e.clientX / innerWidth - 0.5) * 0.32;
      tPitch = 0.98 + (e.clientY / innerHeight - 0.5) * 0.14;
    };

    const D = 1.36, SEG = 22, F = 5;
    let U = 1, cx = 0, cy = 0;
    const proj = (x: number, y: number, z: number): [number, number] => {
      const cY = Math.cos(yaw), sY = Math.sin(yaw);
      const X = x * cY + z * sY, Z = -x * sY + z * cY;
      const ca = Math.cos(pitch), sa = Math.sin(pitch);
      const up = y * ca - Z * sa;
      const toward = Z * ca + y * sa;
      const s = F / (F - toward);
      return [cx + X * s * U, cy - up * s * U];
    };

    // Integrate a page's cross-section from the spine given angle θ(s).
    const curve = (theta: (s: number) => number, y0: number) => {
      const pts: [number, number, number][] = [[0, y0, theta(0)]];
      let x = 0, y = y0;
      for (let i = 1; i <= SEG; i++) {
        const th = theta((i - 0.5) / SEG);
        x += Math.cos(th) / SEG; y += Math.sin(th) / SEG;
        pts.push([x, y, theta(i / SEG)]);
      }
      return pts;
    };
    const rightRest = (s: number) => 1.05 * Math.exp(-s * 10);
    const leftRest = (s: number) => Math.PI - rightRest(s);

    const poly = (pts: [number, number][], fill: string, seam = false) => {
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill();
      if (seam) { ctx.strokeStyle = fill; ctx.lineWidth = 1; ctx.stroke(); } // hide hairline gaps between strips
    };

    // Lambert shading for a strip whose slope is θ; light from upper left, gutter darkened.
    const shade = (th: number, s: number, face: number) => {
      const lit = Math.abs(-Math.sin(th) * -0.45 + Math.cos(th) * 0.89);
      const gutter = s < 0.18 ? 0.8 + (s / 0.18) * 0.2 : 1;
      const v = (0.86 + 0.14 * lit) * gutter * face;
      return `rgb(${Math.round(255 * v)},${Math.round(253 * v)},${Math.round(247 * v)})`;
    };

    const surface = (pts: [number, number, number][], face = 1, textAlpha = 1, heading = false, mirror = false) => {
      for (let i = 0; i < SEG; i++) {
        const [x0, y0] = pts[i], [x1, y1, th] = pts[i + 1];
        poly([proj(x0, y0, -D / 2), proj(x1, y1, -D / 2), proj(x1, y1, D / 2), proj(x0, y0, D / 2)], shade(th, i / SEG, face), true);
      }
      // Outline
      ctx.strokeStyle = "rgba(17,19,24,.28)"; ctx.lineWidth = 0.7; ctx.beginPath();
      pts.forEach(([x, y], i) => { const p = proj(x, y, -D / 2); i ? ctx.lineTo(...p) : ctx.moveTo(...p); });
      [...pts].reverse().forEach(([x, y]) => ctx.lineTo(...proj(x, y, D / 2)));
      ctx.stroke();
      if (textAlpha <= 0.02) return;
      // Printed lines
      const at = (s: number) => { const f = s * SEG, i = Math.min(Math.floor(f), SEG - 1), t = f - i; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]; };
      const rows = 15;
      for (let r = 0; r < rows; r++) {
        const z = -D / 2 + 0.16 + (r / (rows - 1)) * (D - 0.32);
        const head = heading && r < 2;
        if (heading && r === 2) continue;
        const end = head ? (r === 0 ? 0.62 : 0.45) : (r % 5 === 4 ? 0.55 : 0.86);
        ctx.strokeStyle = head ? `rgba(42,58,209,${0.75 * textAlpha})` : `rgba(17,19,24,${0.2 * textAlpha})`;
        ctx.lineWidth = head ? 2.2 : 1;
        ctx.beginPath();
        for (let k = 0; k <= 10; k++) { const u = 0.16 + (end - 0.16) * (k / 10); const s = mirror ? 1 - u : u; const [x, y] = at(s); const p = proj(x, y, z); k ? ctx.lineTo(...p) : ctx.moveTo(...p); }
        ctx.stroke();
      }
    };

    // Stack of pages: front edge face with fine page lines, plus the outer side.
    const stack = (pts: [number, number, number][], sign: number) => {
      const front = [...pts.map(([x, y]) => proj(x, y, D / 2)), ...[...pts].reverse().map(([x]) => proj(x, 0, D / 2))];
      poly(front, "#ece8dc");
      ctx.strokeStyle = "rgba(17,19,24,.13)"; ctx.lineWidth = 0.5;
      for (let k = 1; k < 7; k++) {
        const f = k / 7; ctx.beginPath();
        pts.forEach(([x, y], i) => { const p = proj(x, y * f, D / 2); i ? ctx.lineTo(...p) : ctx.moveTo(...p); });
        ctx.stroke();
      }
      const [ex, ey] = pts[SEG];
      poly([proj(ex, ey, -D / 2), proj(ex, ey, D / 2), proj(ex, 0, D / 2), proj(ex, 0, -D / 2)], "#e2ddcf");
      void sign;
    };

    const draw = (now: number) => {
      yaw += (tYaw - yaw) * 0.05; pitch += (tPitch - pitch) * 0.05;
      U = Math.min(w * 0.34, h / 2.05); cx = w / 2; cy = h - U * 0.72;
      ctx.clearRect(0, 0, w, h);

      // Soft table shadow
      const g = ctx.createRadialGradient(cx, cy + U * 0.08, U * 0.2, cx, cy + U * 0.08, U * 1.25);
      g.addColorStop(0, "rgba(17,19,24,.16)"); g.addColorStop(1, "rgba(17,19,24,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, cy + U * 0.06, U * 1.3, U * 0.42, 0, 0, 6.283); ctx.fill();

      // Hardcover in ink blue, with board thickness
      const cw = 1.06, cz = D / 2 + 0.05, cyb = -0.012;
      poly([proj(-cw, cyb - 0.03, cz), proj(cw, cyb - 0.03, cz), proj(cw, cyb, cz), proj(-cw, cyb, cz)], "#121a52");
      poly([proj(-cw, cyb, -cz), proj(cw, cyb, -cz), proj(cw, cyb, cz), proj(-cw, cyb, cz)], "#1e2a86");

      const R = curve(rightRest, 0.004), L = curve(leftRest, 0.004);
      stack(L, -1); stack(R, 1);
      surface(L, 0.97, 1, true, true);
      surface(R, 1, 1);

      // Turning page
      const cycle = 5200, turn = 2600;
      const t = reduce ? 1100 : (now - start) % cycle;
      const p = Math.min(t / turn, 1);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      if (p < 1) {
        const k = Math.sin(p * Math.PI) * 1.15;
        const th = (s: number) => (1 - e) * rightRest(s) + e * leftRest(s) - k * s;
        const P = curve(th, 0.008);
        // Cast shadow on the page underneath
        const lift = Math.sin(e * Math.PI);
        const under = e < 0.5 ? R : L;
        if (lift > 0.02) {
          const sh = P.map(([x], i) => [x * (1 - 0.25 * lift) + (e < 0.5 ? 0.08 : -0.08) * lift, under[Math.min(i, SEG)][1]] as const);
          ctx.globalAlpha = 0.16 * lift;
          poly([...sh.map(([x, y]) => proj(x, y + 0.002, -D / 2)), ...[...sh].reverse().map(([x, y]) => proj(x, y + 0.002, D / 2))], "#111318");
          ctx.globalAlpha = 1;
        }
        surface(P, e < 0.5 ? 1 : 0.95, Math.abs(1 - 2 * e), false, e >= 0.5);
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize(); raf = requestAnimationFrame(draw);
    addEventListener("resize", resize); addEventListener("pointermove", onMove);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("pointermove", onMove); };
  }, []);

  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}

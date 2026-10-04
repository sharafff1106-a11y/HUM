import { useEffect, useRef } from "react";
import { buildTextures, SPREADS, TH, TW } from "./pageArt";

// A hardcover book lying open on a desk, drawn in 3D on canvas.
// Each spread shows a messy draft (left) and the finished page (right). Pages flip on a timer,
// on click, or with Enter; hovering the right page lifts its corner. A ribbon and a pen sit on the desk.
export default function Pages() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tex = buildTextures();
    document.fonts?.ready.then(() => Promise.all(["700 30px Caveat", "40px 'Instrument Serif'", "12px 'JetBrains Mono'"].map((f) => document.fonts.load(f))).then(() => { tex = buildTextures(); }));

    let w = 0, h = 0, dpr = 1, raf = 0;
    let yaw = 0, pitch = 0.98, tYaw = 0, tPitch = 0.98;
    let spread = 0, turnStart = -1, lastTurn = performance.now(), peek = 0, peekT = 0;
    const TURN = 1700, IDLE = 5200;

    const resize = () => {
      dpr = Math.min(devicePixelRatio, 2);
      w = c.offsetWidth; h = c.offsetHeight;
      c.width = w * dpr; c.height = h * dpr;
    };
    const base = () => ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const onMove = (e: PointerEvent) => {
      tYaw = (e.clientX / innerWidth - 0.5) * 0.18;
      tPitch = 0.98 + (e.clientY / innerHeight - 0.5) * 0.08;
      const r = c.getBoundingClientRect();
      const inside = e.clientX > r.left + r.width / 2 && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
      peekT = inside ? 0.09 : 0;
    };
    const turn = () => { if (turnStart < 0) { turnStart = performance.now(); } };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); turn(); } };
    c.addEventListener("click", turn); c.addEventListener("keydown", onKey);

    const D = 1.36, SEG = 22, F = 5;
    let U = 1, cx = 0, cy = 0;
    const proj = (x: number, y: number, z: number): [number, number] => {
      const cY = Math.cos(yaw), sY = Math.sin(yaw);
      const X = x * cY + z * sY, Z = -x * sY + z * cY;
      const ca = Math.cos(pitch), sa = Math.sin(pitch);
      const s = F / (F - (Z * ca + y * sa));
      return [cx + X * s * U, cy - (y * ca - Z * sa) * s * U];
    };

    type Pt = [number, number, number];
    const curve = (theta: (s: number) => number, y0: number): Pt[] => {
      const pts: Pt[] = [[0, y0, theta(0)]];
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

    const path = (pts: [number, number][]) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };
    const poly = (pts: [number, number][], fill: string) => { path(pts); ctx.fillStyle = fill; ctx.fill(); };

    // Darkness for a strip: light from upper left, gutter shade, back faces slightly dimmer.
    const dark = (th: number, s: number, face: number) => {
      const lit = Math.abs(Math.sin(th) * 0.45 + Math.cos(th) * 0.89);
      const gutter = s < 0.2 ? 0.74 + (s / 0.2) * 0.26 : 1;
      return 1 - (0.86 + 0.14 * lit) * gutter * face;
    };

    // Texture-mapped page surface, one affine-mapped strip at a time.
    const surface = (pts: Pt[], img: HTMLCanvasElement, mirror: boolean, face = 1) => {
      for (let i = 0; i < SEG; i++) {
        const s0 = i / SEG, s1 = (i + 1) / SEG;
        const [x0, y0] = pts[i], [x1, y1, th] = pts[i + 1];
        const A = proj(x0, y0, -D / 2), B = proj(x1, y1, -D / 2), C = proj(x1, y1, D / 2), Dd = proj(x0, y0, D / 2);
        const grow = (p: [number, number], q: [number, number], k: number): [number, number] => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1; return [p[0] - (dx / l) * k, p[1] - (dy / l) * k]; };
        const quad: [number, number][] = [grow(A, B, 0.6), grow(B, A, 0.6), grow(C, Dd, 0.6), grow(Dd, C, 0.6)];
        const tx0 = (mirror ? 1 - s0 : s0) * TW, tx1 = (mirror ? 1 - s1 : s1) * TW;
        ctx.save(); path(quad); ctx.fillStyle = "#fbf9f3"; ctx.fill(); ctx.clip();
        const ax = (B[0] - A[0]) / (tx1 - tx0), ay = (B[1] - A[1]) / (tx1 - tx0);
        const bx = (Dd[0] - A[0]) / TH, by = (Dd[1] - A[1]) / TH;
        ctx.setTransform(dpr * ax, dpr * ay, dpr * bx, dpr * by, dpr * (A[0] - ax * tx0), dpr * (A[1] - ay * tx0));
        const lo = Math.max(Math.min(tx0, tx1) - 16, 0), wd = Math.min(Math.abs(tx1 - tx0) + 32, TW - lo);
        ctx.drawImage(img, lo, 0, wd, TH, lo, 0, wd, TH);
        base();
        const k = dark(th, s0, face);
        if (k > 0.004) { ctx.fillStyle = `rgba(30,26,20,${k})`; ctx.fill(); }
        ctx.restore();
      }
      ctx.strokeStyle = "rgba(17,19,24,.25)"; ctx.lineWidth = 0.7; ctx.beginPath();
      pts.forEach(([x, y], i) => { const p = proj(x, y, -D / 2); i ? ctx.lineTo(...p) : ctx.moveTo(...p); });
      [...pts].reverse().forEach(([x, y]) => ctx.lineTo(...proj(x, y, D / 2)));
      ctx.stroke();
    };

    const stack = (pts: Pt[]) => {
      poly([...pts.map(([x, y]) => proj(x, y, D / 2)), ...[...pts].reverse().map(([x]) => proj(x, 0, D / 2))], "#ece7da");
      ctx.strokeStyle = "rgba(17,19,24,.12)"; ctx.lineWidth = 0.5;
      for (let k = 1; k < 7; k++) {
        ctx.beginPath();
        pts.forEach(([x, y], i) => { const p = proj(x, (y * k) / 7, D / 2); i ? ctx.lineTo(...p) : ctx.moveTo(...p); });
        ctx.stroke();
      }
      const [ex, ey] = pts[SEG];
      poly([proj(ex, ey, -D / 2), proj(ex, ey, D / 2), proj(ex, 0, D / 2), proj(ex, 0, -D / 2)], "#e0dbcd");
    };

    const ribbon = (now: number) => {
      const sway = reduce ? 0 : Math.sin(now / 900) * 0.025;
      const a = proj(0.035, 0.012, D / 2 - 0.05), b = proj(0.05, -0.02, D / 2 + 0.07), e = proj(0.1 + sway, -0.04, D / 2 + 0.36);
      const wpx = U * 0.045;
      ctx.lineCap = "butt"; ctx.strokeStyle = "#7d2333"; ctx.lineWidth = wpx;
      ctx.beginPath(); ctx.moveTo(...a); ctx.quadraticCurveTo(b[0], b[1], e[0], e[1]); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = wpx * 0.25;
      ctx.beginPath(); ctx.moveTo(a[0] - wpx * 0.2, a[1]); ctx.quadraticCurveTo(b[0] - wpx * 0.2, b[1], e[0] - wpx * 0.2, e[1]); ctx.stroke();
      // V-cut tail
      ctx.fillStyle = "#f6f5f1"; ctx.beginPath(); ctx.moveTo(e[0] - wpx / 2 - 1, e[1] + 1); ctx.lineTo(e[0], e[1] - wpx * 0.55); ctx.lineTo(e[0] + wpx / 2 + 1, e[1] + 1); ctx.fill();
    };

    const pen = () => {
      const P = proj(0.18, 0.02, D / 2 + 0.28), Q = proj(0.92, 0.02, D / 2 + 0.12);
      const t = U * 0.05, dx = Q[0] - P[0], dy = Q[1] - P[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
      const nibStart: [number, number] = [Q[0] - ux * t * 2.6, Q[1] - uy * t * 2.6];
      ctx.save();
      ctx.shadowColor = "rgba(17,19,24,.28)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = t * 0.8;
      ctx.lineCap = "round"; ctx.strokeStyle = "#15171d"; ctx.lineWidth = t;
      ctx.beginPath(); ctx.moveTo(...P); ctx.lineTo(...nibStart); ctx.stroke();
      ctx.restore();
      // cap band and clip
      const band = (f: number, col: string, wd: number) => { ctx.strokeStyle = col; ctx.lineWidth = t * 1.02; ctx.lineCap = "butt"; ctx.beginPath(); ctx.moveTo(P[0] + dx * f, P[1] + dy * f); ctx.lineTo(P[0] + dx * (f + wd), P[1] + dy * (f + wd)); ctx.stroke(); };
      band(0.42, "#c9ccd4", 0.025); band(0.455, "#2a3ad1", 0.02);
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = t * 0.16; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(P[0] - uy * t * 0.22 + ux * t, P[1] + ux * t * 0.22 * -1 + uy * t); ctx.lineTo(nibStart[0] - uy * t * 0.22 - ux * t, nibStart[1] - ux * t * 0.22 - uy * t); ctx.stroke();
      // nib
      const g = ctx.createLinearGradient(nibStart[0], nibStart[1] - t, nibStart[0], nibStart[1] + t);
      g.addColorStop(0, "#eef0f4"); g.addColorStop(1, "#8d939e");
      ctx.fillStyle = g; ctx.beginPath();
      ctx.moveTo(nibStart[0] - uy * t * 0.5, nibStart[1] + ux * t * 0.5); ctx.lineTo(...Q); ctx.lineTo(nibStart[0] + uy * t * 0.5, nibStart[1] - ux * t * 0.5); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(17,19,24,.5)"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(...nibStart); ctx.lineTo(Q[0] - ux * t * 0.6, Q[1] - uy * t * 0.6); ctx.stroke();
    };

    const draw = (now: number) => {
      yaw += (tYaw - yaw) * 0.05; pitch += (tPitch - pitch) * 0.05; peek += (peekT - peek) * 0.08;
      if (!reduce && turnStart < 0 && now - lastTurn > IDLE) turn();
      U = Math.min(w * (w < 600 ? 0.4 : 0.33), h / 2.25); cx = w / 2; cy = h - U * 0.98;
      base(); ctx.clearRect(0, 0, w, h);

      // Desk shadow
      const g = ctx.createRadialGradient(cx, cy + U * 0.1, U * 0.2, cx, cy + U * 0.1, U * 1.3);
      g.addColorStop(0, "rgba(17,19,24,.17)"); g.addColorStop(1, "rgba(17,19,24,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, cy + U * 0.08, U * 1.35, U * 0.45, 0, 0, 6.283); ctx.fill();

      // Hardcover with board thickness
      const cw = 1.06, cz = D / 2 + 0.05, cyb = -0.012;
      poly([proj(-cw, cyb - 0.03, cz), proj(cw, cyb - 0.03, cz), proj(cw, cyb, cz), proj(-cw, cyb, cz)], "#121a52");
      poly([proj(-cw, cyb, -cz), proj(cw, cyb, -cz), proj(cw, cyb, cz), proj(-cw, cyb, cz)], "#1e2a86");

      let p = turnStart < 0 ? 0 : Math.min((now - turnStart) / (reduce ? 1 : TURN), 1);
      const cur = tex[spread], next = tex[(spread + 1) % SPREADS];
      const moving = turnStart >= 0 || peek > 0.004;

      const R = curve(rightRest, 0.004), Lp = curve(leftRest, 0.004);
      stack(Lp); stack(R);
      surface(Lp, cur.left, true, 0.97);
      surface(R, moving ? next.right : cur.right, false);

      if (moving) {
        // A peek lifts the corner; a turn eases the whole page over with a curl that peaks mid-flight.
        const e = turnStart >= 0 ? (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2) : 0;
        const k = turnStart >= 0 ? Math.sin(p * Math.PI) * 1.25 : 0;
        const th = (s: number) => (1 - e) * rightRest(s) + e * leftRest(s) - k * s + peek * Math.pow(s, 3) * 3.2;
        const P = curve(th, 0.008);
        const lift = Math.max(Math.sin(e * Math.PI), peek * 3);
        const under = e < 0.5 ? R : Lp;
        if (lift > 0.02) {
          const off = e < 0.5 ? 0.09 : -0.09;
          const sh = P.map(([x], i) => [x * (1 - 0.22 * lift) + off * lift, under[Math.min(i, SEG)][1]] as const);
          ctx.globalAlpha = 0.18 * Math.min(lift, 1);
          poly([...sh.map(([x, y]) => proj(x, y + 0.003, -D / 2)), ...[...sh].reverse().map(([x, y]) => proj(x, y + 0.003, D / 2))], "#111318");
          ctx.globalAlpha = 1;
        }
        if (e < 0.5) surface(P, cur.right, false, 1);
        else surface(P, next.left, true, 0.95);
      }

      ribbon(now);
      pen();

      if (turnStart >= 0 && p >= 1) { spread = (spread + 1) % SPREADS; turnStart = -1; lastTurn = now; p = 0; }
      raf = requestAnimationFrame(draw);
    };

    resize(); raf = requestAnimationFrame(draw);
    addEventListener("resize", resize); addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("pointermove", onMove);
      c.removeEventListener("click", turn); c.removeEventListener("keydown", onKey);
    };
  }, []);

  return <canvas ref={ref} tabIndex={0} role="button" aria-label="Turn the page" className="pointer-events-auto h-full w-full cursor-none outline-none" />;
}

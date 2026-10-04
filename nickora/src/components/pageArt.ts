// Page textures for the hero book: each spread pairs a messy draft (left) with the finished page (right).
export const TW = 600, TH = 816;

const SERIF = '"Instrument Serif", Georgia, serif';
const SANS = '"Manrope", system-ui, sans-serif';
const MONO = '"JetBrains Mono", monospace';
const HAND = '"Caveat", "Segoe Print", cursive';
const INK = "#1b1d24", RED = "#c8412f", BLUE = "#2a3ad1", MUTED = "#8a8d96";

type C = CanvasRenderingContext2D;

function paper(c: C, side: "L" | "R", page: number, chapter: string) {
  c.fillStyle = "#fffdf7"; c.fillRect(0, 0, TW, TH);
  // faint grain
  for (let i = 0; i < 1400; i++) { c.fillStyle = `rgba(120,110,90,${Math.random() * 0.05})`; c.fillRect(Math.random() * TW, Math.random() * TH, 1.4, 1.4); }
  c.font = `500 13px ${MONO}`; c.fillStyle = MUTED; c.textBaseline = "alphabetic";
  const head = side === "L" ? "NICKORA" : chapter.toUpperCase();
  c.textAlign = side === "L" ? "left" : "right";
  c.fillText(head.split("").join(" "), side === "L" ? 64 : TW - 64, 58);
  c.textAlign = "center"; c.font = `22px ${SERIF}`; c.fillText(String(page), TW / 2, TH - 40);
  c.textAlign = "left";
}

function wrap(c: C, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(" "); let line = ""; const lines: string[] = [];
  for (const w of words) { const t = line ? line + " " + w : w; if (c.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line);
  lines.forEach((l, i) => c.fillText(l, x, y + i * lh));
  return { end: y + lines.length * lh, lines: lines.map((l) => c.measureText(l).width) };
}

function strike(c: C, x: number, y: number, widths: number[], lh: number) {
  c.strokeStyle = RED; c.lineWidth = 2.2; c.lineCap = "round";
  widths.forEach((w, i) => { const yy = y + i * lh - 8; c.beginPath(); c.moveTo(x - 4, yy + 2); c.bezierCurveTo(x + w * 0.3, yy - 3, x + w * 0.7, yy + 4, x + w + 4, yy - 1); c.stroke(); });
}

function note(c: C, text: string, x: number, y: number, color = BLUE, rot = -0.06, size = 30) {
  c.save(); c.translate(x, y); c.rotate(rot); c.font = `700 ${size}px ${HAND}`; c.fillStyle = color; c.fillText(text, 0, 0); c.restore();
}

function title(c: C, text: string, y: number, size = 40) { c.font = `${size}px ${SERIF}`; c.fillStyle = INK; c.fillText(text, 64, y); }
function body(c: C) { c.font = `23px ${SERIF}`; c.fillStyle = INK; }
function label(c: C, text: string, y: number, color = MUTED) { c.font = `500 12px ${MONO}`; c.fillStyle = color; c.fillText(text.split("").join(" "), 64, y); }

function check(c: C, x: number, y: number) {
  c.strokeStyle = BLUE; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 22, 0, 6.283); c.stroke();
  c.lineWidth = 3.5; c.beginPath(); c.moveTo(x - 10, y + 1); c.lineTo(x - 2, y + 9); c.lineTo(x + 12, y - 9); c.stroke();
}

function arrow(c: C, x1: number, y1: number, x2: number, y2: number, color = BLUE) {
  c.strokeStyle = color; c.fillStyle = color; c.lineWidth = 2; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1); c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - 11 * Math.cos(a - 0.4), y2 - 11 * Math.sin(a - 0.4)); c.lineTo(x2 - 11 * Math.cos(a + 0.4), y2 - 11 * Math.sin(a + 0.4)); c.fill();
}

function box(c: C, x: number, y: number, w: number, h: number, t: string, fill = false) {
  c.strokeStyle = BLUE; c.lineWidth = 1.6; c.fillStyle = fill ? "#e8eafb" : "#fffdf7";
  c.beginPath(); c.roundRect(x, y, w, h, 10); c.fill(); c.stroke();
  c.font = `19px ${SANS}`; c.fillStyle = INK; c.textAlign = "center"; c.fillText(t, x + w / 2, y + h / 2 + 7); c.textAlign = "left";
}

const W = TW - 128;

const spreads: { chapter: string; left: (c: C) => void; right: (c: C) => void }[] = [
  {
    chapter: "Statement of purpose",
    left: (c) => {
      paper(c, "L", 12, ""); label(c, "DRAFT 1", 120, RED); title(c, "Why I am applying", 172);
      body(c);
      let r = wrap(c, "Ever since I was a child I have always been passionate about science and helping people.", 64, 236, W, 34);
      strike(c, 64, 236, r.lines, 34); note(c, "be specific!", 330, r.end + 6, RED);
      r = wrap(c, "I want to study at your prestigious university because it is one of the best in the world.", 64, r.end + 52, W, 34);
      strike(c, 64, r.end - r.lines.length * 34, r.lines, 34); note(c, "why here?", 360, r.end + 6, RED, 0.04);
      const y = r.end + 56;
      r = wrap(c, "During my internship I built a model that cut patient waiting times by 18%.", 64, y, W, 34);
      c.strokeStyle = BLUE; c.lineWidth = 2; c.beginPath(); c.ellipse(64 + 230, y + 4, 260, 46, -0.02, 0, 6.283); c.stroke();
      note(c, "start with this →", 250, r.end + 34, BLUE, -0.05, 34);
    },
    right: (c) => {
      paper(c, "R", 13, "Statement of purpose"); label(c, "FINAL", 120, BLUE); title(c, "Why I am applying", 172);
      body(c);
      let r = wrap(c, "During my internship at a city hospital, I built a scheduling model that cut patient waiting times by 18%.", 64, 236, W, 34);
      r = wrap(c, "That project showed me how careful data work changes people's days, and it is why I am applying to the MSc in Health Data Science.", 64, r.end + 18, W, 34);
      r = wrap(c, "The programme's module in operational research matches the problems I want to solve next.", 64, r.end + 18, W, 34);
      check(c, TW - 100, TH - 130); note(c, "ready to submit", TW - 330, TH - 120, BLUE, -0.04, 30);
    },
  },
  {
    chapter: "Literature review",
    left: (c) => {
      paper(c, "L", 24, ""); label(c, "NOTES", 120, RED); title(c, "What I read", 172);
      body(c);
      let y = 236;
      ["Smith (2019) found that feedback helps students improve.", "Lee (2021) found that peer review is useful.", "Khan (2020) found that students value timely comments."].forEach((t) => {
        const r = wrap(c, t, 64, y, W, 34); strike(c, 64, y, r.lines, 34); y = r.end + 26;
      });
      note(c, "just summaries...", 70, y + 20, RED, -0.03, 32);
      note(c, "group by THEME", 210, y + 92, BLUE, -0.07, 38);
      arrow(c, 380, y + 100, 520, y + 40);
    },
    right: (c) => {
      paper(c, "R", 25, "Literature review"); label(c, "CHAPTER 2", 120, BLUE); title(c, "Themes in the literature", 172);
      const x0 = 64, cols = [x0, x0 + 250, x0 + 360, x0 + 470], rows = ["Feedback timing", "Peer review", "Self-assessment"];
      c.font = `500 13px ${MONO}`; c.fillStyle = MUTED;
      ["THEME", "SMITH", "LEE", "KHAN"].forEach((h, i) => c.fillText(h, cols[i], 236));
      c.strokeStyle = "#d9d6cc"; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, 252); c.lineTo(TW - 64, 252); c.stroke();
      const marks = [[1, 0, 1], [0, 1, 1], [1, 1, 0]];
      rows.forEach((r, i) => {
        const y = 300 + i * 56; c.font = `22px ${SERIF}`; c.fillStyle = INK; c.fillText(r, x0, y);
        marks[i].forEach((m, j) => { c.beginPath(); c.arc(cols[j + 1] + 14, y - 7, 9, 0, 6.283); c.fillStyle = BLUE; c.strokeStyle = BLUE; c.lineWidth = 1.6; m ? c.fill() : c.stroke(); });
        c.strokeStyle = "#ebe8df"; c.beginPath(); c.moveTo(x0, y + 22); c.lineTo(TW - 64, y + 22); c.stroke();
      });
      body(c);
      const y = 500;
      c.fillStyle = "rgba(42,58,209,.14)"; c.fillRect(60, y - 26, 420, 38);
      body(c); wrap(c, "Gap: no studies of online-only cohorts.", 64, y, W, 34);
      wrap(c, "This study addresses that gap.", 64, y + 52, W, 34);
      check(c, TW - 100, TH - 130);
    },
  },
  {
    chapter: "Methodology",
    left: (c) => {
      paper(c, "L", 38, ""); label(c, "THINKING", 120, RED); title(c, "How do I research this?", 172);
      note(c, "Survey? Interviews?", 70, 260, INK, -0.04, 36);
      note(c, "Both??", 380, 300, RED, 0.08, 40);
      note(c, "sample size ???", 90, 380, RED, -0.02, 34);
      // tangled scribble
      c.strokeStyle = INK; c.lineWidth = 1.6; c.beginPath(); let x = 150, y = 520; c.moveTo(x, y);
      for (let i = 0; i < 26; i++) { x = 120 + ((i * 97) % 300); y = 470 + ((i * 53) % 120); c.quadraticCurveTo(x + 40, y - 30, x, y); }
      c.stroke();
      note(c, "ask mentor", 330, 680, BLUE, -0.06, 36);
    },
    right: (c) => {
      paper(c, "R", 39, "Methodology"); label(c, "CHAPTER 3", 120, BLUE); title(c, "Research design", 172);
      box(c, 170, 220, 260, 56, "Research question", true);
      arrow(c, 300, 278, 300, 318);
      box(c, 170, 322, 260, 56, "Mixed methods");
      arrow(c, 250, 380, 170, 430); arrow(c, 350, 380, 430, 430);
      box(c, 64, 434, 210, 56, "Survey, n = 120"); box(c, 326, 434, 210, 56, "Interviews, n = 12");
      arrow(c, 170, 492, 260, 548); arrow(c, 430, 492, 340, 548);
      box(c, 170, 552, 260, 56, "Analysis", true);
      body(c); c.font = `21px ${SERIF}`; c.fillStyle = MUTED; wrap(c, "Each choice is justified in section 3.2.", 64, 680, W, 30);
    },
  },
  {
    chapter: "References",
    left: (c) => {
      paper(c, "L", 52, ""); label(c, "DRAFT", 120, RED); title(c, "references", 172);
      c.font = `22px ${SERIF}`; c.fillStyle = INK;
      const refs = ["smith, j 2019. feedback. journal of learning", "Lee 2021 peer review in class (no DOI)", "Khan, R. Feedback literacy. 2020, pg?"];
      refs.forEach((t, i) => { const y = 240 + i * 74; c.fillText(t, 64, y); c.strokeStyle = RED; c.lineWidth = 2; c.beginPath(); for (let k = 0; k < c.measureText(t).width; k += 12) { c.lineTo(64 + k, y + 8 + (k / 12) % 2 * 4); } c.stroke(); });
      note(c, "which style??", 120, 500, RED, -0.05, 40);
      note(c, "APA 7", 360, 590, BLUE, 0.04, 44);
    },
    right: (c) => {
      paper(c, "R", 53, "References"); label(c, "APA 7", 120, BLUE); title(c, "References", 172);
      const refs = [
        ["Khan, R. (2020). Feedback literacy in higher education. ", "Studies in Higher Education, 45", "(3), 201–214."],
        ["Lee, S. (2021). Peer review in the classroom. ", "Journal of Learning Design, 14", "(2), 33–47."],
        ["Smith, J. (2019). Feedback that works. ", "Assessment & Evaluation, 44", "(5), 610–622."],
      ];
      let y = 236;
      refs.forEach(([a, b, d]) => {
        c.font = `22px ${SERIF}`; c.fillStyle = INK;
        const r = wrap(c, a, 64, y, W, 32);
        c.font = `italic 22px ${SERIF}`; const lastW = r.lines[r.lines.length - 1]; let yy = r.end - 32, xx = 64 + lastW;
        if (xx + c.measureText(b).width > TW - 64) { yy += 32; xx = 94; }
        c.fillText(b, xx, yy); xx += c.measureText(b).width; c.font = `22px ${SERIF}`; c.fillText(d, xx, yy);
        y = yy + 56;
      });
      check(c, TW - 100, TH - 130); note(c, "all consistent", TW - 320, TH - 120, BLUE, -0.04, 30);
    },
  },
];

export const SPREADS = spreads.length;

export function buildTextures() {
  return spreads.map((s) => {
    const make = (fn: (c: C) => void) => { const cv = document.createElement("canvas"); cv.width = TW; cv.height = TH; fn(cv.getContext("2d")!); return cv; };
    return { left: make(s.left), right: make(s.right) };
  });
}

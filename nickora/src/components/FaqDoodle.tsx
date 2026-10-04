import { AnimatePresence, motion } from "motion/react";

// Notion-style line illustration: a student stuck at their desk. Opening an answer gives them the "aha".
const INK = "#111318", W = "#ffffff", BLUE = "#2a3ad1", SOFT = "#e8eafb";
const K = { stroke: INK, strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const box = { transformBox: "fill-box" as const, transformOrigin: "center" };
const pop = { initial: { opacity: 0, scale: 0.7 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.7 }, transition: { duration: 0.35 }, style: box };

// Arm drawn as an outlined tube: thick ink stroke with a white stroke on top.
function Arm({ d }: { d: string }) {
  return (<g fill="none" strokeLinecap="round" strokeLinejoin="round"><path d={d} stroke={INK} strokeWidth={17} /><path d={d} stroke={W} strokeWidth={12} /></g>);
}

function Question({ x, y, s = 1, color = INK, delay = 0 }: { x: number; y: number; s?: number; color?: string; delay?: number }) {
  return (
    <motion.g animate={{ y: [0, -6, 0], rotate: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }} style={box}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-8 -10 C-8 -22 10 -24 11 -12 C12 -4 2 -2 1 6" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" />
        <circle cx={1} cy={14} r={2.6} fill={color} />
      </g>
    </motion.g>
  );
}

export default function FaqDoodle({ solved }: { solved: boolean }) {
  return (
    <figure className="mt-12 max-w-[460px]">
      <svg viewBox="0 0 480 420" className="h-auto w-full" role="img"
        aria-label={solved ? "A student with a lightbulb idea, smiling" : "A student at a desk, thinking hard, surrounded by question marks"}>
        {/* soft backdrop */}
        <path d="M70 250 C40 160 110 70 220 62 C330 54 430 110 436 210 C442 300 380 372 270 378 C160 384 96 330 70 250 Z" fill={SOFT} />

        {/* floor + crumpled paper */}
        <path {...K} fill="none" strokeWidth={2} d="M24 402 H456" />
        {[[120, 394, 1], [150, 397, 0.7], [400, 395, 0.85]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <path {...K} fill={W} d="M-13 2 L-10 -9 L-1 -13 L10 -9 L13 0 L8 8 L-5 9 Z" />
            <path {...K} strokeWidth={1.3} fill="none" d="M-7 -4 L0 -1 L5 -7 M-3 4 L1 -1" />
          </g>
        ))}

        {/* lamp */}
        <motion.path d="M150 222 L108 300 H214 Z" fill={BLUE} animate={{ opacity: solved ? 0.14 : 0.07 }} />
        <path {...K} fill="none" d="M92 300 L104 246 L146 214" />
        <ellipse {...K} cx={92} cy={302} rx={18} ry={4} fill={W} />
        <path {...K} fill={INK} d="M134 200 C150 190 170 196 176 214 L150 226 C146 214 140 206 134 200 Z" />
        <circle cx={104} cy={246} r={4} fill={INK} />

        {/* left arm resting (behind laptop) */}
        <Arm d="M196 256 C176 272 178 294 206 298" />

        {/* body: hoodie */}
        <path {...K} fill={W} d="M172 302 C172 258 196 230 240 228 C284 230 308 258 308 302 Z" />
        <path {...K} fill="none" d="M214 236 C222 252 258 252 266 236" />
        <path {...K} fill="none" strokeWidth={1.8} d="M232 250 L229 270 M248 250 L251 270" />
        <circle cx={229} cy={272} r={2} fill={INK} /><circle cx={251} cy={272} r={2} fill={INK} />

        {/* head */}
        <path {...K} fill={W} d="M228 212 L230 228 H250 L252 212 Z" />
        <ellipse {...K} cx={240} cy={176} rx={33} ry={37} fill={W} />
        <path {...K} fill={W} d="M207 178 C199 176 199 192 208 192" />
        <path fill={INK} d="M206 172 C198 142 214 124 230 128 C236 114 258 114 264 128 C280 124 290 142 280 158 C288 166 282 180 274 176 C270 160 254 152 238 156 C224 150 210 158 206 172 Z" />
        {/* glasses + eyes */}
        <circle {...K} strokeWidth={2} cx={228} cy={180} r={9.5} fill={W} />
        <circle {...K} strokeWidth={2} cx={256} cy={180} r={9.5} fill={W} />
        <path {...K} strokeWidth={2} fill="none" d="M237.5 179 H246.5" />
        <circle cx={229} cy={181} r={2.4} fill={INK} /><circle cx={257} cy={181} r={2.4} fill={INK} />
        <path {...K} strokeWidth={1.8} fill="none" d="M243 186 C247 193 246 197 241 197" />
        <motion.path {...K} fill="none" animate={{ d: solved ? "M220 165 Q228 160 236 165" : "M220 167 L236 164" }} />
        <motion.path {...K} fill="none" animate={{ d: solved ? "M248 165 Q256 160 264 165" : "M248 162 L264 156" }} />
        <motion.path {...K} fill="none" animate={{ d: solved ? "M230 202 Q241 213 252 202" : "M232 205 Q237 201 242 205 Q247 209 252 205" }} />
        <AnimatePresence>{solved && <motion.g {...pop}><ellipse cx={220} cy={195} rx={5} ry={3} fill={BLUE} opacity={0.2} /><ellipse cx={262} cy={195} rx={5} ry={3} fill={BLUE} opacity={0.2} /></motion.g>}</AnimatePresence>

        {/* laptop */}
        <path {...K} fill={W} d="M196 302 L206 246 H282 L292 302 Z" />
        <circle cx={244} cy={273} r={5.5} fill={BLUE} />
        <path {...K} fill="none" strokeWidth={1.6} d="M262 258 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1 z" />

        {/* right arm: hand on chin, or raised with a pencil */}
        <AnimatePresence mode="wait">
          {solved ? (
            <motion.g key="up" {...pop}>
              <Arm d="M296 258 C318 240 326 196 322 150" />
              <circle {...K} cx={322} cy={146} r={9} fill={W} />
              <g transform="rotate(18 322 146)">
                <rect {...K} x={318} y={104} width={9} height={40} rx={1.5} fill={BLUE} />
                <path {...K} fill={W} d="M318 104 L322.5 92 L327 104 Z" />
              </g>
            </motion.g>
          ) : (
            <motion.g key="chin" {...pop}>
              <Arm d="M298 258 C314 272 318 290 308 298 L262 220" />
              <circle {...K} cx={260} cy={216} r={9} fill={W} />
            </motion.g>
          )}
        </AnimatePresence>

        {/* desk */}
        <rect {...K} x={40} y={300} width={400} height={13} rx={6} fill={W} />
        <path {...K} fill="none" d="M66 313 V402 M414 313 V402" />
        <rect {...K} x={340} y={313} width={60} height={38} rx={3} fill={W} />
        <path {...K} fill="none" d="M362 332 H378" />

        {/* books */}
        <rect {...K} x={118} y={282} width={64} height={18} rx={3} fill={BLUE} />
        <rect {...K} x={124} y={265} width={54} height={17} rx={3} fill={W} />
        <path {...K} fill="none" strokeWidth={1.4} d="M134 269 v9 M139 269 v9" />

        {/* mug + steam */}
        <path {...K} fill={W} d="M338 270 H366 V292 a7 7 0 0 1 -7 7 H345 a7 7 0 0 1 -7 -7 Z" />
        <path {...K} fill="none" d="M366 276 c11 0 11 14 0 14" />
        {[0, 1].map((i) => (
          <motion.path key={i} {...K} fill="none" strokeWidth={1.8} d={`M${347 + i * 9} 262 c-5 -6 5 -10 0 -16`}
            animate={{ opacity: [0, 1, 0], y: [4, -4, -10] }} transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.9 }} />
        ))}

        {/* plant */}
        <path {...K} fill={W} d="M396 300 L392 270 H424 L420 300 Z" />
        <path {...K} fill={W} d="M408 270 C396 252 384 248 380 232 C394 234 406 246 408 270 Z" />
        <path {...K} fill={BLUE} d="M408 270 C412 248 424 236 440 234 C438 252 424 262 408 270 Z" />
        <path {...K} fill={W} d="M408 270 C404 246 408 226 418 214 C424 232 418 252 408 270 Z" />

        {/* thought bubble */}
        <circle {...K} cx={288} cy={142} r={5} fill={W} />
        <circle {...K} cx={300} cy={126} r={8} fill={W} />
        <path {...K} fill={W} d="M312 92 C302 64 336 46 354 60 C370 40 408 50 406 76 C428 82 426 114 402 116 C394 136 358 136 348 122 C326 132 302 116 312 92 Z" />
        <AnimatePresence mode="wait">
          {solved ? (
            <motion.g key="bulb" {...pop}>
              <path {...K} fill={BLUE} d="M358 98 C344 88 348 64 366 62 C384 64 388 88 374 98 L373 104 H359 Z" />
              <path {...K} fill={W} d="M359 104 H373 V112 H359 Z" />
              <path stroke={W} strokeWidth={2} strokeLinecap="round" fill="none" d="M360 82 q6 -8 12 0" />
              <path {...K} fill="none" strokeWidth={2} d="M366 50 V43 M343 58 l-5 -5 M389 58 l5 -5 M338 80 h-7 M394 80 h7" />
            </motion.g>
          ) : (
            <motion.path key="tangle" {...pop} {...K} fill="none" strokeWidth={2}
              d="M334 92 c8 -20 36 -16 28 2 c-7 13 -27 6 -13 -7 c14 -13 40 -2 32 12 c-6 10 -22 9 -17 -4 c5 -12 27 -8 26 6" />
          )}
        </AnimatePresence>

        {/* question marks or sparkles */}
        <AnimatePresence>
          {!solved ? (
            <motion.g key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
              <Question x={186} y={112} s={1.25} />
              <Question x={156} y={160} s={0.8} color={BLUE} delay={0.6} />
              <Question x={214} y={80} s={0.7} delay={1.2} />
            </motion.g>
          ) : (
            <motion.g key="spark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[[186, 112, 12], [156, 160, 8], [214, 78, 7]].map(([x, y, r], i) => (
                <motion.path key={i} d={`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`}
                  fill={i === 1 ? BLUE : INK} animate={{ scale: [1, 0.6, 1] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }} style={box} />
              ))}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
      <figcaption className="label mt-4 text-muted">{solved ? "Much clearer, right?" : "Open a question to clear things up →"}</figcaption>
    </figure>
  );
}

import { AnimatePresence, motion } from "motion/react";

// Notion-style line drawing: a confused student at a desk. When an answer is opened, they get it.
const K = { stroke: "#111318", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const W = "#ffffff", BLUE = "#2a3ad1", SOFT = "#e8eafb";

const bob = (d: number) => ({ animate: { y: [0, -7, 0] }, transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" as const, delay: d } });
const fade = { initial: { opacity: 0, scale: 0.6 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.6 }, transition: { duration: 0.35 }, style: { transformBox: "fill-box" as const, transformOrigin: "center" } };

export default function FaqDoodle({ solved }: { solved: boolean }) {
  return (
    <figure className="mt-12 max-w-[440px]">
      <svg viewBox="0 0 440 400" className="h-auto w-full" role="img" aria-label={solved ? "A student smiling with a lightbulb idea" : "A confused student at a desk surrounded by question marks"}>
        {/* floor */}
        <path {...K} d="M10 392 H430" fill="none" />

        {/* crumpled paper */}
        {[[96, 380, 11], [128, 385, 7], [372, 383, 9]].map(([x, y, r], i) => (
          <g key={i}><circle {...K} cx={x} cy={y} r={r} fill={W} /><path {...K} strokeWidth={1.4} fill="none" d={`M${x - r * 0.6} ${y - 2} l${r * 0.4} ${r * 0.5} l${r * 0.3} ${-r * 0.7} l${r * 0.4} ${r * 0.6}`} /></g>
        ))}

        {/* body */}
        <path {...K} fill={W} d="M118 312 C122 252 150 226 190 223 C230 226 258 252 262 312 Z" />
        <path {...K} fill="none" d="M170 228 Q190 244 210 228" />
        <path {...K} fill="none" strokeWidth={1.6} d="M150 262 v40 M230 262 v40" />

        {/* head */}
        <circle {...K} cx={190} cy={170} r={40} fill={W} />
        <path {...K} fill="#111318" d="M151 166 C143 126 172 108 197 114 C222 108 242 130 231 162 C224 146 206 140 192 147 C176 138 160 148 151 166 Z" />
        <path {...K} fill="none" strokeWidth={2} d="M163 124 l-9 -12 M181 113 l-3 -15 M203 113 l6 -14 M222 122 l12 -9" />
        <circle cx={176} cy={174} r={3.2} fill="#111318" />
        <circle cx={205} cy={174} r={3.2} fill="#111318" />
        <motion.path {...K} fill="none" animate={{ d: solved ? "M168 160 Q176 154 184 160" : "M168 159 L184 164" }} />
        <motion.path {...K} fill="none" animate={{ d: solved ? "M198 160 Q206 154 214 160" : "M198 158 L214 151" }} />
        <motion.path {...K} fill="none" animate={{ d: solved ? "M178 190 Q190 203 202 190" : "M178 194 Q184 188 190 194 Q196 200 202 194" }} />
        <AnimatePresence>
          {solved && <motion.g {...fade}><circle cx={167} cy={186} r={5} fill={BLUE} opacity={0.18} /><circle cx={214} cy={186} r={5} fill={BLUE} opacity={0.18} /></motion.g>}
        </AnimatePresence>

        {/* arm: scratching head, or raised in a eureka moment */}
        <AnimatePresence mode="wait">
          {solved ? (
            <motion.g key="up" {...fade}>
              <path {...K} fill={W} d="M236 266 C262 222 280 160 292 110 L306 116 C296 168 276 230 252 272 Z" />
              <circle {...K} cx={299} cy={108} r={10} fill={W} />
              <path {...K} fill="none" d="M301 98 V84" />
            </motion.g>
          ) : (
            <motion.g key="scratch" {...fade}>
              <path {...K} fill={W} d="M238 264 C262 230 254 182 230 154 L242 146 C270 178 278 232 252 270 Z" />
              <circle {...K} cx={234} cy={148} r={11} fill={W} />
              <motion.path {...K} fill="none" strokeWidth={1.8} d="M246 132 l6 -6 M252 142 l9 -2" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
            </motion.g>
          )}
        </AnimatePresence>

        {/* desk */}
        <rect {...K} x={20} y={310} width={400} height={16} rx={3} fill={W} />
        <path {...K} fill="none" d="M52 326 V392 M388 326 V392" />

        {/* laptop (seen from behind) */}
        <path {...K} fill={W} d="M134 310 L146 250 H250 L262 310 Z" />
        <circle cx={198} cy={281} r={6} fill={BLUE} />
        <path {...K} fill="none" strokeWidth={3.2} d="M118 310 H278" />

        {/* books */}
        <rect {...K} x={34} y={286} width={92} height={24} rx={3} fill={BLUE} />
        <path stroke="#fff" strokeWidth={2} strokeLinecap="round" d="M48 292 v12" />
        <rect {...K} x={42} y={263} width={80} height={23} rx={3} fill={W} />
        <path {...K} fill="none" strokeWidth={1.6} d="M56 269 v11 M62 269 v11" />
        <rect {...K} x={38} y={238} width={88} height={22} rx={3} fill={SOFT} transform="rotate(-6 82 249)" />

        {/* mug and steam */}
        <path {...K} fill={W} d="M316 276 H350 V304 a7 7 0 0 1 -7 7 H323 a7 7 0 0 1 -7 -7 Z" />
        <path {...K} fill="none" d="M350 284 c13 0 13 17 0 17" />
        {[0, 1, 2].map((i) => (
          <motion.path key={i} {...K} fill="none" strokeWidth={1.8} d={`M${324 + i * 9} 268 c-5 -6 5 -10 0 -16`}
            animate={{ opacity: [0, 1, 0], y: [4, -6, -12] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6 }} />
        ))}

        {/* thought bubble */}
        <circle {...K} cx={266} cy={136} r={6} fill={W} />
        <circle {...K} cx={252} cy={152} r={3.5} fill={W} />
        <path {...K} fill={W} d="M286 98 C276 70 312 52 330 66 C346 46 384 56 382 82 C404 88 402 120 378 122 C370 142 334 142 324 128 C302 138 278 122 286 98 Z" />
        <AnimatePresence mode="wait">
          {solved ? (
            <motion.g key="bulb" {...fade}>
              <circle {...K} cx={334} cy={88} r={17} fill={BLUE} />
              <path {...K} fill={W} d="M326 104 h16 v9 h-16 Z" />
              <path stroke="#fff" strokeWidth={2.2} strokeLinecap="round" fill="none" d="M328 86 q6 -8 12 0" />
              <path {...K} fill="none" strokeWidth={2} d="M334 60 v-8 M308 70 l-6 -6 M360 70 l6 -6 M302 92 h-8 M366 92 h8" />
            </motion.g>
          ) : (
            <motion.path key="tangle" {...fade} {...K} fill="none" strokeWidth={2}
              d="M304 96 c10 -22 40 -16 30 2 c-8 14 -30 6 -14 -8 c16 -14 44 -2 34 14 c-6 10 -24 10 -18 -4 c6 -14 30 -8 28 8" />
          )}
        </AnimatePresence>

        {/* floating question marks */}
        <AnimatePresence>
          {!solved && (
            <motion.g key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <motion.text {...bob(0)} x={96} y={128} fontSize={52} fontStyle="italic" fontFamily='"Instrument Serif", Georgia, serif' fill="#111318">?</motion.text>
              <motion.text {...bob(0.8)} x={128} y={74} fontSize={34} fontStyle="italic" fontFamily='"Instrument Serif", Georgia, serif' fill={BLUE}>?</motion.text>
              <motion.text {...bob(1.5)} x={66} y={200} fontSize={28} fontStyle="italic" fontFamily='"Instrument Serif", Georgia, serif' fill="#111318">?</motion.text>
            </motion.g>
          )}
        </AnimatePresence>
        {/* sparkles once solved */}
        <AnimatePresence>
          {solved && (
            <motion.g key="spark" {...fade}>
              {[[104, 112], [150, 66], [66, 186]].map(([x, y], i) => (
                <motion.path key={i} {...K} fill="none" strokeWidth={2} d={`M${x} ${y - 10} V${y + 10} M${x - 10} ${y} H${x + 10}`}
                  animate={{ scale: [1, 0.6, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              ))}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
      <figcaption className="label mt-4 text-muted">{solved ? "Much clearer, right?" : "Open a question to clear things up →"}</figcaption>
    </figure>
  );
}

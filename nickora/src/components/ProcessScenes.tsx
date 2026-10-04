import { motion, type TargetAndTransition, type Transition } from "motion/react";

// Small animated explainers for the four process steps. When `run` is true the scene plays
// from the start; otherwise it shows its finished, resting state.
const INK = "#111318", BLUE = "#2a3ad1", SOFT = "#e8eafb", LINE = "#d9d6cc", RED = "#c8412f";
const box = { transformBox: "fill-box" as const, transformOrigin: "center" };

// Motion props: animate from `from` to `to` after `delay` seconds, only when running.
type Anim = { initial: TargetAndTransition | false; animate: TargetAndTransition; transition?: Transition };
function at(run: boolean, from: TargetAndTransition, to: TargetAndTransition, delay = 0, duration = 0.45): Anim {
  return run ? { initial: from, animate: to, transition: { delay, duration, ease: [0.22, 1, 0.36, 1] } } : { initial: false, animate: to };
}

export function TalkScene({ run }: { run: boolean }) {
  return (
    <svg viewBox="0 0 220 120" className="h-full w-full">
      <motion.g {...at(run, { opacity: 0, y: 8 }, { opacity: 1, y: 0 }, 0.1)}>
        <circle cx={22} cy={36} r={11} fill={SOFT} stroke={INK} strokeWidth={1.4} />
        <path d="M17 39 q5 4 10 0" fill="none" stroke={INK} strokeWidth={1.3} strokeLinecap="round" />
        <rect x={40} y={20} width={104} height={32} rx={12} fill="#fff" stroke={LINE} strokeWidth={1.4} />
        <rect x={52} y={29} width={70} height={4.5} rx={2} fill="#c9c6bd" />
        <rect x={52} y={38} width={46} height={4.5} rx={2} fill="#c9c6bd" />
      </motion.g>
      {run && (
        <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9] }} transition={{ delay: 0.7, duration: 1.3, times: [0, 0.15, 0.85, 1] }} style={box}>
          <rect x={136} y={70} width={48} height={24} rx={12} fill={SOFT} />
          {[0, 1, 2].map((i) => (
            <motion.circle key={i} cx={150 + i * 10} cy={82} r={3} fill={BLUE} animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
          ))}
        </motion.g>
      )}
      <motion.g {...at(run, { opacity: 0, y: 8 }, { opacity: 1, y: 0 }, 2.0)}>
        <rect x={78} y={66} width={108} height={36} rx={12} fill={BLUE} />
        <rect x={90} y={76} width={76} height={4.5} rx={2} fill="#fff" opacity={0.9} />
        <rect x={90} y={86} width={52} height={4.5} rx={2} fill="#fff" opacity={0.6} />
      </motion.g>
      <motion.g {...at(run, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1 }, 0.6)} style={box}>
        <circle cx={200} cy={92} r={11} fill={BLUE} stroke={INK} strokeWidth={1.4} />
        <path d="M195 94 q5 4 10 0" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

export function PlanScene({ run }: { run: boolean }) {
  return (
    <svg viewBox="0 0 220 120" className="h-full w-full">
      <motion.g {...at(run, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, 0)}>
        <rect x={52} y={8} width={116} height={104} rx={6} fill="#fff" stroke={LINE} strokeWidth={1.4} />
        <rect x={64} y={20} width={54} height={6} rx={3} fill={BLUE} />
      </motion.g>
      {[40, 60, 80].map((y, i) => (
        <g key={y}>
          <motion.rect x={64} y={y - 7} width={11} height={11} rx={2.5} fill="#fff" stroke={INK} strokeWidth={1.3} {...at(run, { opacity: 0 }, { opacity: 1 }, 0.2 + i * 0.15)} />
          <motion.rect x={82} y={y - 4} width={i === 1 ? 52 : 70} height={4.5} rx={2} fill="#c9c6bd" {...at(run, { opacity: 0, x: -6 }, { opacity: 1, x: 0 }, 0.2 + i * 0.15)} />
          <motion.path d={`M66 ${y - 2} l3 3.5 l6 -7`} fill="none" stroke={BLUE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            {...at(run, { pathLength: 0 }, { pathLength: 1 }, 0.8 + i * 0.4, 0.3)} />
        </g>
      ))}
      <motion.g {...at(run, { opacity: 0, scale: 2.2, rotate: -30 }, { opacity: 1, scale: 1, rotate: -12 }, 2.2, 0.35)} style={box}>
        <rect x={116} y={84} width={62} height={22} rx={4} fill="rgba(42,58,209,.06)" stroke={BLUE} strokeWidth={1.8} />
        <text x={147} y={99} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize={10} fontWeight={600} letterSpacing={1.5} fill={BLUE}>AGREED</text>
      </motion.g>
    </svg>
  );
}

export function WorkScene({ run }: { run: boolean }) {
  const rows = [28, 44, 60, 76];
  return (
    <svg viewBox="0 0 220 120" className="h-full w-full">
      <rect x={30} y={10} width={160} height={92} rx={6} fill="#fff" stroke={LINE} strokeWidth={1.4} />
      {rows.map((y, i) => {
        const w = i === 3 ? 80 : 124;
        const d = 0.4 + i * 0.5;
        return (
          <g key={y}>
            <rect x={44} y={y - 2.5} width={w} height={4.5} rx={2} fill="#d4d1c8" />
            <motion.path d={`M42 ${y} q${w / 4} -3 ${w / 2} 0 t${w / 2 + 4} 0`} fill="none" stroke={RED} strokeWidth={1.8} strokeLinecap="round"
              {...at(run, { opacity: 1 }, { opacity: 0 }, d + 0.25, 0.3)} />
            <motion.rect x={44} y={y - 2.5} width={w} height={4.5} rx={2} fill={BLUE} style={{ transformBox: "fill-box", transformOrigin: "left" }}
              {...at(run, { scaleX: 0 }, { scaleX: 1 }, d, 0.45)} />
          </g>
        );
      })}
      {run && (
        <motion.g initial={{ x: 44, y: 28, opacity: 1 }}
          animate={{ x: [44, 168, 44, 168, 44, 168, 44, 124, 150], y: [28, 28, 44, 44, 60, 60, 76, 76, 110], opacity: [1, 1, 1, 1, 1, 1, 1, 1, 0] }}
          transition={{ duration: 2.4, delay: 0.4, times: [0, 0.12, 0.25, 0.37, 0.5, 0.62, 0.75, 0.85, 1], ease: "easeInOut" }}>
          <g transform="rotate(-40)">
            <path d="M0 0 L9 -3 L9 3 Z" fill="#9aa0aa" />
            <rect x={9} y={-3.5} width={34} height={7} rx={3} fill={INK} />
            <rect x={24} y={-3.6} width={2.5} height={7.2} fill={BLUE} />
          </g>
        </motion.g>
      )}
      <rect x={30} y={108} width={160} height={4} rx={2} fill={SOFT} />
      <motion.rect x={30} y={108} width={160} height={4} rx={2} fill={BLUE} style={{ transformBox: "fill-box", transformOrigin: "left" }}
        {...at(run, { scaleX: 0 }, { scaleX: 1 }, 0.4, 2.4)} />
    </svg>
  );
}

export function FinishScene({ run }: { run: boolean }) {
  const confetti = [[-34, -26, BLUE], [30, -32, INK], [-22, -44, "#c9c6bd"], [40, -12, BLUE], [-44, -6, INK], [14, -48, BLUE], [-6, -40, INK]] as const;
  return (
    <svg viewBox="0 0 220 120" className="h-full w-full">
      <motion.circle cx={110} cy={70} r={30} fill={SOFT} {...at(run, { scale: 0 }, { scale: 1 }, 0.1, 0.4)} style={box} />
      <motion.path d="M96 70 l10 10 l19 -21" fill="none" stroke={BLUE} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
        {...at(run, { pathLength: 0 }, { pathLength: 1 }, 0.5, 0.5)} />
      {run && confetti.map(([dx, dy, c], i) => (
        <motion.rect key={i} x={108} y={30} width={4} height={7} rx={1} fill={c}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }} animate={{ x: dx * 1.4, y: [0, dy, dy + 40], opacity: [0, 1, 0], rotate: 220 }}
          transition={{ delay: 1.15, duration: 1.4, ease: "easeOut" }} style={box} />
      ))}
      <motion.g {...(run ? { initial: { y: 0, rotate: 0 }, animate: { y: [0, -14, 0], rotate: [0, -200, -360] }, transition: { delay: 1.0, duration: 1.2, ease: "easeInOut" } } : { initial: false as const })} style={box}>
        <path d="M110 18 L80 30 L110 42 L140 30 Z" fill={INK} />
        <path d="M92 35 v9 c0 4 8 7 18 7 s18 -3 18 -7 v-9 l-18 7 Z" fill={INK} />
        <path d="M140 30 v12" stroke={BLUE} strokeWidth={2} strokeLinecap="round" />
        <circle cx={140} cy={44} r={2.5} fill={BLUE} />
      </motion.g>
      <motion.g {...at(run, { opacity: 0, y: 8 }, { opacity: 1, y: 0 }, 1.9)}>
        <rect x={150} y={84} width={60} height={20} rx={10} fill={INK} />
        <text x={180} y={97.5} textAnchor="middle" fontFamily="Manrope, system-ui, sans-serif" fontSize={9.5} fontWeight={600} fill="#fff">Submitted</text>
      </motion.g>
    </svg>
  );
}

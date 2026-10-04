import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

// Dot follows the pointer; ring trails and grows over links and buttons.
export default function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 300, damping: 30 }), ry = useSpring(y, { stiffness: 300, damping: 30 });
  const [hover, setHover] = useState(false);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(pointer: fine)");
    setFine(mq.matches);
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      setHover(!!(e.target as HTMLElement).closest("a,button,[role=tab]"));
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, [x, y]);

  if (!fine) return null;
  return (
    <>
      <motion.div aria-hidden style={{ x: rx, y: ry }} animate={{ scale: hover ? 1.9 : 1 }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-4 -mt-4 h-8 w-8 rounded-full border border-ink/40" />
      <motion.div aria-hidden style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-[100] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-blue" />
    </>
  );
}

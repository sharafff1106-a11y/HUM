import { ShieldCheck, Lock, Heart } from "lucide-react";
import { Eyebrow, Reveal } from "./ui";

const items = [
  { Icon: ShieldCheck, t: "Integrity first", s: "We guide, mentor and edit. Your work stays yours — ethical, original and university-compliant." },
  { Icon: Lock, t: "Confidential", s: "Your drafts, ideas and personal details are handled privately and never shared." },
  { Icon: Heart, t: "Genuinely personal", s: "No scripts or one-size-fits-all packages. Every plan is built around your goals." },
];

export default function Promise() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-32">
      <Reveal className="max-w-2xl">
        <Eyebrow>Our promise</Eyebrow>
        <h2 className="mt-6 font-display text-5xl font-light leading-[1.05] tracking-tight md:text-6xl">Built on trust, <span className="text-gradient italic">not shortcuts.</span></h2>
      </Reveal>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {items.map(({ Icon, t, s }, i) => (
          <Reveal key={t} delay={i * 0.1} className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-8">
            <Icon className="text-gold" size={30} strokeWidth={1.5} />
            <h3 className="mt-8 font-display text-3xl">{t}</h3>
            <p className="mt-3 leading-relaxed text-paper/60">{s}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

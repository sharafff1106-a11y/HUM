import { steps } from "../content";
import { Eyebrow, Reveal } from "./ui";

export default function Process() {
  return (
    <section id="process" className="bg-snow py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">No surprises. Just a clear plan.</h2>
        </Reveal>
        <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <li className="h-full rounded-3xl border border-line bg-white p-7">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-tint font-semibold text-emerald">{i + 1}</span>
                <h3 className="mt-8 font-display text-3xl leading-tight">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-slate">{p.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

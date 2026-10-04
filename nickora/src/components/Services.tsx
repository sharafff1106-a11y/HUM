import { ArrowUpRight } from "lucide-react";
import { services } from "../content";
import { Eyebrow, Reveal } from "./ui";

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <Reveal className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
        <div>
          <Eyebrow>Services</Eyebrow>
          <h2 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">One partner for every stage.</h2>
        </div>
        <p className="max-w-md text-lg text-slate lg:justify-self-end">From choosing a university to defending a doctorate, with the same people who already know your goals.</p>
      </Reveal>

      <ul className="mt-14 border-t border-line">
        {services.map((s) => (
          <Reveal key={s.id}>
            <li className="group grid gap-4 border-b border-line py-8 transition-colors hover:bg-snow md:grid-cols-[1.1fr_1.3fr_auto] md:items-center md:gap-10 md:px-4">
              <div>
                <h3 className="font-display text-3xl leading-tight md:text-4xl">{s.title}</h3>
                <p className="mt-2 text-sm font-medium text-emerald">Best for: {s.for}</p>
              </div>
              <p className="leading-relaxed text-slate">{s.text}</p>
              <a href="#contact" aria-label={`Enquire about ${s.title}`}
                className="grid h-12 w-12 place-items-center rounded-full border border-line text-ink transition group-hover:border-emerald group-hover:bg-emerald group-hover:text-white">
                <ArrowUpRight size={20} />
              </a>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

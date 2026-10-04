import { ArrowUpRight } from "lucide-react";
import { articles, readTime } from "../articles";
import { Chapter, PillButton, Reveal } from "./ui";

export default function JournalTeaser() {
  return (
    <section id="journal-teaser" className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
      <Reveal className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <Chapter n="05">Journal</Chapter>
          <h2 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.02em]">Notes for the <em className="text-blue">stuck.</em></h2>
        </div>
        <PillButton href="#journal" dark={false}>All articles</PillButton>
      </Reveal>
      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {articles.slice(0, 3).map((a, i) => (
          <Reveal key={a.slug} delay={i * 0.08}>
            <a href={`#j-${a.slug}`} className="group flex h-full flex-col rounded-2xl border border-line bg-card p-7 transition hover:-translate-y-1 hover:border-ink/30">
              <div className="flex justify-between"><span className="label text-blue">{a.category}</span><span className="label text-muted">{readTime(a)}</span></div>
              <h3 className="mt-10 font-display text-[2rem] leading-[1.05]">{a.title}</h3>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted">{a.excerpt}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium">Read article <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue" /></span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

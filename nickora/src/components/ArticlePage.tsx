import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { articles } from "../articles";
import { PillButton } from "./ui";
import { scrollToAnchor } from "../router";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ArticlePage({ slug }: { slug: string }) {
  const idx = articles.findIndex((a) => a.slug === slug);
  const a = articles[idx];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const f = () => { const max = document.documentElement.scrollHeight - innerHeight; setProgress(max > 0 ? scrollY / max : 0); };
    f(); addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);

  if (!a) {
    return (
      <main className="mx-auto max-w-3xl px-5 pb-40 pt-48">
        <h1 className="font-display text-6xl">Article not found.</h1>
        <a href="#journal" className="mt-8 inline-block border-b border-ink pb-1">Back to the Journal</a>
      </main>
    );
  }

  const headings = a.body.filter((b) => b.t === "h").map((b) => (b as { text: string }).text);
  const more = [articles[(idx + 1) % articles.length], articles[(idx + 2) % articles.length]];

  return (
    <>
      <div className="fixed inset-x-0 top-[78px] z-40 h-[2px] bg-transparent"><div className="h-full bg-blue" style={{ width: `${progress * 100}%` }} /></div>
      <main className="mx-auto max-w-[1400px] px-5 pb-24 pt-36 md:px-10 md:pt-44">
        <a href="#journal" className="label inline-flex items-center gap-2 text-muted transition hover:text-blue"><ArrowLeft size={14} /> Journal</a>
        <header className="mt-10 max-w-5xl">
          <p className="label text-blue">{a.category} · {a.read} read</p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-[clamp(2.8rem,6.4vw,6rem)] leading-[0.98] tracking-[-0.02em]" style={{ textWrap: "balance" }}>{a.title}</motion.h1>
          <p className="mt-8 max-w-2xl font-display text-[1.6rem] italic leading-snug text-muted">{a.excerpt}</p>
        </header>

        <div className="mt-20 grid gap-14 border-t border-line pt-14 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <p className="label text-muted">In this article</p>
              <ul className="mt-5 space-y-3 text-[14px]">
                {headings.map((h) => <li key={h}><a href={`#j-${a.slug}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollToAnchor(slugify(h)); }} className="text-ink/70 transition hover:text-blue">{h}</a></li>)}
              </ul>
            </div>
          </aside>

          <article className="max-w-[680px]">
            {a.body.map((b, i) => {
              if (b.t === "h") return <h2 key={i} id={slugify(b.text)} className="mb-5 mt-14 scroll-mt-32 font-display text-[2.3rem] leading-tight first:mt-0">{b.text}</h2>;
              if (b.t === "p") return <p key={i} className="mb-6 text-[17.5px] leading-[1.75] text-ink/80">{b.text}</p>;
              if (b.t === "list") return (
                <ul key={i} className="mb-8 space-y-3">
                  {b.items.map((it) => <li key={it} className="flex gap-4 text-[17px] leading-[1.65] text-ink/80"><span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />{it}</li>)}
                </ul>
              );
              return (
                <aside key={i} className="my-10 rounded-2xl bg-blue-soft p-7">
                  <p className="label text-blue">Nickora tip</p>
                  <p className="mt-3 font-display text-[1.6rem] leading-snug">{b.text}</p>
                </aside>
              );
            })}
            <p className="mt-12 border-t border-line pt-6 text-[14px] text-muted">General guidance only. Always check your own university's rules and your supervisor's advice.</p>

            <div className="mt-14 rounded-2xl bg-ink p-8 text-white md:p-10">
              <p className="label text-white/50">Still stuck?</p>
              <p className="mt-4 font-display text-[2.4rem] leading-[1.05]">Talk it through with a Nickora mentor.</p>
              <div className="mt-8"><PillButton href="#contact" dark={false}>Free consultation</PillButton></div>
            </div>
          </article>
        </div>

        <section className="mt-28">
          <p className="label text-muted">Keep reading</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {more.map((m) => (
              <a key={m.slug} href={`#j-${m.slug}`} className="group rounded-2xl border border-line bg-card p-7 transition hover:border-ink/30">
                <div className="flex justify-between"><span className="label text-blue">{m.category}</span><ArrowUpRight size={18} className="transition group-hover:text-blue" /></div>
                <h3 className="mt-8 font-display text-[2rem] leading-[1.05]">{m.title}</h3>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

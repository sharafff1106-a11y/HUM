import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Check, Plus, X } from "lucide-react";
import { articles, readTime, type Block } from "../articles";
import { brand } from "../content";
import { PillButton } from "./ui";
import { setHead } from "../seo";
import { HASH_MODE, JOURNAL, article, scrollToAnchor, sec } from "../router";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Per-article SEO: title, description, keywords and Article + FAQPage structured data.
function useSeo(a: (typeof articles)[number] | undefined) {
  useEffect(() => {
    if (!a) return;
    setHead(`${a.title} | ${brand.name} Journal`, a.metaDescription, article(a.slug));
    let kw = document.querySelector<HTMLMetaElement>('meta[name="keywords"]');
    if (!kw) { kw = document.createElement("meta"); kw.name = "keywords"; document.head.appendChild(kw); }
    kw.content = a.keywords.join(", ");
    // Structured data is already in the pre-rendered HTML; add it only when it's missing (client-side navigation).
    if (document.querySelector(`script[data-ld="${a.slug}"]`) || (!HASH_MODE && location.pathname === article(a.slug) && document.querySelector('script[type="application/ld+json"]'))) return;
    const faqs = a.body.flatMap((b) => (b.t === "faq" ? b.items : []));
    const ld = document.createElement("script");
    ld.type = "application/ld+json"; ld.dataset.ld = a.slug;
    ld.text = JSON.stringify([
      { "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.metaDescription, keywords: a.keywords.join(", "), author: { "@type": "Organization", name: brand.name }, publisher: { "@type": "Organization", name: brand.name } },
      ...(faqs.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }] : []),
    ]);
    document.head.appendChild(ld);
    return () => { ld.remove(); kw!.content = ""; };
  }, [a]);
}

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="border-t border-line">
      {items.map((f, i) => (
        <div key={f.q} className="border-b border-line">
          <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-[1.45rem] leading-snug">
            {f.q}<Plus size={20} strokeWidth={1.4} className={`shrink-0 transition-transform ${open === i ? "rotate-45 text-blue" : ""}`} />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="pb-6 text-[16.5px] leading-[1.7] text-ink/75">{f.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function Render({ b }: { b: Block }) {
  switch (b.t) {
    case "h": return <h2 id={slugify(b.text)} className="mb-5 mt-16 font-display text-[clamp(1.9rem,3vw,2.5rem)] leading-tight first:mt-0" style={{ textWrap: "balance" }}>{b.text}</h2>;
    case "p": return <p className="mb-6 text-[17.5px] leading-[1.8] text-ink/80">{b.text}</p>;
    case "list": return (
      <ul className="mb-8 space-y-3">
        {b.items.map((it) => <li key={it} className="flex gap-4 text-[17px] leading-[1.7] text-ink/80"><span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />{it}</li>)}
      </ul>
    );
    case "steps": return (
      <ol className="my-8 space-y-0 border-l border-line">
        {b.items.map((s, i) => (
          <li key={s.title} className="relative pb-8 pl-10 last:pb-0">
            <span className="absolute -left-[15px] top-0 grid h-[30px] w-[30px] place-items-center rounded-full border border-blue bg-paper font-mono text-[11px] text-blue">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="font-display text-[1.55rem] leading-tight">{s.title}</h3>
            <p className="mt-2 text-[16.5px] leading-[1.75] text-ink/75">{s.text}</p>
          </li>
        ))}
      </ol>
    );
    case "example": return (
      <figure className="my-10 overflow-hidden rounded-2xl border border-line bg-card">
        <figcaption className="label border-b border-line px-6 py-4 text-muted">{b.label}</figcaption>
        <div className="grid md:grid-cols-2">
          <div className="border-b border-line p-6 md:border-b-0 md:border-r">
            <p className="label flex items-center gap-2 text-[#c8412f]"><X size={13} /> Before</p>
            <p className="mt-3 font-display text-[1.3rem] leading-snug text-ink/60">{b.bad}</p>
          </div>
          <div className="bg-blue-soft/50 p-6">
            <p className="label flex items-center gap-2 text-blue"><Check size={13} /> Better</p>
            <p className="mt-3 font-display text-[1.3rem] leading-snug">{b.good}</p>
          </div>
        </div>
        <p className="border-t border-line px-6 py-4 text-[15px] leading-relaxed text-muted"><b className="font-semibold text-ink">Why it works: </b>{b.why}</p>
      </figure>
    );
    case "tip": return (
      <aside className="my-10 rounded-2xl bg-blue-soft p-7">
        <p className="label text-blue">Nickora tip</p>
        <p className="mt-3 font-display text-[1.5rem] leading-snug">{b.text}</p>
      </aside>
    );
    case "checklist": return (
      <div className="my-10 rounded-2xl bg-ink p-7 text-white md:p-8">
        <p className="label text-white/50">Checklist</p>
        <p className="mt-2 font-display text-[1.8rem]">{b.title}</p>
        <ul className="mt-5 space-y-3">
          {b.items.map((it) => <li key={it} className="flex gap-3 text-[16px] leading-snug text-white/85"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-white/30"><Check size={12} className="text-[#8f9bff]" /></span>{it}</li>)}
        </ul>
      </div>
    );
    case "faq": return (
      <section className="mt-16">
        <h2 id="frequently-asked-questions" className="mb-6 font-display text-[clamp(1.9rem,3vw,2.5rem)] leading-tight">Frequently asked questions</h2>
        <Faq items={b.items} />
      </section>
    );
  }
}

export default function ArticlePage({ slug }: { slug: string }) {
  const idx = articles.findIndex((a) => a.slug === slug);
  const a = articles[idx];
  const [progress, setProgress] = useState(0);
  useSeo(a);

  useEffect(() => {
    const f = () => { const max = document.documentElement.scrollHeight - innerHeight; setProgress(max > 0 ? scrollY / max : 0); };
    f(); addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);

  if (!a) {
    return (
      <main className="mx-auto max-w-3xl px-5 pb-40 pt-48">
        <h1 className="font-display text-6xl">Article not found.</h1>
        <a href={JOURNAL} className="mt-8 inline-block border-b border-ink pb-1">Back to the Journal</a>
      </main>
    );
  }

  const toc = [...a.body.filter((b) => b.t === "h").map((b) => (b as { text: string }).text), ...(a.body.some((b) => b.t === "faq") ? ["Frequently asked questions"] : [])];
  const more = [articles[(idx + 1) % articles.length], articles[(idx + 2) % articles.length]];

  return (
    <>
      <div className="fixed inset-x-0 top-[78px] z-40 h-[2px]"><div className="h-full bg-blue" style={{ width: `${progress * 100}%` }} /></div>
      <main className="mx-auto max-w-[1400px] px-5 pb-24 pt-36 md:px-10 md:pt-44">
        <a href={JOURNAL} className="label inline-flex items-center gap-2 text-muted transition hover:text-blue"><ArrowLeft size={14} /> Journal</a>
        <header className="mt-10 max-w-5xl">
          <p className="label text-blue">{a.category} · {readTime(a)} read · Updated {a.updated}</p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-[clamp(2.8rem,6.4vw,6rem)] leading-[0.98] tracking-[-0.02em]" style={{ textWrap: "balance" }}>{a.title}</motion.h1>
          <p className="mt-8 max-w-2xl font-display text-[1.6rem] italic leading-snug text-muted">{a.excerpt}</p>
        </header>

        <div className="mt-20 grid gap-14 border-t border-line pt-14 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <nav className="sticky top-32" aria-label="In this article">
              <p className="label text-muted">In this article</p>
              <ul className="mt-5 space-y-3 text-[14px]">
                {toc.map((h) => <li key={h}><a href={`#${slugify(h)}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollToAnchor(slugify(h)); }} className="text-ink/70 transition hover:text-blue">{h}</a></li>)}
              </ul>
            </nav>
          </aside>

          <article className="min-w-0 max-w-[700px]">
            <details className="mb-10 rounded-2xl border border-line bg-card p-5 lg:hidden">
              <summary className="label cursor-pointer text-muted">In this article</summary>
              <ul className="mt-4 space-y-3 text-[15px]">
                {toc.map((h) => <li key={h}><a href={`#${slugify(h)}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollToAnchor(slugify(h)); }} className="text-ink/75">{h}</a></li>)}
              </ul>
            </details>
            <section className="mb-14 rounded-2xl border border-line bg-card p-7 md:p-8">
              <p className="label text-blue">Key takeaways</p>
              <ul className="mt-5 space-y-3">
                {a.takeaways.map((t) => <li key={t} className="flex gap-3 text-[16.5px] leading-snug"><Check size={18} className="mt-0.5 shrink-0 text-blue" />{t}</li>)}
              </ul>
            </section>

            {a.body.map((b, i) => <Render key={i} b={b} />)}

            <section className="mt-16 border-t border-line pt-8">
              <p className="label text-muted">Sources and further reading</p>
              <ul className="mt-4 space-y-2 text-[15px]">
                {a.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-ink/75 underline decoration-line underline-offset-4 transition hover:text-blue hover:decoration-blue">{s.label}</a></li>)}
              </ul>
              <p className="mt-6 text-[14px] text-muted">General guidance only. Always check your own university's rules and your supervisor's advice.</p>
            </section>

            <div className="mt-14 rounded-2xl bg-ink p-8 text-white md:p-10">
              <p className="label text-white/50">Still stuck?</p>
              <p className="mt-4 font-display text-[2.4rem] leading-[1.05]">Talk it through with Nick.</p>
              <div className="mt-8"><PillButton href={sec("contact")} dark={false}>Talk with Nick</PillButton></div>
            </div>
          </article>
        </div>

        <section className="mt-20">
          <p className="label text-muted">Keep reading</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {more.map((m) => (
              <a key={m.slug} href={article(m.slug)} className="group rounded-2xl border border-line bg-card p-7 transition hover:border-ink/30">
                <div className="flex justify-between"><span className="label text-blue">{m.category} · {readTime(m)}</span><ArrowUpRight size={18} className="transition group-hover:text-blue" /></div>
                <h3 className="mt-8 font-display text-[2rem] leading-[1.05]">{m.title}</h3>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { articles, categories, readTime } from "../articles";
import { PillButton } from "./ui";

export default function Journal() {
  const [cat, setCat] = useState("All");
  const list = articles.filter((a) => cat === "All" || a.category === cat);
  const [active, setActive] = useState(0);
  const a = list[Math.min(active, list.length - 1)];

  return (
    <main className="mx-auto max-w-[1400px] px-5 pb-28 pt-40 md:px-10 md:pb-40 md:pt-48">
      <p className="label text-muted">Journal · {articles.length} articles</p>
      <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 font-display text-[clamp(3.4rem,9.6vw,9rem)] leading-[0.92] tracking-[-0.025em]">
        Notes for the <em className="text-blue">stuck.</em>
      </motion.h1>
      <p className="mt-8 max-w-lg text-[16px] leading-relaxed text-muted">Practical guides on research, writing, admissions and academic integrity. Free to read, no sign-up.</p>

      <div className="mt-14 flex flex-wrap gap-2" role="tablist" aria-label="Filter by topic">
        {categories.map((c) => (
          <button key={c} role="tab" aria-selected={c === cat} onClick={() => { setCat(c); setActive(0); }}
            className={`rounded-full border px-5 py-2 text-[14px] transition ${c === cat ? "border-ink bg-ink text-white" : "border-line text-ink/70 hover:border-ink/40"}`}>{c}</button>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="label hidden grid-cols-[60px_1fr_140px_70px] border-b border-line pb-4 text-muted md:grid"><span>No.</span><span>Article</span><span>Topic</span><span className="text-right">Read</span></div>
          <ul>
            {list.map((x, i) => (
              <li key={x.slug} onMouseEnter={() => setActive(i)}>
                <a href={`#j-${x.slug}`} onFocus={() => setActive(i)}
                  className={`grid grid-cols-[44px_1fr] items-baseline gap-x-4 border-b py-7 transition-colors duration-500 md:grid-cols-[60px_1fr_140px_70px] ${i === active ? "lg:border-blue" : ""} border-line`}>
                  <span className={`label ${i === active ? "text-blue" : "text-blue lg:text-muted/60"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={`font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.05] transition-colors duration-500 ${i === active ? "text-ink" : "text-ink lg:text-ink/35"}`}>{x.title}</span>
                  <span className={`label hidden md:block ${i === active ? "text-blue" : "text-muted/60"}`}>{x.category}</span>
                  <span className="label hidden text-right text-muted md:block">{readTime(x)}</span>
                  <span className="col-span-2 mt-3 text-[15px] text-muted lg:hidden">{x.excerpt}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden lg:block">
          {a && (
            <div className="sticky top-32 rounded-2xl border border-line bg-card p-8">
              <AnimatePresence mode="wait">
                <motion.div key={a.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div className="flex justify-between"><span className="label text-blue">● {a.category}</span><span className="label text-muted">{readTime(a)} read</span></div>
                  <h2 className="mt-10 font-display text-4xl leading-[1.05]">{a.title}</h2>
                  <p className="mt-5 text-[15px] leading-relaxed text-muted">{a.excerpt}</p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-10"><PillButton href={`#j-${a.slug}`}>Read article</PillButton></div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

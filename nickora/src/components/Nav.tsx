import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./ui";

const links = [["Services", "#services"], ["Process", "#process"], ["Promise", "#promise"], ["FAQ", "#faq"], ["Contact", "#contact"]];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-paper/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-5 md:px-10">
        <Wordmark />
        <ul className="hidden gap-10 md:flex">
          {links.map(([l, h]) => <li key={h}><a href={h} className="text-[15px] text-ink/70 transition hover:text-ink">{l}</a></li>)}
        </ul>
        <a href="#contact" className="hidden rounded-full border border-ink/20 px-6 py-3 text-[14px] font-medium transition hover:border-ink md:block">Free consultation</a>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && (
        <ul className="border-t border-line px-5 pb-6 pt-2 md:hidden">
          {links.map(([l, h]) => <li key={h}><a href={h} onClick={() => setOpen(false)} className="block py-3 font-display text-3xl">{l}</a></li>)}
        </ul>
      )}
    </header>
  );
}

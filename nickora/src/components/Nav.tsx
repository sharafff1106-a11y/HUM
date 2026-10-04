import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./ui";

const links = [["Services", "#services"], ["Process", "#process"], ["Promise", "#promise"], ["Journal", "#journal"], ["Contact", "#contact"]];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b border-line/70 backdrop-blur-xl ${open ? "bg-paper" : "bg-paper/80"}`}>
      <nav className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-5 md:px-10">
        <Wordmark />
        <ul className="hidden gap-10 lg:flex">
          {links.map(([l, h]) => <li key={h}><a href={h} className="text-[15px] text-ink/70 transition hover:text-ink">{l}</a></li>)}
        </ul>
        <a href="#contact" className="hidden rounded-full border border-ink/20 px-6 py-3 text-[14px] font-medium transition hover:border-ink lg:block">Free consultation</a>
        <button className="p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && (
        <ul className="h-[calc(100svh-78px)] border-t border-line bg-paper px-5 pb-8 pt-4 lg:hidden">
          {links.map(([l, h]) => <li key={h}><a href={h} onClick={() => setOpen(false)} className="block border-b border-line py-4 font-display text-4xl">{l}</a></li>)}
        </ul>
      )}
    </header>
  );
}

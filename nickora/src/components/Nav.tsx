import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./ui";

const links = [["Where you're stuck", "#struggles"], ["Services", "#services"], ["How it works", "#process"], ["Our standards", "#standards"], ["FAQ", "#faq"]];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(scrollY > 12);
    f(); addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "border-b border-line bg-white/90 backdrop-blur-xl" : ""}`}>
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 md:px-8">
        <Wordmark />
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map(([l, h]) => (
            <li key={h}><a href={h} className="text-sm font-medium text-slate transition hover:text-ink">{l}</a></li>
          ))}
        </ul>
        <a href="#contact" className="hidden rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald lg:block">Free consultation</a>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && (
        <ul className="border-t border-line bg-white px-5 pb-6 pt-2 lg:hidden">
          {[...links, ["Free consultation", "#contact"]].map(([l, h]) => (
            <li key={h}><a href={h} onClick={() => setOpen(false)} className="block py-3 font-display text-2xl">{l}</a></li>
          ))}
        </ul>
      )}
    </header>
  );
}

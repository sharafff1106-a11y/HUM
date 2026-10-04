import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./ui";

const links = [["Services", "#services"], ["Process", "#process"], ["Research", "#research"], ["Craft", "#craft"], ["FAQ", "#faq"]];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(scrollY > 24);
    f(); addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? "bg-ink/75 backdrop-blur-xl border-b border-white/10" : ""}`}>
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        <Logo />
        <ul className="hidden items-center gap-9 md:flex">
          {links.map(([l, h]) => (
            <li key={h}><a href={h} className="text-sm text-paper/70 transition hover:text-gold">{l}</a></li>
          ))}
        </ul>
        <a href="#contact" className="hidden rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-paper md:block">Book a free call</a>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <ul className="space-y-1 border-t border-white/10 px-6 pb-6 pt-3 md:hidden">
          {[...links, ["Book a free call", "#contact"]].map(([l, h]) => (
            <li key={h}><a href={h} onClick={() => setOpen(false)} className="block py-3 font-display text-2xl">{l}</a></li>
          ))}
        </ul>
      )}
    </header>
  );
}

import { JOURNAL, sec } from "../router";

export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-[1400px] flex-col gap-4 border-t border-line px-5 pb-24 pt-8 text-[13px] text-muted md:flex-row md:justify-between md:px-10">
      <span className="font-semibold tracking-[0.32em] text-ink">NICKORA</span>
      <span className="flex gap-6"><a href={JOURNAL} className="hover:text-ink">Journal</a><a href={sec("contact")} className="hover:text-ink">Contact</a></span>
      <span>© {new Date().getFullYear()} Nickora · Guidance, mentoring and editing</span>
    </footer>
  );
}

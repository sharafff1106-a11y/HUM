import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { brand, services } from "../content";
import { Eyebrow, Reveal, Wordmark } from "./ui";

const field = "w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-white placeholder:text-white/40 outline-none transition focus:border-mint focus:bg-white/10";

export default function Contact() {
  const [sent, setSent] = useState(false);

  // No backend: opens the visitor's email app pre-filled. Swap for Formspree/Web3Forms later.
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = `Name: ${d.get("name")}\nEmail: ${d.get("email")}\nService: ${d.get("service")}\n\n${d.get("message")}`;
    location.href = `mailto:${brand.email}?subject=${encodeURIComponent("Nickora enquiry: " + d.get("service"))}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <>
      <section id="contact" className="bg-navy py-24 text-white md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-2">
          <Reveal>
            <Eyebrow light>Start here</Eyebrow>
            <h2 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">Tell us where you're stuck.</h2>
            <p className="mt-6 max-w-md text-lg text-white/65">Share a few lines. We'll reply with a free first conversation and an honest view of how we can help, or whether we can't.</p>
            <div className="mt-10 space-y-4">
              <p className="flex items-center gap-3 text-white/85"><Mail size={20} className="text-mint" /><span className="select-all">{brand.email}</span></p>
              {brand.whatsapp && (
                <a href={`https://wa.me/${brand.whatsapp}`} className="flex items-center gap-3 text-white/85 transition hover:text-mint"><MessageCircle size={20} className="text-mint" />Chat on WhatsApp</a>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form onSubmit={submit} className="space-y-4 rounded-3xl bg-navy-2 p-8 ring-1 ring-white/10 md:p-10">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sr-only" htmlFor="name">Name</label>
                <input id="name" name="name" required placeholder="Your name" className={field} />
                <label className="sr-only" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required placeholder="Email address" className={field} />
              </div>
              <label className="sr-only" htmlFor="service">Service</label>
              <select id="service" name="service" className={field} defaultValue={services[0].title}>
                {services.map((s) => <option key={s.id} className="bg-navy">{s.title}</option>)}
              </select>
              <label className="sr-only" htmlFor="message">Message</label>
              <textarea id="message" name="message" required rows={5} placeholder="Your level, subject, what you're stuck on and any deadline…" className={field} />
              <button className="group flex w-full items-center justify-center gap-3 rounded-full bg-mint py-4 font-semibold text-ink transition hover:bg-white">
                Send enquiry <ArrowRight className="transition group-hover:translate-x-1" size={18} />
              </button>
              {sent && <p role="status" className="text-center text-sm text-mint">Your email app should open with the message ready to send.</p>}
              <p className="text-center text-xs text-white/45">Confidential. We never share your details.</p>
            </form>
          </Reveal>
        </div>
      </section>

      <footer className="bg-navy px-5 pb-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/45 md:flex-row">
          <Wordmark light />
          <p>© {new Date().getFullYear()} Nickora. Guidance, mentoring and editing, never ghostwriting.</p>
        </div>
      </footer>
    </>
  );
}

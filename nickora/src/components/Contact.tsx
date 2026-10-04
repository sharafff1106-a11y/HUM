import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { brand, services } from "../content";
import { Eyebrow, Logo, Reveal } from "./ui";

const field = "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-paper placeholder:text-paper/35 outline-none transition focus:border-gold focus:bg-white/10";

export default function Contact() {
  const [sent, setSent] = useState(false);

  // No backend: opens the visitor's email client pre-filled. Swap for Formspree/Web3Forms later.
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = `Name: ${d.get("name")}\nEmail: ${d.get("email")}\nService: ${d.get("service")}\n\n${d.get("message")}`;
    location.href = `mailto:${brand.email}?subject=${encodeURIComponent("Nickora enquiry — " + d.get("service"))}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <>
      <section id="contact" className="grain relative isolate overflow-hidden bg-ink-2 py-32">
        <div className="aurora absolute -right-1/4 top-0 -z-10 h-[50vw] w-[50vw] rounded-full bg-gold/15 blur-[140px]" />
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>Begin</Eyebrow>
            <h2 className="mt-6 font-display text-5xl font-light leading-[1.02] tracking-tight md:text-7xl">
              Your next chapter <span className="text-gradient italic">starts here.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-paper/65">Tell us where you are. We'll reply with a free discovery call and a first-step plan.</p>
            <div className="mt-10 space-y-4">
              <a href={`mailto:${brand.email}`} className="flex items-center gap-3 text-paper/80 transition hover:text-gold"><Mail size={20} className="text-gold" />{brand.email}</a>
              {brand.whatsapp && (
                <a href={`https://wa.me/${brand.whatsapp}`} className="flex items-center gap-3 text-paper/80 transition hover:text-gold"><MessageCircle size={20} className="text-gold" />Chat on WhatsApp</a>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={submit} className="space-y-4 rounded-3xl border border-white/10 bg-ink/60 p-8 backdrop-blur md:p-10">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sr-only" htmlFor="name">Name</label>
                <input id="name" name="name" required placeholder="Your name" className={field} />
                <label className="sr-only" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required placeholder="Email address" className={field} />
              </div>
              <label className="sr-only" htmlFor="service">Service</label>
              <select id="service" name="service" className={field} defaultValue={services[0].title}>
                {services.map((s) => <option key={s.id} className="bg-ink">{s.title}</option>)}
              </select>
              <label className="sr-only" htmlFor="message">Message</label>
              <textarea id="message" name="message" required rows={5} placeholder="Tell us about your goals, level and deadline…" className={field} />
              <button className="group flex w-full items-center justify-center gap-3 rounded-full bg-gold py-4 font-semibold text-ink transition hover:bg-paper">
                Send enquiry <ArrowRight className="transition group-hover:translate-x-1" size={18} />
              </button>
              {sent && <p role="status" className="text-center text-sm text-aqua">Your email app should open with the message ready to send.</p>}
            </form>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-ink px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-paper/50 md:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} Nickora. Guidance, mentoring & editing — never ghostwriting.</p>
        </div>
      </footer>
    </>
  );
}

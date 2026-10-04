import { useState, type FormEvent } from "react";
import { brand, services } from "../content";
import { Chapter, Reveal } from "./ui";
import { ArrowRight } from "lucide-react";

const field = "w-full border-b border-line bg-transparent py-4 text-[17px] outline-none transition placeholder:text-muted/70 focus:border-blue";

export default function Contact() {
  const [sent, setSent] = useState(false);

  // No backend yet: opens the visitor's email app pre-filled. Swap for Formspree/Web3Forms later.
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = `Name: ${d.get("name")}\nEmail: ${d.get("email")}\nService: ${d.get("service")}\n\n${d.get("message")}`;
    location.href = `mailto:${brand.email}?subject=${encodeURIComponent("Nickora enquiry: " + d.get("service"))}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <>
      <section id="contact" className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
        <Reveal>
          <Chapter n="07">Contact</Chapter>
          <h2 className="mt-6 font-display text-[clamp(3.4rem,10vw,10rem)] leading-[0.88] tracking-[-0.03em]">Let's write your<br /><em className="text-blue">next chapter.</em></h2>
        </Reveal>
        <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="space-y-8">
            <p className="max-w-sm text-[16px] leading-relaxed text-muted">Tell us where you are. We'll reply with a free first conversation.</p>
            <div><p className="label text-muted">Email</p><p className="mt-2 select-all font-display text-3xl">{brand.email}</p></div>
          </Reveal>
          <Reveal delay={0.1}>
            <form onSubmit={submit} className="grid gap-2 sm:grid-cols-2 sm:gap-x-8">
              <label className="sr-only" htmlFor="name">Name</label>
              <input id="name" name="name" required placeholder="Your name" className={field} />
              <label className="sr-only" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required placeholder="Email address" className={field} />
              <label className="sr-only" htmlFor="service">Service</label>
              <select id="service" name="service" className={`${field} sm:col-span-2`} defaultValue={services[0].title}>
                {services.map((s) => <option key={s.id}>{s.title}</option>)}
              </select>
              <label className="sr-only" htmlFor="message">Message</label>
              <textarea id="message" name="message" required rows={3} placeholder="What are you working on?" className={`${field} resize-none sm:col-span-2`} />
              <div className="mt-8 flex flex-wrap items-center gap-6 sm:col-span-2">
                <button className="group inline-flex items-center gap-4 rounded-full bg-ink py-2 pl-7 pr-2 text-[15px] font-medium text-white transition hover:bg-blue">
                  Send enquiry
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-blue transition group-hover:bg-white group-hover:text-blue"><ArrowRight size={18} /></span>
                </button>
                {sent && <p role="status" className="text-sm text-blue">Your email app should open with the message ready.</p>}
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

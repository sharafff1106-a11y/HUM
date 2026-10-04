import { useEffect } from "react";
import Lenis from "lenis";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Struggles from "./components/Struggles";
import Process from "./components/Process";
import Promise from "./components/Promise";
import Marquee from "./components/Marquee";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import ChapterBar from "./components/ChapterBar";

export default function App() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -78 } });
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Services />
        <Struggles />
        <Process />
        <Promise />
        <Faq />
        <Marquee />
        <Contact />
      </main>
      <ChapterBar />
    </>
  );
}

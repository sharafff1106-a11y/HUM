import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis, useRoute } from "./router";
import { usePageHead } from "./seo";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Intro from "./components/Intro";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Struggles from "./components/Struggles";
import Process from "./components/Process";
import Promise from "./components/Promise";
import JournalTeaser from "./components/JournalTeaser";
import Marquee from "./components/Marquee";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChapterBar from "./components/ChapterBar";
import Journal from "./components/Journal";
import ArticlePage from "./components/ArticlePage";

export default function App() {
  const route = useRoute();
  usePageHead(route);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09 });
    setLenis(lenis);
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); setLenis(null); };
  }, []);

  return (
    <>
      <Cursor />
      <Intro />
      <Nav page={route.page} />
      {route.page === "home" && (
        <>
          <main>
            <Hero />
            <Services />
            <Struggles />
            <Process />
            <Promise />
            <JournalTeaser />
            <Faq />
            <Marquee />
            <Contact />
          </main>
          <Footer />
          <ChapterBar />
        </>
      )}
      {route.page === "journal" && <><Journal /><Footer /></>}
      {route.page === "article" && <><ArticlePage key={route.slug} slug={route.slug} /><Footer /></>}
    </>
  );
}

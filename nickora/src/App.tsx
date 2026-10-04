import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Services from "./components/Services";
import Process from "./components/Process";
import Research from "./components/Research";
import Craft from "./components/Craft";
import Promise from "./components/Promise";
import Faq from "./components/Faq";
import Contact from "./components/Contact";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Process />
        <Research />
        <Craft />
        <Promise />
        <Faq />
        <Contact />
      </main>
    </>
  );
}

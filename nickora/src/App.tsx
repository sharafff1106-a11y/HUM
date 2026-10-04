import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Struggles from "./components/Struggles";
import Services from "./components/Services";
import Process from "./components/Process";
import Standards from "./components/Standards";
import Craft from "./components/Craft";
import Research from "./components/Research";
import Faq from "./components/Faq";
import Contact from "./components/Contact";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Struggles />
        <Services />
        <Process />
        <Standards />
        <Craft />
        <Research />
        <Faq />
        <Contact />
      </main>
    </>
  );
}

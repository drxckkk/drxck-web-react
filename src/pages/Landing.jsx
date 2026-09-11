import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/home/Hero";
import WorkSection from "../components/home/WorkSection";
import About from "../components/home/About";
import Places from "../components/home/Places";
import Toolbox from "../components/home/Toolbox";
import Contact from "../components/home/Contact";
import useReveal from "../hooks/useReveal";
import usePageMeta from "../hooks/usePageMeta";
import { prefersReducedMotion } from "../routes";

function Landing() {
  const ref = useRef(null);
  const { hash } = useLocation();

  usePageMeta({ path: "/" });
  useReveal(ref);

  useEffect(() => {
    if (!hash) return undefined;
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return undefined;
    const frame = requestAnimationFrame(() =>
      target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" })
    );
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <main id="main" className="site-main landing" ref={ref}>
      <Hero />
      <WorkSection />
      <About />
      <Places />
      <Toolbox />
      <Contact />
    </main>
  );
}

export default Landing;

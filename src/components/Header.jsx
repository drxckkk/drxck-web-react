import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Magnetic from "./Magnetic";
import "./Header.css";

const LINKS = [
  { id: "work", label: "work" },
  { id: "about", label: "about" },
  { id: "contact", label: "contact" },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = ["home", ...LINKS.map((l) => l.id)]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNav = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />

      <nav className="nav-pill" aria-label="Primary">
        <a href="#home" className="nav-brand" onClick={(e) => handleNav(e, "home")}>
          drxck
        </a>

        <ul className="nav-links">
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={active === link.id ? "is-active" : ""}
                onClick={(e) => handleNav(e, link.id)}
              >
                {active === link.id && (
                  <motion.span
                    className="nav-active-bg"
                    layoutId="nav-active-bg"
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <span className="nav-link-label">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <Magnetic strength={0.2}>
          <a href="#contact" className="nav-cta" onClick={(e) => handleNav(e, "contact")}>
            Contact me
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </a>
        </Magnetic>
      </nav>
    </header>
  );
}

export default Header;

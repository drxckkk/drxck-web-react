import { motion } from "framer-motion";
import { ActionButton } from "./Magnetic";
import WordReveal from "./WordReveal";
import HeroCarousel from "./HeroCarousel";
import "./Home.css";

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

/* the reference motion for the whole site: rise out of a blur */
const item = {
  hidden: { opacity: 0, y: 20, filter: "blur(9px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE },
  },
};

const FACTS = [
  { value: "5+", label: "Years building" },
  { value: "Roblox", label: "Primary platform" },
  { value: "Open", label: "Taking commissions" },
];

const MARQUEE = [
  "Vehicle systems",
  "Optimization",
  "Custom physics",
  "Weapon systems",
  "Front page quality",
  "Simulators",
  "Game-ready systems",
];

function Home() {
  return (
    <section id="home" className="hero">
      <div className="hero-inner">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <h1 className="hero-title">
            <span className="hero-line">
              <motion.span className="hero-word" variants={item}>I</motion.span>{" "}
              <motion.span className="hero-word" variants={item}>build</motion.span>{" "}
              <motion.span className="hero-word" variants={item}>systems</motion.span>
            </span>
            <span className="hero-line">
              <motion.span className="hero-word" variants={item}>that</motion.span>{" "}
              <motion.span className="hero-word hero-mark" variants={item}>
                feel
                {/* hand-drawn underline that draws itself once the word lands */}
                <svg
                  className="hero-underline"
                  viewBox="0 0 200 16"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M3 11.5C34 5.5 76 3.5 116 5.5C144 6.9 172 9.5 197 6"
                    stroke="var(--green)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: EASE, delay: 1 }}
                  />
                </svg>
              </motion.span>{" "}
              <motion.span className="hero-word" variants={item}>right.</motion.span>
            </span>
          </h1>

          <WordReveal
            className="hero-sub"
            as="p"
            playOnMount
            delay={0.55}
            stagger={0.028}
            text="I'm Drxck, a programmer with over five years building performance-friendly, modular systems and full experiences on Roblox."
          />

          <motion.div className="hero-actions" variants={item}>
            <ActionButton href="#work" variant="solid">
              View my work
            </ActionButton>
            <ActionButton href="#contact" variant="ghost">
              Get in touch
            </ActionButton>
          </motion.div>

          <motion.dl className="hero-facts" variants={item}>
            {FACTS.map((fact) => (
              <div className="hero-fact" key={fact.label}>
                <dt className="hero-fact-value">{fact.value}</dt>
                <dd className="hero-fact-label">{fact.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, y: 36, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
        >
          <HeroCarousel />
        </motion.div>
      </div>

      <motion.div
        className="hero-ticker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.9 }}
        aria-hidden="true"
      >
        <div className="hero-ticker-track">
          {[0, 1].map((copy) => (
            <div className="hero-ticker-group" key={copy}>
              {MARQUEE.map((entry) => (
                <span className="hero-ticker-item" key={entry}>
                  {entry}
                  <i className="fa-solid fa-circle" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.a
        href="#work"
        className="scroll-cue"
        aria-label="Scroll to work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="scroll-cue-track">
          <span className="scroll-cue-dot" />
        </span>
      </motion.a>
    </section>
  );
}

export default Home;

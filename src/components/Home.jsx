import { motion } from "framer-motion";
import "./Home.css";

const HEADLINE = ["I build", "systems that", "feel alive."];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.15 },
  },
};

const line = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

function Home() {
  return (
    <section id="home" className="hero">
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-inner">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.span className="eyebrow" variants={line}>
            Available for work
          </motion.span>

          <h1 className="hero-title">
            {HEADLINE.map((word, i) => (
              <motion.span className="hero-line" key={i} variants={line}>
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p className="hero-sub" variants={line}>
            I'm <strong>Drxck</strong>, a programmer with over 5 years in building
            performance-friendly modular systems and experiences.
          </motion.p>

          <motion.div className="hero-actions" variants={line}>
            <a href="#work" className="btn btn-primary">
              View my work
            </a>
            <a href="#contact" className="btn btn-ghost">
              Get in touch
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          <div className="code-window">
            <div className="code-window-bar">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
              <span className="code-window-title">vehicle_wheel.lua</span>
            </div>
            <pre className="code-window-body">
              <code>
{`local function apply_suspension(wheel: Wheel, dt: number)
    local force = wheel.spring.compress(dt)
    local damped = force - wheel.damper.rate * wheel.velocity

    wheel.body.add_force(damped * wheel.normal)
    wheel.velocity += damped * dt
end`}
              </code>
            </pre>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#work"
        className="scroll-indicator"
        aria-label="Scroll to work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="scroll-line" />
        <span className="scroll-label">Scroll</span>
      </motion.a>
    </section>
  );
}

export default Home;

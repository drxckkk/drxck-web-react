import { motion } from "framer-motion";
import WordReveal from "./WordReveal";
import "./About.css";

const EASE = [0.16, 1, 0.3, 1];

const PRINCIPLES = [
  {
    title: "Performance first",
    body: "Every system I build is meant to be modular, optimized and anti-exploitable, game-ready.",
  },
  {
    title: "Elegant under the hood",
    body: "Clean, readable code is something you will always find in my products.",
  },
  {
    title: "Built to be extended",
    body: "Config over hardcoding. My code is written with the thoughts of being modular and configurable so you can re-tune it easily without touching logic.",
  },
];

const CAPABILITIES = [
  "Vehicles & physics",
  "Weapons & combat",
  "Particles & VFX",
  "Economies & shops",
];

function About() {
  return (
    <section id="about" className="section about">
      <div className="section-inner about-grid">
        <div className="about-lead">
          <WordReveal
            className="section-heading"
            as="h2"
            text="Five years turning hard problems into *smooth* experiences."
          />
          <WordReveal
            className="section-sub"
            as="p"
            stagger={0.022}
            delay={0.1}
            text="I'm a programmer who cares about how my code feels to use as how efficiently it runs. My work comes across vehicles, weapons, particle systems and full projects, always delivered with a focus on performance and being efficient."
          />

          <ul className="capability-list">
            {CAPABILITIES.map((c, i) => (
              <motion.li
                key={c}
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
              >
                {c}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="principle-list">
          {PRINCIPLES.map((p) => (
            <div className="principle" key={p.title}>
              <WordReveal as="h3" text={p.title} stagger={0.04} />
              <WordReveal as="p" text={p.body} stagger={0.02} delay={0.08} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;

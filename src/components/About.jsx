import { motion } from "framer-motion";
import "./About.css";

const PRINCIPLES = [
  {
    title: "Performance first",
    body: "Every system I build is meant to modular, optimized and anti-exploitable, game-ready.",
  },
  {
    title: "Elegant",
    body: "Clean, readable code is something you will always find in my products.",
  },
];

function About() {
  return (
    <section id="about" className="section about">
      <div className="section-inner about-grid">
        <div>
          <span className="eyebrow">About</span>
          <h2 className="section-heading">
            Six years of turning hard problems into smooth experiences.
          </h2>
          <p className="section-sub">
            I'm a programmer who cares as much about how a system feels to use
            as how efficiently it runs. My work spans vehicle physics, particle
            systems, modular UIs and full game builds, always shipped with an eye for
            performance and polish, just-in-time.
          </p>
        </div>

        <div className="principle-list">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              className="principle"
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="principle-index">0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;

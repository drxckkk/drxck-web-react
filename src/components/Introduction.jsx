import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import WordReveal from "./WordReveal";
import "./Introduction.css";

const EASE = [0.16, 1, 0.3, 1];

const DESTINATIONS = [
  { to: "/work", label: "selected work" },
  //{ to: "/games", label: "games" },
  { to: "/about", label: "about me" },
];

function Introduction() {
  return (
    <section className="intro">
      <div className="shell">
        <hr className="rule" />

        <div className="intro-grid">
          <div className="intro-head">
            <span className="label">Small introduction</span>
          </div>

          <div className="intro-body">
            <WordReveal
              className="display display-l intro-statement"
              as="h2"
              stagger={0.045}
              amount={0.3}
              text="I like building things that are simple on the surface and *interesting* *underneath*."
            />
          </div>

          <div className="intro-aside">
            <motion.p
              className="copy"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            >
              My site is the place for things I make. Games, showcases,
              UI and technical projects. Some of it is client work, some
              of it exists only because I wanted to find out whether it would
              work.
            </motion.p>

            <motion.div
              className="intro-links"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            >
              {DESTINATIONS.map((destination) => (
                <Link key={destination.to} to={destination.to} className="pill-link">
                  {destination.label}
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Introduction;

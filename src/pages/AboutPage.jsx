import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HalftoneField from "../components/HalftoneField";
import WordReveal from "../components/WordReveal";
import "./AboutPage.css";

const EASE = [0.16, 1, 0.3, 1];

const PRINCIPLES = [
  {
    title: "Performance first",
    body: "Everything ships modular, optimized and hardened against exploits. If it drops frames on a low-end device, it isn't finished.",
  },
  {
    title: "Elegant under the hood",
    body: "Readable and organized code you could hand to the next developer without an apology. You own what I write.",
  },
  {
    title: "Built to be easily modified",
    body: "Systems arrive with a focus on flexibility and easily configurable, so a designer can re-tune the feel without touching much of the logic.",
  },
];

const CAPABILITIES = [
  "Vehicles & physics",
  "Weapons & combat",
  "Interfaces",
  "Economies & Data",
  "2D & 3D games",
];

const FACTS = [
  { value: "5+", label: "Years of experience" },
  { value: "Roblox", label: "Main platform" },
  { value: "Godot, Three.js", label: "Other Areas" },
];

function AboutPage() {
  return (
    <>
      <Header />
      <main className="site-main page">
        <section className="page-head">
          <div className="page-head-field" aria-hidden="true">
            <HalftoneField variant="blob" density={18} speed={0.55} intensity={0.95} />
          </div>

          <div className="shell page-head-inner">
            <span className="label">About</span>
            <WordReveal
              className="display display-l page-title"
              as="h1"
              playOnMount
              stagger={0.05}
              text="Five years turning hard problems into things that feel effortless."
            />
            <p className="copy page-lead">
              I'm Drxck. I care as much about how something feels to use as how
              efficiently it runs, which you can always expect the best quality from my work.
            </p>
          </div>
        </section>

        <section className="shell about-body">
          <hr className="rule" />

          <div className="about-facts">
            {FACTS.map((fact, i) => (
              <motion.div
                className="about-fact"
                key={fact.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              >
                <span className="about-fact-value">{fact.value}</span>
                <span className="label">{fact.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="about-split">
            <div className="about-col">
              <span className="label">How I work</span>
              <div className="principle-stack">
                {PRINCIPLES.map((principle, i) => (
                  <motion.article
                    className="principle-item"
                    key={principle.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.75, delay: i * 0.08, ease: EASE }}
                  >
                    <span className="principle-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="principle-title">{principle.title}</h2>
                    <p className="principle-body">{principle.body}</p>
                  </motion.article>
                ))}
              </div>
            </div>

            <div className="about-col">
              <span className="label">What I work with</span>
              <ul className="capability-grid">
                {CAPABILITIES.map((capability, i) => (
                  <motion.li
                    key={capability}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                  >
                    {capability}
                  </motion.li>
                ))}
              </ul>

              <p className="copy about-note">
                Most of the work I do is on Roblox, where I have years of experience with
                gameplay systems, side projects and complete games. The rest of the
                time I'm building fun projects around physics, voxels and ESP32 
                gimmicks to see what falls out.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AboutPage;

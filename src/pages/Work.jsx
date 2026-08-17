import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Projects from "../components/Projects";
import HeroCarousel from "../components/HeroCarousel";
import DotField from "../components/DotField";
import "./Work.css";

const EASE = [0.16, 1, 0.3, 1];

/**
 * The professional portfolio. Same monochrome system as the rest of the site —
 * the halftone here is the cursor-reactive DotField sitting behind everything.
 */
function Work() {
  return (
    <>
      <DotField />
      <Header />
      <main className="site-main page work-page">
        <section className="shell work-intro">
          <div className="work-intro-copy">
            <span className="label">Portfolio</span>
            <h1 className="display display-l work-title">
              Systems built to be <em>just as you wish</em>.
            </h1>
            <p className="copy work-lead">
              Client commissions and shipped products, gameplay systems,
              side projects and complete games, each built under real metrics.
            </p>
          </div>

          <motion.div
            className="work-carousel"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: EASE }}
          >
            <HeroCarousel />
          </motion.div>
        </section>

        <Projects />
      </main>
      <Footer />
    </>
  );
}

export default Work;

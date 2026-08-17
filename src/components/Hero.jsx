import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import IpodField from "./IpodField";
import WordReveal from "./WordReveal";
import "./Hero.css";

const EASE = [0.16, 1, 0.3, 1];

function Hero() {
  const ref = useRef(null);

  return (
    <section className="lp-hero" ref={ref}>
      <div className="lp-hero-canvas">
        {/* IpodField owns its own float, lean and parallax, so the wrapper
            stays still — a moving wrapper would drag its hit targets around */}
        <div className="lp-hero-composition">
          <IpodField />
        </div>
      </div>

      <div className="shell lp-hero-shell">
        <div className="lp-hero-copy">
          <WordReveal
            className="display display-xl lp-hero-statement"
            as="h1"
            playOnMount
            delay={0.25}
            stagger={0.055}
            text="Making everything I can feel better."
          />

          <WordReveal
            className="copy lp-hero-sub"
            as="p"
            playOnMount
            delay={0.9}
            stagger={0.014}
            text="I build things, experiment with new tech and spend an unreasonable amount of time making tiny details feel good."
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.35, ease: EASE }}
          >
            <Link to="/about" className="text-link lp-hero-more">
              more about me
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

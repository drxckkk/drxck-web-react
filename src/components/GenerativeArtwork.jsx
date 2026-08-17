import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import ScannedField from "./ScannedField";
import "./GenerativeArtwork.css";

/**
 * The homepage's centrepiece. A halftone field with a desk object being
 * reconstructed at its core, orbited by three more that double as navigation.
 *
 * Scroll drives one coordinated motion (a gentle scale and a few degrees of
 * tilt) — kept small deliberately, because the orbit carries real hit targets
 * and a heavily transformed layer is unpleasant to aim at.
 */
function GenerativeArtwork() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [object, setObject] = useState(null);

  /* stable identity — ScannedField keys its animation effect off this */
  const handleObject = useCallback((label) => setObject(label), []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 26,
    restDelta: 0.0005,
  });

  const rotate = useTransform(smooth, [0, 1], [-3, 3]);
  const scale = useTransform(smooth, [0, 0.5, 1], [0.94, 1.02, 0.94]);

  return (
    <section className="artwork" ref={ref}>
      <div className="artwork-head shell">
        <span className="label">MY AREA</span>
        <span className="label artwork-reading">
          {object ? `${object}` : "Scanning"}
        </span>
      </div>

      <div className="artwork-stage">
        <motion.div
          className="artwork-plate"
          style={reduced ? undefined : { rotate, scale }}
        >
          <ScannedField onObjectChange={handleObject} />
        </motion.div>
      </div>

      <div className="artwork-foot shell">
        <span className="label">Just hover one of the cool floating objects, then open it</span>
      </div>
    </section>
  );
}

export default GenerativeArtwork;

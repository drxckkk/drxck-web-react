import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "./Magnetic.css";

/**
 * Wraps any element so it leans toward the cursor and springs back on exit.
 * `strength` is the fraction of the cursor offset the element travels; the
 * inner content travels a little further, which reads as depth.
 *
 * Kept deliberately small — the site's motion is restrained, so this is a few
 * pixels of lean on small controls, never a whole component chasing a pointer.
 */
function Magnetic({
  children,
  strength = 0.32,
  disabled = false,
  className = "",
  ...rest
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const config = { stiffness: 260, damping: 18, mass: 0.6 };
  const sx = useSpring(x, config);
  const sy = useSpring(y, config);

  const innerX = useTransform(sx, (v) => v * 0.45);
  const innerY = useTransform(sy, (v) => v * 0.45);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || disabled) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`magnetic ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      {...rest}
    >
      <motion.div className="magnetic-inner" style={{ x: innerX, y: innerY }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Drop-in leaning <button> — filter chips, copy buttons, close buttons. */
export function MagneticButton({
  children,
  className = "",
  wrapperClassName = "",
  strength = 0.24,
  disabled = false,
  ...rest
}) {
  return (
    <Magnetic strength={strength} disabled={disabled} className={wrapperClassName}>
      <button className={className} disabled={disabled} {...rest}>
        {children}
      </button>
    </Magnetic>
  );
}

export default Magnetic;

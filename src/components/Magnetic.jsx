import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "./Magnetic.css";

/**
 * Wraps any element so it sways toward the cursor and springs back on exit.
 * `strength` is the fraction of the cursor offset the element travels;
 * the inner content travels a little further, which reads as depth.
 *
 * Every button on the site goes through this — either directly, via
 * <MagneticButton>, or via <ActionButton> for the two hero-weight styles.
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

/**
 * Drop-in swaying <button>. Use for any control that isn't one of the two
 * primary ActionButton styles — filter chips, copy buttons, close buttons.
 */
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

/**
 * The site's primary control. `variant` switches between the filled green
 * signature button and the outlined companion; both share the arrow motion.
 */
export function ActionButton({
  as = "a",
  variant = "solid",
  children,
  className = "",
  icon = "fa-solid fa-arrow-right",
  ...rest
}) {
  const Tag = motion[as] || motion.a;

  return (
    <Magnetic>
      <Tag className={`action-btn action-btn--${variant} ${className}`} {...rest}>
        <span className="action-btn-fill" aria-hidden="true" />
        <span className="action-btn-label">
          <span className="action-btn-text">{children}</span>
          <span className="action-btn-icons" aria-hidden="true">
            <i className={icon} />
            <i className={icon} />
          </span>
        </span>
      </Tag>
    </Magnetic>
  );
}

export default Magnetic;

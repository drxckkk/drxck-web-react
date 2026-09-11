import { forwardRef } from "react";
import "./Emblem.css";

const DOTS = Array.from({ length: 9 }, (_, i) => i);

const Emblem = forwardRef(function Emblem({ className = "", size }, ref) {
  return (
    <div
      ref={ref}
      className={`emblem ${className}`}
      style={size ? { "--size": `${size}px` } : undefined}
      aria-hidden="true"
    >
      <span className="emblem-shadow" />
      <span className="emblem-body">
        <span className="emblem-grid">
          {DOTS.map((i) => (
            <span key={i} className={i === 4 ? "emblem-dot is-core" : "emblem-dot"} />
          ))}
        </span>
        <span className="emblem-light" />
      </span>
    </div>
  );
});

export default Emblem;

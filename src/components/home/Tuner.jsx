import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Radio } from "lucide-react";

const MIN = 1400;
const MAX = 1480;
const SIGNAL = 1440;
const LOCK = 1.2;
const BARS = 5;

function Tuner() {
  const id = useId();
  const [freq, setFreq] = useState(1413.6);

  const distance = Math.abs(freq - SIGNAL);
  const strength = Math.max(0, 1 - distance / 22);
  const locked = distance <= LOCK;
  const lit = locked ? BARS : Math.floor(strength * BARS);

  return (
    <article
      className={`card about-tuner ${locked ? "is-locked" : ""}`}
      data-reveal
      style={{
        "--reveal-delay": "60ms",
        "--noise": (1 - strength).toFixed(3),
        "--p": ((freq - MIN) / (MAX - MIN)).toFixed(4),
      }}
    >
      <p className="card-label">
        <Radio aria-hidden="true" strokeWidth={2} />
        Tune in
      </p>

      <div className="tuner-display" aria-hidden="true">
        <span className="tuner-static" />
        <span className="tuner-freq">
          {freq.toFixed(1)}
          <span className="tuner-unit">MHz</span>
        </span>
        <span className="tuner-bars">
          {Array.from({ length: BARS }, (_, i) => (
            <span key={i} className={i < lit ? "is-lit" : ""} />
          ))}
        </span>
      </div>

      <label className="sr-only" htmlFor={id}>
        Radio frequency
      </label>
      <input
        id={id}
        className="tuner-dial"
        type="range"
        min={MIN}
        max={MAX}
        step="0.2"
        value={freq}
        onChange={(e) => setFreq(Number(e.target.value))}
        aria-valuetext={`${freq.toFixed(1)} megahertz${locked ? ", signal found" : ""}`}
      />

      <p className="tuner-readout meta" aria-live="polite">
        {locked ? (
          <Link className="tuner-found" to="/work/scangame">
            Signal found. Open 1440 MHz
            <ArrowRight aria-hidden="true" strokeWidth={2.2} />
          </Link>
        ) : (
          <span>Just static. There's something around 1440…</span>
        )}
      </p>
    </article>
  );
}

export default Tuner;

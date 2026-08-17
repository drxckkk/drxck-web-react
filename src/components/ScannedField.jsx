import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { OBJECTS, buildMask, sampleMask } from "./scanObjects";
import "./ScannedField.css";

const TAU = Math.PI * 2;

/* the centre's rotation through the desk */
const CYCLE = ["keyboard", "mouse", "camera", "crt", "controller"];
const HOLD = 5.2;   // seconds an object stays legible
const MORPH = 2.2;  // seconds spent dissolving into the next one

/* the orbiting navigation — evenly spaced so they never bunch up */
const SATELLITES = [
  { id: "work", object: "keyboard", to: "/work", label: "Work", note: "development" },
  //{ id: "games", object: "controller", to: "/games", label: "Games", note: "play" },
  { id: "about", object: "camera", to: "/about", label: "About", note: "the person" },
];

function hash(a, b) {
  const n = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

const CORE_DOTS = 28;
const CORE_DOTS_SMALL = 22;
const CORE_SCALE = 0.5;
const SAT_SCALE = 0.19;
const SAT_DOTS = 22;
const SAT_DOTS_HOT = 32;

function ScannedField({ onObjectChange }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const linkRefs = useRef([]);

  /* hover/focus targets live in a ref so the 60fps loop never re-renders React */
  const hoverTarget = useRef(SATELLITES.map(() => 0));
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const media = (q) =>
      typeof window.matchMedia === "function" ? window.matchMedia(q).matches : false;
    const reduced = media("(prefers-reduced-motion: reduce)");
    const fine = media("(pointer: fine)");

    const masks = {};
    Object.keys(OBJECTS).forEach((key) => {
      masks[key] = buildMask(key);
    });

    let width = 0;
    let height = 0;
    let gap = 14;
    let ink = "#080808";
    let raf = 0;
    let running = false;
    const started = performance.now();

    const pointer = { x: 0, y: 0, active: false };
    const hoverEase = SATELLITES.map(() => 0);
    let lastReported = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) return;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* pitch follows the object so it reads at any size; the floor keeps a
         huge viewport from exploding the dot count */
      const objSize = Math.min(width, height) * CORE_SCALE;
      const target = width < 640 ? CORE_DOTS_SMALL : CORE_DOTS;
      gap = Math.max(6.5, objSize / target);

      ink = getComputedStyle(canvas).color || ink;
      draw(performance.now());
    };

    function draw(now) {
      if (!width || !height) return;
      const t = reduced ? 0 : (now - started) / 1000;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const minDim = Math.min(width, height);
      const base = gap * 0.34;

      /* --- which object, and how far through the dissolve --- */
      const span = HOLD + MORPH;
      const walked = t / span;
      const index = Math.floor(walked) % CYCLE.length;
      const phase = walked - Math.floor(walked);
      const holdFrac = HOLD / span;
      const blend = phase < holdFrac ? 0 : (phase - holdFrac) / (1 - holdFrac);
      const scatter = 4 * blend * (1 - blend); // peaks mid-dissolve

      const maskA = masks[CYCLE[index]];
      const maskB = masks[CYCLE[(index + 1) % CYCLE.length]];

      const showing = blend < 0.5 ? CYCLE[index] : CYCLE[(index + 1) % CYCLE.length];
      if (showing !== lastReported) {
        lastReported = showing;
        onObjectChange?.(OBJECTS[showing].label);
      }

      /* the core turns: foreshortening the x axis reads as a slow spin */
      const turn = 0.58 + 0.42 * Math.abs(Math.cos(t * 0.22));
      const objSize = minDim * CORE_SCALE;

      /* --- field + core, batched into one path --- */
      ctx.beginPath();
      ctx.fillStyle = ink;
      ctx.globalAlpha = 1;

      const cols = Math.ceil(width / gap) + 2;
      const rows = Math.ceil(height / gap) + 2;

      for (let c = 0; c < cols; c += 1) {
        for (let r = 0; r < rows; r += 1) {
          const x = c * gap - gap * 0.5;
          const y = r * gap - gap * 0.5;

          // concentric field
          const du = (x - cx) / minDim;
          const dv = (y - cy) / minDim;
          const dist = Math.hypot(du, dv);
          const ring = 0.5 + 0.5 * Math.sin(dist * 32 - t * 0.9);
          const fadeRaw = Math.max(0, Math.min(1, 1 - dist / 0.56));
          let amp = ring * fadeRaw * fadeRaw * (3 - 2 * fadeRaw) * 0.85;

          // the object being scanned
          const u = (x - cx) / objSize;
          const v = (y - cy) / objSize;
          if (u > -0.8 && u < 0.8 && v > -0.8 && v < 0.8) {
            let su = u / turn + Math.sin(v * 7 + t * 0.9) * 0.014;
            let sv = v + Math.cos(u * 6 + t * 0.7) * 0.011;

            if (scatter > 0.001) {
              su += (hash(c, r) - 0.5) * 0.16 * scatter;
              sv += (hash(r, c) - 0.5) * 0.16 * scatter;
            }

            const a = sampleMask(maskA, su, sv);
            const b = sampleMask(maskB, su, sv);
            const solid = a * (1 - blend) + b * blend;

            if (solid > 0.02) {
              // the field recedes where the object is, so it reads as figure
              amp = Math.max(amp * (1 - solid * 0.8), solid * 1.3);
            }
          }

          const radius = base * amp;
          if (radius > 0.18) {
            ctx.moveTo(x + radius, y);
            ctx.arc(x, y, radius, 0, TAU);
          }
        }
      }
      ctx.fill();

      /* --- orbiting navigation --- */
      const orbitRx = minDim * 0.42;
      const orbitRy = minDim * 0.19;
      const satSize = minDim * SAT_SCALE;

      SATELLITES.forEach((sat, i) => {
        const target = hoverTarget.current[i];
        hoverEase[i] += (target - hoverEase[i]) * (reduced ? 1 : 0.12);
        const hot = hoverEase[i];

        const angle = (i / SATELLITES.length) * TAU + (reduced ? 0 : t * 0.13);
        let ox = cx + Math.cos(angle) * orbitRx;
        let oy = cy + Math.sin(angle) * orbitRy;

        // hovering pulls the object toward the cursor
        if (hot > 0.001 && pointer.active) {
          ox += (pointer.x - ox) * 0.24 * hot;
          oy += (pointer.y - oy) * 0.24 * hot;
        }

        // the hit target rides along with it
        const link = linkRefs.current[i];
        if (link) link.style.transform = `translate(${ox}px, ${oy}px)`;

        /* a finer pitch than the field, finer still on hover — that increase in
           resolution is what "becoming clearer" actually is here */
        const localGap = satSize / (SAT_DOTS + (SAT_DOTS_HOT - SAT_DOTS) * hot);
        const localBase = localGap * 0.36;
        const steps = Math.ceil(satSize / localGap) + 2;
        const half = satSize / 2;

        /* each one turns on its own phase, so the orbit never looks rigid */
        const satTurn = 0.74 + 0.26 * Math.abs(Math.cos(t * 0.3 + i * 1.7));

        ctx.beginPath();
        ctx.globalAlpha = 0.4 + 0.6 * hot;

        for (let c = 0; c <= steps; c += 1) {
          for (let r = 0; r <= steps; r += 1) {
            const x = ox - half + c * localGap;
            const y = oy - half + r * localGap;
            const su = (x - ox) / satSize / satTurn;
            const sv = (y - oy) / satSize;
            const solid = sampleMask(masks[sat.object], su, sv);
            if (solid <= 0.02) continue;
            const radius = localBase * (0.55 + 0.75 * solid) * (0.85 + 0.25 * hot);
            if (radius > 0.18) {
              ctx.moveTo(x + radius, y);
              ctx.arc(x, y, radius, 0, TAU);
            }
          }
        }
        ctx.fill();
      });

      ctx.globalAlpha = 1;
    }

    const tick = (now) => {
      draw(now);
      if (running) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    resize();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => (entries.some((en) => en.isIntersecting) ? start() : stop()),
            { rootMargin: "120px" }
          )
        : null;

    if (io) io.observe(canvas);
    else start();

    if (fine && !reduced) {
      wrap.addEventListener("pointermove", onPointerMove, { passive: true });
      wrap.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      stop();
      ro?.disconnect();
      io?.disconnect();
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [onObjectChange]);

  const setHover = (index, value) => {
    hoverTarget.current[index] = value;
    setFocused(value ? index : (current) => (current === index ? null : current));
  };

  return (
    <div className="scanned" ref={wrapRef}>
      <canvas ref={canvasRef} className="scanned-canvas" aria-hidden="true" />

      <nav className="scanned-nav" aria-label="Explore">
        {SATELLITES.map((sat, i) => (
          <Link
            key={sat.id}
            to={sat.to}
            ref={(el) => {
              linkRefs.current[i] = el;
            }}
            className={`scanned-hotspot ${focused === i ? "is-hot" : ""}`}
            aria-label={`${sat.label} — ${sat.note}`}
            onPointerEnter={() => setHover(i, 1)}
            onPointerLeave={() => setHover(i, 0)}
            onFocus={() => setHover(i, 1)}
            onBlur={() => setHover(i, 0)}
          >
            <span className="scanned-hotspot-label">{sat.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default ScannedField;

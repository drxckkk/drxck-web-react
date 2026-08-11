import { useEffect, useRef } from "react";
import "./DotField.css";

/**
 * The site's signature layer: a fixed grid of dots that ignites green around
 * the pointer and drifts as you scroll.
 *
 * Perf notes — this runs behind every section, so it is built to stay cheap:
 *  - dots outside the cursor radius are drawn as ONE path with one fillStyle,
 *    so a full-screen grid costs a single fill call
 *  - only the few hundred dots inside the radius get individual styling
 *  - the RAF loop parks itself once the pointer settles and restarts on input
 */

/* kept in sync by hand with --line / --green in App.css; the canvas can't
   read custom properties without a getComputedStyle call per frame */
const DOT_COLOR = "rgba(255, 255, 255, 0.15)";
const HOT_RGB = "0, 232, 92";

const SPACING = 26;      // px between dots
const RADIUS = 190;      // cursor influence radius
const DOT_MIN = 1.1;     // resting dot radius
const DOT_MAX = 3.4;     // radius at the cursor's centre
const PUSH = 7;          // px each dot recoils away from the cursor
const PARALLAX = 0.14;   // how much the grid drifts against scroll
const LERP = 0.14;       // pointer smoothing
const SETTLE = 0.05;     // below this delta the loop parks itself

function DotField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const interactive = fine && !reduced;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let running = false;

    // target pointer (raw) and rendered pointer (smoothed)
    const target = { x: -9999, y: -9999, on: 0 };
    const eased = { x: -9999, y: -9999, on: 0 };
    let scrollOffset = 0;
    let easedScroll = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // the grid slides with scroll, wrapping so it never runs out of dots
      const drift = easedScroll % SPACING;
      const cols = Math.ceil(width / SPACING) + 2;
      const rows = Math.ceil(height / SPACING) + 2;

      const px = eased.x;
      const py = eased.y;
      const lit = eased.on > 0.01;

      // pass 1 — every resting dot in a single path
      ctx.beginPath();
      ctx.fillStyle = DOT_COLOR;

      // pass 2 is collected here so we only style the handful near the cursor
      const hot = [];

      for (let c = 0; c < cols; c += 1) {
        const x = c * SPACING - SPACING;
        const dx = x - px;
        if (lit && (dx > RADIUS || dx < -RADIUS)) {
          // this whole column is out of range — draw it flat and move on
          for (let r = 0; r < rows; r += 1) {
            const y = r * SPACING - SPACING + drift;
            ctx.moveTo(x + DOT_MIN, y);
            ctx.arc(x, y, DOT_MIN, 0, Math.PI * 2);
          }
          continue;
        }

        for (let r = 0; r < rows; r += 1) {
          const y = r * SPACING - SPACING + drift;

          if (!lit) {
            ctx.moveTo(x + DOT_MIN, y);
            ctx.arc(x, y, DOT_MIN, 0, Math.PI * 2);
            continue;
          }

          const dy = y - py;
          const distSq = dx * dx + dy * dy;

          if (distSq > RADIUS * RADIUS) {
            ctx.moveTo(x + DOT_MIN, y);
            ctx.arc(x, y, DOT_MIN, 0, Math.PI * 2);
            continue;
          }

          const dist = Math.sqrt(distSq) || 0.0001;
          // smoothstep so the falloff has no hard edge
          const raw = 1 - dist / RADIUS;
          const t = raw * raw * (3 - 2 * raw) * eased.on;
          const nx = dx / dist;
          const ny = dy / dist;

          hot.push({
            x: x + nx * PUSH * t,
            y: y + ny * PUSH * t,
            radius: DOT_MIN + (DOT_MAX - DOT_MIN) * t,
            t,
          });
        }
      }

      ctx.fill();

      // pass 2 — the lit dots, warmest at the centre
      for (let i = 0; i < hot.length; i += 1) {
        const d = hot[i];
        ctx.beginPath();
        ctx.fillStyle = `rgba(${HOT_RGB}, ${(0.18 + 0.82 * d.t).toFixed(3)})`;
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      const dx = target.x - eased.x;
      const dy = target.y - eased.y;
      const don = target.on - eased.on;
      const dScroll = scrollOffset - easedScroll;

      eased.x += dx * LERP;
      eased.y += dy * LERP;
      eased.on += don * LERP;
      easedScroll += dScroll * LERP;

      draw();

      const settled =
        Math.abs(dx) < SETTLE &&
        Math.abs(dy) < SETTLE &&
        Math.abs(don) < 0.002 &&
        Math.abs(dScroll) < SETTLE;

      if (settled) {
        running = false;
        // snap to target so the next wake-up starts clean
        eased.x = target.x;
        eased.y = target.y;
        eased.on = target.on;
        easedScroll = scrollOffset;
        draw();
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      target.on = 1;
      wake();
    };

    const onPointerLeave = () => {
      target.on = 0;
      wake();
    };

    const onScroll = () => {
      scrollOffset = -window.scrollY * PARALLAX;
      wake();
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
      window.addEventListener("blur", onPointerLeave);
    }
    if (!reduced) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="dot-field" aria-hidden="true" />;
}

export default DotField;

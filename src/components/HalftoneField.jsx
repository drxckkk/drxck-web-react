import { useEffect, useRef } from "react";
import "./HalftoneField.css";

/**
 * The site's reusable halftone visual system.
 *
 * One canvas, one fill call. Because the artwork is monochrome, every dot in a
 * frame can be batched into a single path and filled once — which is what keeps
 * a 4000-dot field cheap. Nothing here creates DOM nodes per dot.
 *
 * Variants:
 *   radial       concentric rings radiating from a centre, fading outward
 *   wave         a distorted dot wave, phase-shifted along both axes
 *   orbital      polar rings of dots, each spinning at its own rate
 *   perspective  a dot plane receding to a horizon
 *   blob         organic point cloud driven by drifting metaball centres
 *   field        gentle undulating grid, the quietest of the set
 *
 * The loop parks itself when the canvas scrolls out of view, and collapses to a
 * single static frame under prefers-reduced-motion.
 */

const TAU = Math.PI * 2;
const MAX_DOTS = 7000;

/** dot amplitude (0..1) for the grid-based variants */
function amplitude(variant, u, v, t) {
  switch (variant) {
    case "wave": {
      return 0.5 + 0.5 * Math.sin(u * 9 + Math.sin(v * 5 + t * 0.5) * 1.8 + t * 0.7);
    }
    case "radial": {
      const d = Math.hypot(u, v);
      const ring = 0.5 + 0.5 * Math.sin(d * 34 - t * 1.05);
      const fade = Math.max(0, Math.min(1, 1 - d / 0.55));
      return ring * fade * fade * (3 - 2 * fade);
    }
    case "blob": {
      let f = 0;
      for (let i = 0; i < 3; i += 1) {
        const a = t * 0.22 + i * 2.2;
        const bx = Math.cos(a * (1 + i * 0.3)) * 0.19;
        const by = Math.sin(a * (1.3 - i * 0.2)) * 0.17;
        const d = Math.hypot(u - bx, v - by);
        f += Math.exp(-(d * d) / 0.017);
      }
      return Math.max(0, Math.min(1, f * 0.8));
    }
    case "field":
    default: {
      return 0.5 + 0.5 * Math.sin(u * 7 + t * 0.25) * Math.cos(v * 7 - t * 0.2);
    }
  }
}

function HalftoneField({
  variant = "field",
  density = 22,
  dotScale = 1,
  speed = 1,
  intensity = 1,
  interactive = false,
  /** fraction of the min dimension drawn as a solid centre disc (0 = none) */
  focal = 0,
  className = "",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const media = (q) =>
      typeof window.matchMedia === "function" ? window.matchMedia(q).matches : false;
    const reduced = media("(prefers-reduced-motion: reduce)");
    const fine = media("(pointer: fine)");
    const pointerOn = interactive && fine && !reduced;

    let width = 0;
    let height = 0;
    let gap = density;
    let ink = "#080808";
    let raf = 0;
    let running = false;
    let onScreen = true;
    const started = performance.now();

    /* pointer in -0.5..0.5 element space, smoothed toward the raw target */
    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) return;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* coarser grid on small screens so phones draw far fewer dots */
      const relief = width < 640 ? 1.55 : width < 1024 ? 1.25 : 1;
      gap = density * relief;

      ink = getComputedStyle(canvas).color || ink;
      draw(performance.now());
    };

    const plot = (x, y, radius) => {
      if (radius < 0.18) return 0;
      ctx.moveTo(x + radius, y);
      ctx.arc(x, y, radius, 0, TAU);
      return 1;
    };

    function draw(now) {
      if (!width || !height) return;
      const t = reduced ? 0 : ((now - started) / 1000) * speed;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = ink;

      const cx = width / 2;
      const cy = height / 2;
      const minDim = Math.min(width, height);
      const base = gap * 0.34 * dotScale;

      /* whole-field parallax: the composition leans, it never chases */
      ctx.save();
      ctx.translate(eased.x * 14, eased.y * 14);

      ctx.beginPath();
      let drawn = 0;

      if (variant === "orbital") {
        const rings = Math.max(4, Math.round(minDim * 0.46 / gap));
        for (let i = 1; i <= rings && drawn < MAX_DOTS; i += 1) {
          const rr = (i / rings) * minDim * 0.46;
          const count = Math.max(6, Math.round((TAU * rr) / gap));
          const dir = i % 2 ? 1 : -1;
          const spin = t * 0.11 * dir * (1 + (i % 3) * 0.4);
          for (let k = 0; k < count && drawn < MAX_DOTS; k += 1) {
            const a = (k / count) * TAU + spin;
            const amp = 0.45 + 0.55 * Math.sin(a * 3 + t * 0.6 + i);
            drawn += plot(
              cx + Math.cos(a) * rr,
              cy + Math.sin(a) * rr,
              base * (0.35 + amp * 0.65) * intensity
            );
          }
        }
      } else if (variant === "perspective") {
        const horizon = height * 0.3;
        const rows = 44;
        for (let i = 1; i <= rows && drawn < MAX_DOTS; i += 1) {
          const z = i / rows;
          const depth = Math.pow(z, 2.4);
          const y = horizon + (height - horizon) * depth;
          const spread = 0.25 + z * 2.1;
          const step = gap * spread;
          const cols = Math.ceil(width / step) + 2;
          for (let c = 0; c < cols && drawn < MAX_DOTS; c += 1) {
            const x = c * step - step + ((t * 12 * spread) % step);
            const sway = Math.sin(z * 8 + t * 0.5) * 6 * z;
            drawn += plot(x + sway, y, base * spread * 0.55 * intensity);
          }
        }
      } else {
        const cols = Math.ceil(width / gap) + 2;
        const rowCount = Math.ceil(height / gap) + 2;
        const px = cx + eased.x * width * 0.5;
        const py = cy + eased.y * height * 0.5;
        const reach = minDim * 0.22;

        for (let c = 0; c < cols && drawn < MAX_DOTS; c += 1) {
          for (let r = 0; r < rowCount && drawn < MAX_DOTS; r += 1) {
            let x = c * gap - gap * 0.5;
            let y = r * gap - gap * 0.5;
            const u = (x - cx) / minDim;
            const v = (y - cy) / minDim;
            let amp = amplitude(variant, u, v, t) * intensity;

            /* dots near the pointer swell and step aside a little */
            if (pointerOn) {
              const dx = x - px;
              const dy = y - py;
              const d = Math.hypot(dx, dy);
              if (d < reach && d > 0.001) {
                const k = 1 - d / reach;
                const push = k * k;
                amp += push * 0.45;
                x += (dx / d) * push * 7;
                y += (dy / d) * push * 7;
              }
            }

            drawn += plot(x, y, base * Math.max(0, Math.min(1.4, amp)));
          }
        }
      }

      ctx.fill();

      if (focal > 0) {
        /* the centre object breathes — a couple of percent, no more */
        const pulse = reduced ? 1 : 1 + Math.sin(t * 0.55) * 0.022;
        ctx.beginPath();
        ctx.arc(cx, cy, minDim * focal * pulse, 0, TAU);
        ctx.fill();
      }

      ctx.restore();
    }

    const tick = (now) => {
      eased.x += (target.x - eased.x) * 0.06;
      eased.y += (target.y - eased.y) * 0.06;
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
      if (!rect.width || !rect.height) return;
      target.x = (e.clientX - rect.left) / rect.width - 0.5;
      target.y = (e.clientY - rect.top) / rect.height - 0.5;
    };

    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    resize();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);

    /* never animate a field that isn't on screen */
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              onScreen = entries.some((entry) => entry.isIntersecting);
              if (onScreen) start();
              else stop();
            },
            { rootMargin: "120px" }
          )
        : null;

    if (io) io.observe(canvas);
    else start();

    if (pointerOn) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
      window.addEventListener("blur", onPointerLeave);
    }

    return () => {
      stop();
      ro?.disconnect();
      io?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
    };
  }, [variant, density, dotScale, speed, intensity, interactive, focal]);

  return (
    <canvas
      ref={ref}
      className={`halftone halftone--${variant} ${className}`}
      data-variant={variant}
      aria-hidden="true"
    />
  );
}

export default HalftoneField;

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DEV_H,
  DEV_W,
  MASK_SCALE,
  SCREEN,
  SCREEN_SCALE,
  WHEEL,
  buildDeviceMask,
  paintScreen,
  sampleScreen,
} from "./ipodArt";
import "./IpodField.css";

/**
 * The hero's centrepiece: a halftone field with a music player reconstructed
 * out of the same dots.
 *
 * Everything is one Canvas 2D surface. The device is not a sprite drawn over
 * the field — it is a luminance lookup that the dot grid samples, so a dark
 * region simply grows its dots. That is what keeps it inside the artwork
 * rather than on top of it.
 *
 * Interaction lives in a thin DOM overlay (menu links, wheel, centre button)
 * so the whole thing stays keyboard reachable; the canvas is decorative and
 * never handles a click itself.
 */

const TAU = Math.PI * 2;

/* only routes that exist — the brief's LAB has no page, so it is omitted
   rather than shipping a dead menu row */
const MENU = [
  { label: "WORK", to: "/work" },
  { label: "GAMES", to: "/games" },
  { label: "ABOUT", to: "/about" },
];

const DEVICE_DOTS = 44;      // dots across the body; verified legible in preview
const SCREEN_PITCH = 0.55;   // screen dot pitch relative to the body's
const PARTICLES = 40;
const BURST_MS = 420;

function IpodField() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const uiRef = useRef(null);
  const navigate = useNavigate();

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [awake, setAwake] = useState(false);

  /* live values the animation loop owns — never React state, never a re-render */
  const pointer = useRef({ x: 0, y: 0, has: false });
  const hoverRef = useRef(0);
  const burstRef = useRef(0);
  const screenRef = useRef(null);

  const setSelection = useCallback((index) => {
    const next = ((index % MENU.length) + MENU.length) % MENU.length;
    activeRef.current = next;
    setActive(next);
  }, []);

  const launch = useCallback(
    (to) => {
      const reduced =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        navigate(to);
        return;
      }
      burstRef.current = 0.0001; // the loop takes it from here
      window.setTimeout(() => navigate(to), BURST_MS - 40);
    },
    [navigate]
  );

  /* ---------------- screen bitmap ---------------- */

  useEffect(() => {
    if (typeof document === "undefined") return;
    const canvas = document.createElement("canvas");
    canvas.width = SCREEN.w * SCREEN_SCALE;
    canvas.height = SCREEN.h * SCREEN_SCALE;
    const ctx = canvas.getContext("2d");
    if (!ctx || typeof ctx.getImageData !== "function") return;
    screenRef.current = { canvas, ctx, data: null };
  }, []);

  /* ---------------- the loop ---------------- */

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
    const interactive = fine && !reduced;

    const device = buildDeviceMask();
    const screen = screenRef.current;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    const started = performance.now();

    const eased = { x: 0, y: 0 };
    let hover = 0;
    let screenClock = -1;

    /* particles are allocated once and only ever mutated */
    const parts = new Float32Array(PARTICLES * 4); // angle, radius, speed, phase
    for (let i = 0; i < PARTICLES; i += 1) {
      parts[i * 4] = Math.random() * TAU;
      parts[i * 4 + 1] = 0.55 + Math.random() * 0.75;
      parts[i * 4 + 2] = (0.05 + Math.random() * 0.13) * (Math.random() < 0.5 ? -1 : 1);
      parts[i * 4 + 3] = Math.random() * TAU;
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) return;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };

    /* the device box, in canvas pixels */
    const layout = () => {
      const short = Math.min(width, height);
      const devH = Math.min(height * 0.72, short * 0.86);
      const devW = (devH / DEV_H) * DEV_W;
      return { devW, devH, scale: devH / DEV_H };
    };

    function draw(now) {
      if (!width || !height) return;
      const t = reduced ? 0 : (now - started) / 1000;

      // ease the live inputs
      const targetHover = hoverRef.current;
      hover += (targetHover - hover) * (reduced ? 1 : 0.09);
      if (pointer.current.has && interactive) {
        eased.x += (pointer.current.x - eased.x) * 0.06;
        eased.y += (pointer.current.y - eased.y) * 0.06;
      } else {
        eased.x += (0 - eased.x) * 0.06;
        eased.y += (0 - eased.y) * 0.06;
      }

      let burst = burstRef.current;
      if (burst > 0) {
        burst = Math.min(1, burst + 0.055);
        burstRef.current = burst >= 1 ? 0 : burst;
      }
      const blast = burst > 0 ? Math.sin(burst * Math.PI) : 0;

      const cx = width / 2;
      const cy = height / 2;
      const { devW, devH, scale } = layout();

      // idle float + a lean toward the pointer, both tiny
      const floatY = reduced ? 0 : Math.sin(t * 0.5) * devH * 0.012;
      const devCx = cx + eased.x * 16;
      const devCy = cy + eased.y * 12 + floatY;
      const angle = (reduced ? 0 : Math.sin(t * 0.31) * 0.018) + eased.x * 0.05;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const turn = 1 - Math.abs(eased.x) * 0.05;

      const gap = devW / DEVICE_DOTS;
      const base = gap * 0.5;
      const ink = getComputedStyle(canvas).color || "#080808";
      const paper =
        getComputedStyle(canvas).getPropertyValue("background-color") || "#f4f4f1";

      ctx.clearRect(0, 0, width, height);

      /* canvas point -> device units; returns false when far outside */
      const halfW = DEV_W / 2;
      const halfH = DEV_H / 2;
      const toDevice = (x, y, out) => {
        const dx = x - devCx;
        const dy = y - devCy;
        const rx = dx * cosA + dy * sinA;
        const ry = -dx * sinA + dy * cosA;
        out[0] = rx / scale / turn + halfW;
        out[1] = ry / scale + halfH;
        return out[0] > -26 && out[0] < DEV_W + 26 && out[1] > -26 && out[1] < DEV_H + 26;
      };

      const probe = [0, 0];
      const maskAt = (ux, uy) => {
        if (!device) return -1;
        const mx = (ux * MASK_SCALE) | 0;
        const my = (uy * MASK_SCALE) | 0;
        if (mx < 0 || my < 0 || mx >= device.w || my >= device.h) return -1;
        return my * device.w + mx;
      };

      /* ---------- 1. the field ---------- */
      ctx.beginPath();
      ctx.fillStyle = ink;
      ctx.globalAlpha = 1;

      const fieldGap = gap * 1.28;
      const cols = Math.ceil(width / fieldGap) + 2;
      const rows = Math.ceil(height / fieldGap) + 2;
      const fieldBase = fieldGap * 0.34;
      const reach = Math.min(width, height);

      for (let c = 0; c < cols; c += 1) {
        for (let r = 0; r < rows; r += 1) {
          let x = c * fieldGap - fieldGap * 0.5;
          let y = r * fieldGap - fieldGap * 0.5;

          // skip anything the body itself will cover
          if (device && toDevice(x, y, probe)) {
            const i = maskAt(probe[0], probe[1]);
            if (i >= 0 && device.inside[i]) continue;
          }

          const du = (x - devCx) / reach;
          const dv = (y - devCy) / reach;
          const dist = Math.hypot(du, dv);

          const ring = 0.5 + 0.5 * Math.sin(dist * 30 - t * 0.75);
          const fade = Math.max(0, Math.min(1, 1 - dist / 0.62));
          let amp = ring * fade * fade * (3 - 2 * fade) * 0.9;

          // the field thickens as it nears the object, and thickens more on hover
          const pull = Math.max(0, 1 - dist / 0.34);
          amp += pull * pull * (0.22 + 0.3 * hover);

          if (blast > 0) {
            // dots shove outward, then settle
            const push = blast * 46 * Math.max(0, 1 - dist / 0.8);
            const len = Math.hypot(x - devCx, y - devCy) || 1;
            x += ((x - devCx) / len) * push;
            y += ((y - devCy) / len) * push;
          }

          const radius = fieldBase * amp;
          if (radius > 0.18) {
            ctx.moveTo(x + radius, y);
            ctx.arc(x, y, radius, 0, TAU);
          }
        }
      }
      ctx.fill();

      /* ---------- 2. orbital rings ---------- */
      ctx.beginPath();
      ctx.globalAlpha = 0.5 + 0.2 * hover;
      for (let ring = 0; ring < 2; ring += 1) {
        const rx = devW * (0.86 + ring * 0.34) * (1 + blast * 0.14);
        const ry = rx * (ring === 0 ? 0.36 : 0.24);
        const spin = reduced ? 0 : t * (ring === 0 ? 0.07 : -0.05);
        const count = 54 + ring * 22;
        for (let k = 0; k < count; k += 1) {
          const a = (k / count) * TAU + spin;
          const x = devCx + Math.cos(a) * rx;
          const y = devCy + Math.sin(a) * ry;
          if (x < -20 || x > width + 20 || y < -20 || y > height + 20) continue;
          const rr = fieldBase * 0.5;
          ctx.moveTo(x + rr, y);
          ctx.arc(x, y, rr, 0, TAU);
        }
      }
      ctx.fill();

      /* ---------- 3. drifting particles ---------- */
      ctx.beginPath();
      ctx.globalAlpha = 0.42 + 0.35 * hover;
      for (let i = 0; i < PARTICLES; i += 1) {
        const a = parts[i * 4] + (reduced ? 0 : t * parts[i * 4 + 2]);
        // hovering draws them in toward the device
        const rad = parts[i * 4 + 1] * (1 - hover * 0.22) + blast * 0.5;
        const wobble = reduced ? 0 : Math.sin(t * 0.7 + parts[i * 4 + 3]) * 0.045;
        const x = devCx + Math.cos(a) * devW * (rad + wobble);
        const y = devCy + Math.sin(a) * devH * (rad + wobble) * 0.5;
        const rr = fieldBase * (0.4 + 0.5 * Math.abs(Math.sin(parts[i * 4 + 3] + t)));
        if (rr > 0.18) {
          ctx.moveTo(x + rr, y);
          ctx.arc(x, y, rr, 0, TAU);
        }
      }
      ctx.fill();

      if (!device) {
        ctx.globalAlpha = 1;
        return;
      }

      /* ---------- 4. the body ---------- */
      const span = Math.max(devW, devH) * 0.78;
      const x0 = devCx - span;
      const x1 = devCx + span;
      const y0 = devCy - span;
      const y1 = devCy + span;

      ctx.beginPath();
      ctx.globalAlpha = 1;

      for (let x = x0; x <= x1; x += gap) {
        for (let y = y0; y <= y1; y += gap) {
          if (!toDevice(x, y, probe)) continue;
          const ux = probe[0];
          const uy = probe[1];

          // the screen is drawn separately, at a finer pitch
          if (
            ux > SCREEN.x && ux < SCREEN.x + SCREEN.w &&
            uy > SCREEN.y && uy < SCREEN.y + SCREEN.h
          ) continue;

          const i = maskAt(ux, uy);
          if (i < 0) continue;

          let px = x;
          let py = y;
          let k;

          if (device.inside[i]) {
            const lum = device.lum[i] / 255;
            // dark regions grow, bright regions shrink — plain halftone
            k = 0.16 + 0.84 * (1 - lum);
            // a whisper of shading down the body so it is not perfectly flat
            k *= 0.94 + 0.12 * (1 - uy / DEV_H);
          } else {
            // outside: the silhouette dissolves into loose particles
            const d = device.dist[i] / MASK_SCALE;
            const falloff = Math.max(0, 1 - d / 13);
            if (falloff <= 0.02) continue;
            k = falloff * falloff * (0.5 + 0.35 * hover);
            const jit = (1 - falloff) * gap * 1.1;
            px += Math.sin(x * 0.7 + y * 1.3) * jit;
            py += Math.cos(x * 1.1 - y * 0.6) * jit;
          }

          if (blast > 0) {
            const len = Math.hypot(px - devCx, py - devCy) || 1;
            px += ((px - devCx) / len) * blast * 20;
            py += ((py - devCy) / len) * blast * 20;
          }

          // hovering resolves the object a little more crisply
          const radius = base * k * (0.9 + 0.14 * hover);
          if (radius > 0.18) {
            ctx.moveTo(px + radius, py);
            ctx.arc(px, py, radius, 0, TAU);
          }
        }
      }
      ctx.fill();

      /* ---------- 5. the screen ---------- */
      if (screen) {
        const wake = 0.35 + 0.65 * hover;
        const clock = Math.floor(t * 8);
        if (clock !== screenClock) {
          screenClock = clock;
          paintScreen(screen.ctx, {
            mode: hover > 0.35 ? "menu" : "idle",
            items: MENU,
            active: activeRef.current,
            t,
          });
          screen.data = screen.ctx.getImageData(
            0,
            0,
            screen.canvas.width,
            screen.canvas.height
          ).data;
        }

        const sGap = gap * SCREEN_PITCH;
        const sBase = sGap * 0.5;
        const steps = Math.ceil(SCREEN.w / (sGap / scale));

        // dark screen bed
        ctx.beginPath();
        ctx.globalAlpha = 1;
        const lit = [];

        for (let sx = 0; sx <= steps; sx += 1) {
          for (let sy = 0; sy <= Math.ceil(steps * (SCREEN.h / SCREEN.w)); sy += 1) {
            const u = sx / steps;
            const v = sy / Math.ceil(steps * (SCREEN.h / SCREEN.w));
            const ux = SCREEN.x + u * SCREEN.w;
            const uy = SCREEN.y + v * SCREEN.h;

            // device units -> canvas
            const lx = (ux - halfW) * scale * turn;
            const ly = (uy - halfH) * scale;
            let px = devCx + lx * cosA - ly * sinA;
            let py = devCy + lx * sinA + ly * cosA;

            if (blast > 0) {
              const len = Math.hypot(px - devCx, py - devCy) || 1;
              px += ((px - devCx) / len) * blast * 20;
              py += ((py - devCy) / len) * blast * 20;
            }

            const on =
              sampleScreen(screen.data, screen.canvas.width, screen.canvas.height, u, v) > 0.45;

            if (on) {
              lit.push(px, py);
            } else {
              const rr = sBase * 0.86;
              ctx.moveTo(px + rr, py);
              ctx.arc(px, py, rr, 0, TAU);
            }
          }
        }
        ctx.fill();

        // lit pixels knock back out in paper, which is what makes it a display
        ctx.beginPath();
        ctx.fillStyle = paper;
        ctx.globalAlpha = wake;
        for (let i = 0; i < lit.length; i += 2) {
          const rr = sBase * 0.92;
          ctx.moveTo(lit[i] + rr, lit[i + 1]);
          ctx.arc(lit[i], lit[i + 1], rr, 0, TAU);
        }
        ctx.fill();
        ctx.fillStyle = ink;
      }

      /* ---------- 6. wheel activity ---------- */
      if (hover > 0.02) {
        ctx.beginPath();
        ctx.globalAlpha = hover * 0.9;
        const wr = WHEEL.r * scale * (1 + blast * 0.3);
        const wx = devCx + (WHEEL.x - halfW) * scale * turn * cosA - (WHEEL.y - halfH) * scale * sinA;
        const wy = devCy + (WHEEL.x - halfW) * scale * turn * sinA + (WHEEL.y - halfH) * scale * cosA;
        const count = 30;
        for (let k = 0; k < count; k += 1) {
          const a = (k / count) * TAU + (reduced ? 0 : t * 0.5);
          const trail = (Math.sin(a * 3 - t * 2) + 1) / 2;
          const rr = base * 0.34 * (0.35 + trail);
          if (rr <= 0.18) continue;
          const x = wx + Math.cos(a) * wr * 0.78;
          const y = wy + Math.sin(a) * wr * 0.78;
          ctx.moveTo(x + rr, y);
          ctx.arc(x, y, rr, 0, TAU);
        }
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      /* keep the interaction overlay sitting exactly on the device */
      const ui = uiRef.current;
      if (ui) {
        ui.style.width = `${devW}px`;
        ui.style.height = `${devH}px`;
        ui.style.transform = `translate(${devCx - devW / 2}px, ${devCy - devH / 2}px)`;
      }
    }

    const tick = (now) => {
      draw(now);
      if (running) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.current.x = (e.clientX - rect.left) / rect.width - 0.5;
      pointer.current.y = (e.clientY - rect.top) / rect.height - 0.5;
      pointer.current.has = true;
    };
    const onLeave = () => {
      pointer.current.has = false;
    };

    resize();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => (entries.some((en) => en.isIntersecting) ? start() : stop()),
            { rootMargin: "160px" }
          )
        : null;
    if (io) io.observe(canvas);
    else start();

    if (interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      ro?.disconnect();
      io?.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* ---------------- click wheel ---------------- */

  const wheelAngle = useRef(null);
  const scrub = useRef(0);

  const onWheelMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const a = Math.atan2(
      e.clientY - (rect.top + rect.height / 2),
      e.clientX - (rect.left + rect.width / 2)
    );

    if (wheelAngle.current !== null) {
      let d = a - wheelAngle.current;
      while (d > Math.PI) d -= TAU;
      while (d < -Math.PI) d += TAU;
      scrub.current += d;

      // a notch every ~40 degrees, like a detented wheel
      const NOTCH = 0.7;
      while (Math.abs(scrub.current) >= NOTCH) {
        const dir = Math.sign(scrub.current);
        scrub.current -= dir * NOTCH;
        setSelection(activeRef.current + dir);
      }
    }
    wheelAngle.current = a;
  };

  const wake = (on) => {
    hoverRef.current = on ? 1 : 0;
    setAwake(on);
    if (!on) wheelAngle.current = null;
  };

  return (
    <div
      className="ipod"
      ref={wrapRef}
      onPointerEnter={() => wake(true)}
      onPointerLeave={() => wake(false)}
    >
      <canvas ref={canvasRef} className="ipod-canvas" aria-hidden="true" />

      <div className={`ipod-ui ${awake ? "is-awake" : ""}`} ref={uiRef}>
        <nav className="ipod-menu" aria-label="Player menu">
          {MENU.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              className={`ipod-row ${active === i ? "is-active" : ""}`}
              aria-label={`${item.label} — open`}
              onPointerEnter={() => setSelection(i)}
              onFocus={() => {
                setSelection(i);
                hoverRef.current = 1;
                setAwake(true);
              }}
              onBlur={() => {
                hoverRef.current = 0;
                setAwake(false);
              }}
              onClick={(e) => {
                e.preventDefault();
                launch(item.to);
              }}
            >
              <span className="visually-hidden">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div
          className="ipod-wheel"
          onPointerMove={onWheelMove}
          onPointerLeave={() => {
            wheelAngle.current = null;
          }}
          aria-hidden="true"
        />

        <button
          type="button"
          className="ipod-select"
          onClick={() => launch(MENU[activeRef.current].to)}
          onFocus={() => {
            hoverRef.current = 1;
            setAwake(true);
          }}
          onBlur={() => {
            hoverRef.current = 0;
            setAwake(false);
          }}
        >
          <span className="visually-hidden">
            Open {MENU[active].label}
          </span>
        </button>
      </div>
    </div>
  );
}

export default IpodField;

/* ---------------------------------------------------------------------------
 * The device, described as flat geometry with tones rather than drawing code.
 *
 * Both the canvas renderer below and the offline preview script consume this
 * same DEVICE list, so what gets verified is what ships.
 *
 * Authored in a 100 x 168 box (roughly a classic player's proportions).
 * Painter's order: later primitives cover earlier ones.
 * ------------------------------------------------------------------------- */

export const DEV_W = 100;
export const DEV_H = 168;
export const MASK_SCALE = 2;

/* the only tones in play — the palette, nothing else */
const WHITE = "#ffffff";
const LIGHT = "#dcdcd8";
const GREY = "#a8a8a3";
const DARK = "#444444";
const INK = "#080808";

/* screen rectangle, reused by the screen renderer and the overlay geometry */
export const SCREEN = { x: 11, y: 13, w: 78, h: 60, r: 3 };
export const WHEEL = { x: 50, y: 122, r: 30 };
export const BUTTON = { x: 50, y: 122, r: 11.5 };

export const DEVICE = [
  // body
  { t: "rrect", x: 2, y: 2, w: 96, h: 164, r: 13, fill: WHITE },
  { t: "rrect", x: 2, y: 2, w: 96, h: 164, r: 13, stroke: INK, lw: 3 },

  // screen well
  { t: "rrect", ...SCREEN, fill: DARK },
  { t: "rrect", ...SCREEN, stroke: INK, lw: 2.4 },

  // click wheel
  { t: "circle", x: WHEEL.x, y: WHEEL.y, r: WHEEL.r, fill: LIGHT },
  { t: "circle", x: WHEEL.x, y: WHEEL.y, r: WHEEL.r, stroke: INK, lw: 2.4 },

  // the four wheel marks, kept as plain blocks rather than any real iconography
  { t: "rrect", x: 45, y: 100, w: 10, h: 3, r: 1.5, fill: GREY },
  { t: "rrect", x: 45, y: 141, w: 10, h: 3, r: 1.5, fill: GREY },
  { t: "rrect", x: 25.5, y: 120.5, w: 8, h: 3, r: 1.5, fill: GREY },
  { t: "rrect", x: 66.5, y: 120.5, w: 8, h: 3, r: 1.5, fill: GREY },

  // centre button
  { t: "circle", x: BUTTON.x, y: BUTTON.y, r: BUTTON.r, fill: WHITE },
  { t: "circle", x: BUTTON.x, y: BUTTON.y, r: BUTTON.r, stroke: INK, lw: 2.4 },
];

/* ---------------- canvas rendering ---------------- */

function roundedPath(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export function paintDevice(ctx, primitives = DEVICE) {
  primitives.forEach((p) => {
    if (p.t === "rrect") roundedPath(ctx, p.x, p.y, p.w, p.h, p.r);
    else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    }

    if (p.fill) {
      ctx.fillStyle = p.fill;
      ctx.fill();
    }
    if (p.stroke) {
      ctx.strokeStyle = p.stroke;
      ctx.lineWidth = p.lw || 2;
      ctx.stroke();
    }
  });
}

/**
 * Rasterises the device once into three lookup tables:
 *   lum     0..255 brightness, which drives dot size (dark = big dot)
 *   inside  1 where the body covers the pixel
 *   dist    distance in mask pixels from the silhouette, for the halo and for
 *           the field's density falloff around the object
 *
 * Returns null without a 2D context (jsdom), which callers treat as
 * "draw the plain field instead".
 */
export function buildDeviceMask() {
  if (typeof document === "undefined") return null;

  const w = DEV_W * MASK_SCALE;
  const h = DEV_H * MASK_SCALE;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx || typeof ctx.getImageData !== "function") return null;

  ctx.scale(MASK_SCALE, MASK_SCALE);
  ctx.lineJoin = "round";
  paintDevice(ctx);

  let image;
  try {
    image = ctx.getImageData(0, 0, w, h);
  } catch {
    return null;
  }

  const count = w * h;
  const lum = new Uint8Array(count);
  const inside = new Uint8Array(count);
  const dist = new Float32Array(count);
  const INF = 1e9;

  for (let i = 0; i < count; i += 1) {
    const a = image.data[i * 4 + 3];
    if (a > 40) {
      inside[i] = 1;
      lum[i] =
        (image.data[i * 4] * 0.2126 +
          image.data[i * 4 + 1] * 0.7152 +
          image.data[i * 4 + 2] * 0.0722) |
        0;
      dist[i] = 0;
    } else {
      dist[i] = INF;
    }
  }

  // chamfer distance transform — two passes, cheap, run once
  const D1 = 3;
  const D2 = 4;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = y * w + x;
      let d = dist[i];
      if (d === 0) continue;
      if (x > 0) d = Math.min(d, dist[i - 1] + D1);
      if (y > 0) d = Math.min(d, dist[i - w] + D1);
      if (x > 0 && y > 0) d = Math.min(d, dist[i - w - 1] + D2);
      if (x < w - 1 && y > 0) d = Math.min(d, dist[i - w + 1] + D2);
      dist[i] = d;
    }
  }
  for (let y = h - 1; y >= 0; y -= 1) {
    for (let x = w - 1; x >= 0; x -= 1) {
      const i = y * w + x;
      let d = dist[i];
      if (d === 0) continue;
      if (x < w - 1) d = Math.min(d, dist[i + 1] + D1);
      if (y < h - 1) d = Math.min(d, dist[i + w] + D1);
      if (x < w - 1 && y < h - 1) d = Math.min(d, dist[i + w + 1] + D2);
      if (x > 0 && y < h - 1) d = Math.min(d, dist[i + w - 1] + D2);
      dist[i] = Math.min(d, INF);
    }
  }
  for (let i = 0; i < count; i += 1) dist[i] /= D1; // back into pixel units

  return { w, h, lum, inside, dist };
}

/* ---------------- screen ---------------- */

export const SCREEN_SCALE = 3;

/**
 * Draws the little interface into an alpha canvas: opaque means a lit pixel.
 * An active menu row is a filled bar with its label knocked back out of it,
 * which is why this is one channel rather than two.
 */
export function paintScreen(ctx, state) {
  const w = SCREEN.w * SCREEN_SCALE;
  const h = SCREEN.h * SCREEN_SCALE;

  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  /* Type is far larger than a real device's would be, on purpose: the screen
     resolves to roughly 60 dots across, so a glyph needs ~5 dots of width to
     stay readable. Anything smaller turns to porridge. */
  const mono = (size, weight = 500) =>
    `${weight} ${size}px 'JetBrains Mono', ui-monospace, monospace`;

  ctx.font = mono(30, 600);
  ctx.fillText("DRXCK", 12, 24);
  ctx.fillRect(12, 42, w - 24, 2);

  if (state.mode === "menu") {
    const rows = state.items;
    const top = 52;
    const rowH = (h - top - 8) / rows.length;

    rows.forEach((item, i) => {
      const y = top + i * rowH;
      const active = i === state.active;

      if (active) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(8, y + 2, w - 16, rowH - 5);
        // knock the label back out of the bar so one channel gives two tones
        ctx.globalCompositeOperation = "destination-out";
      }

      ctx.font = mono(32, 500);
      ctx.fillText(item.label, 18, y + rowH / 2);

      if (active) {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#fff";
      }
    });
    return;
  }

  // idle
  ctx.font = mono(28, 500);
  ctx.fillText("Hirable", 12, 76);
  ctx.fillText("CONTACT ME", 12, 110);

  ctx.font = mono(20, 400);
  ctx.fillText("67", 12, h - 20);

  // a small level meter — the only thing that moves while idle
  const bars = 7;
  const bw = 6;
  const gap = 5;
  const startX = w - 12 - (bars * (bw + gap) - gap);
  for (let i = 0; i < bars; i += 1) {
    const amp = 0.3 + 0.7 * Math.abs(Math.sin(state.t * 1.5 + i * 0.8));
    const bh = 5 + amp * 26;
    ctx.fillRect(startX + i * (bw + gap), h - 12 - bh, bw, bh);
  }
}

/** Samples the screen alpha at normalised 0..1 coordinates. */
export function sampleScreen(data, w, h, u, v) {
  if (!data) return 0;
  const x = (u * w) | 0;
  const y = (v * h) | 0;
  if (x < 0 || y < 0 || x >= w || y >= h) return 0;
  return data[(y * w + x) * 4 + 3] / 255;
}

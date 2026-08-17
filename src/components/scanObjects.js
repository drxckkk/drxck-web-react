/* ---------------------------------------------------------------------------
 * Objects from the desk, described as plain geometry and rasterised into small
 * alpha masks. The halftone field samples those masks to decide which dots
 * belong to the object — nothing here is drawn to the screen directly, it only
 * decides where dots get bigger.
 *
 * Authored in a 100x100 box. Detail is deliberately coarse: the field only
 * resolves ~30 dots across an object, so anything thinner than ~4 units
 * disappears. Strokes are heavy for the same reason, and solid silhouettes are
 * avoided where internal structure is what makes the object readable.
 *
 * SHAPES is pure data so the same geometry can be rendered outside the browser
 * (see scripts that preview the masks) rather than only inside a canvas.
 * ------------------------------------------------------------------------- */

export const MASK_SIZE = 88;

const LW = 5.5;

export const SHAPES = {
  keyboard: [
    { t: "rrect", x: 6, y: 30, w: 88, h: 40, r: 6, lw: LW },
    // five fat keys per row reads as a keyboard; nine did not survive the grid
    { t: "rrect", x: 14, y: 37, w: 12, h: 8, r: 2, fill: true },
    { t: "rrect", x: 30, y: 37, w: 12, h: 8, r: 2, fill: true },
    { t: "rrect", x: 46, y: 37, w: 12, h: 8, r: 2, fill: true },
    { t: "rrect", x: 62, y: 37, w: 12, h: 8, r: 2, fill: true },
    { t: "rrect", x: 78, y: 37, w: 8, h: 8, r: 2, fill: true },
    { t: "rrect", x: 14, y: 48, w: 12, h: 8, r: 2, fill: true },
    { t: "rrect", x: 30, y: 48, w: 12, h: 8, r: 2, fill: true },
    { t: "rrect", x: 46, y: 48, w: 12, h: 8, r: 2, fill: true },
    { t: "rrect", x: 62, y: 48, w: 12, h: 8, r: 2, fill: true },
    { t: "rrect", x: 78, y: 48, w: 8, h: 8, r: 2, fill: true },
    { t: "rrect", x: 30, y: 59, w: 40, h: 7, r: 2.5, fill: true }, // spacebar
  ],

  mouse: [
    { t: "rrect", x: 30, y: 12, w: 40, h: 76, r: 20, lw: LW },
    { t: "line", pts: [50, 15, 50, 44], lw: LW },
    { t: "rrect", x: 45, y: 24, w: 10, h: 14, r: 5, fill: true }, // wheel
  ],

  camera: [
    { t: "rrect", x: 34, y: 18, w: 24, h: 11, r: 3, fill: true }, // viewfinder
    { t: "rrect", x: 8, y: 28, w: 84, h: 50, r: 8, lw: LW },
    { t: "circle", x: 50, y: 53, r: 19, lw: LW },
    { t: "circle", x: 50, y: 53, r: 9, fill: true },
    { t: "circle", x: 79, y: 39, r: 5, fill: true }, // flash
  ],

  crt: [
    { t: "rrect", x: 11, y: 14, w: 78, h: 58, r: 9, lw: LW },
    { t: "rrect", x: 21, y: 23, w: 58, h: 40, r: 5, fill: true }, // screen
    { t: "rrect", x: 42, y: 72, w: 16, h: 10, r: 2, fill: true }, // neck
    { t: "rrect", x: 28, y: 82, w: 44, h: 8, r: 4, fill: true },  // base
  ],

  controller: [
    { t: "rrect", x: 12, y: 30, w: 76, h: 32, r: 16, lw: LW },
    { t: "circle", x: 26, y: 62, r: 15, lw: LW }, // grips
    { t: "circle", x: 74, y: 62, r: 15, lw: LW },
    { t: "rrect", x: 19, y: 41, w: 22, h: 8, r: 2, fill: true }, // d-pad
    { t: "rrect", x: 26, y: 34, w: 8, h: 22, r: 2, fill: true },
    { t: "circle", x: 68, y: 38, r: 6, fill: true },             // face buttons
    { t: "circle", x: 80, y: 48, r: 6, fill: true },
    { t: "circle", x: 68, y: 58, r: 6, fill: true },
    { t: "circle", x: 56, y: 48, r: 6, fill: true },
  ],
};

export const OBJECTS = {
  keyboard: { label: "Keyboard" },
  mouse: { label: "Mouse" },
  camera: { label: "Camera" },
  crt: { label: "Computer" },
  controller: { label: "Controller" },
};

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

export function drawShape(ctx, primitives) {
  primitives.forEach((p) => {
    ctx.lineWidth = p.lw || LW;

    if (p.t === "rrect") {
      roundedPath(ctx, p.x, p.y, p.w, p.h, p.r);
      if (p.fill) ctx.fill();
      else ctx.stroke();
      return;
    }

    if (p.t === "circle") {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      if (p.fill) ctx.fill();
      else ctx.stroke();
      return;
    }

    // line and poly are both a run of points
    ctx.beginPath();
    ctx.moveTo(p.pts[0], p.pts[1]);
    for (let i = 2; i < p.pts.length; i += 2) ctx.lineTo(p.pts[i], p.pts[i + 1]);
    if (p.closed) ctx.closePath();
    ctx.stroke();
  });
}

/**
 * Rasterises one object into a Uint8Array of alpha values, MASK_SIZE square.
 * Returns null where there is no usable 2D context (jsdom), which every caller
 * treats as "draw the plain field instead".
 */
export function buildMask(key) {
  const primitives = SHAPES[key];
  if (!primitives || typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = MASK_SIZE;
  canvas.height = MASK_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx || typeof ctx.getImageData !== "function") return null;

  const scale = MASK_SIZE / 100;
  ctx.scale(scale, scale);
  ctx.fillStyle = "#000";
  ctx.strokeStyle = "#000";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  drawShape(ctx, primitives);

  let image;
  try {
    image = ctx.getImageData(0, 0, MASK_SIZE, MASK_SIZE);
  } catch {
    return null;
  }

  const alpha = new Uint8Array(MASK_SIZE * MASK_SIZE);
  for (let i = 0; i < alpha.length; i += 1) alpha[i] = image.data[i * 4 + 3];
  return alpha;
}

/** Samples a mask at normalised coordinates in -0.5..0.5. */
export function sampleMask(mask, u, v) {
  if (!mask) return 0;
  const x = ((u + 0.5) * MASK_SIZE) | 0;
  const y = ((v + 0.5) * MASK_SIZE) | 0;
  if (x < 0 || y < 0 || x >= MASK_SIZE || y >= MASK_SIZE) return 0;
  return mask[y * MASK_SIZE + x] / 255;
}

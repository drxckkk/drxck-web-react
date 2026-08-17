import { useMemo } from "react";
import { SPRITES } from "./sprites";

/* Desenha um sprite da grade de pixels como SVG.

   Pixels vizinhos da mesma cor viram um retângulo só, então cada sprite sai
   com poucas dezenas de nós em vez de centenas — e como é SVG, escala pra
   qualquer tamanho sem borrar. */

function runs(sprite) {
  const out = [];

  sprite.rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const char = row[x];
      if (char === ".") {
        x += 1;
        continue;
      }
      let width = 1;
      while (row[x + width] === char) width += 1;
      out.push({ x, y, width, fill: sprite.palette[char] });
      x += width;
    }
  });

  return out;
}

function PixelSprite({ name, size = 96, alt, className = "", style }) {
  const sprite = SPRITES[name];
  const rects = useMemo(() => (sprite ? runs(sprite) : []), [sprite]);

  if (!sprite) return null;

  return (
    <svg
      className={`pixel-sprite ${className}`}
      viewBox={`0 0 ${sprite.w} ${sprite.h}`}
      width={size}
      height={(size * sprite.h) / sprite.w}
      shapeRendering="crispEdges"
      role={alt ? "img" : "presentation"}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      style={style}
    >
      {rects.map((r) => (
        <rect
          key={`${r.x}-${r.y}-${r.width}`}
          x={r.x}
          y={r.y}
          width={r.width}
          height={1}
          fill={r.fill}
        />
      ))}
    </svg>
  );
}

export default PixelSprite;

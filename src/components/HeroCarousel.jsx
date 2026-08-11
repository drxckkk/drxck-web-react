import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS, platformById } from "../data/projects";
import "./HeroCarousel.css";

const EASE = [0.16, 1, 0.3, 1];
const AUTOPLAY_MS = 5000;

/* the three most recent pieces of work, straight off the shared data layer */
const ITEMS = PROJECTS.slice(0, 3);
const COUNT = ITEMS.length;

/* how far each card sits behind the one in front of it */
const SLOT = [
  { x: 0, y: 0, scale: 1, opacity: 1 },
  { x: 34, y: 30, scale: 0.94, opacity: 0.85 },
  { x: 66, y: 58, scale: 0.88, opacity: 0.6 },
];

/* pixel buffer size for the background cards — the canvas is drawn this
   small and then blown up by CSS with image-rendering: pixelated, which is
   what produces real chunky pixels rather than a plain blur */
const PIXEL_W = 64;
const PIXEL_H = 40;
const PIXEL_FPS = 15;

function CarouselCard({ item, slot, onSelect }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const active = slot === 0;
  const platform = platformById(item.platform);

  // every card's video runs; the front one is shown sharp, the rest feed
  // their frames into the pixel canvas
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (active) return undefined; // sharp video is showing, no need to draw

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return undefined;

    let raf = 0;
    let last = 0;
    const interval = 1000 / PIXEL_FPS;

    const draw = (time) => {
      raf = requestAnimationFrame(draw);
      if (time - last < interval) return;
      last = time;

      const video = videoRef.current;
      if (!video || video.readyState < 2) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <motion.div
      className={`carousel-card ${active ? "is-active" : ""}`}
      animate={SLOT[slot]}
      transition={{ duration: 0.7, ease: EASE }}
      style={{ zIndex: COUNT - slot }}
      onClick={() => !active && onSelect()}
      role={!active ? "button" : undefined}
      tabIndex={!active ? 0 : -1}
      aria-label={!active ? `Show ${item.title}` : undefined}
      onKeyDown={(e) => {
        if (!active && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="carousel-card-media">
        <video ref={videoRef} loop muted playsInline preload="auto">
          <source src={item.video} type="video/mp4" />
        </video>

        {/* pixelated twin, cross-faded in whenever this card is behind */}
        <canvas
          ref={canvasRef}
          className="carousel-card-pixels"
          width={PIXEL_W}
          height={PIXEL_H}
          aria-hidden="true"
        />
      </div>

      <div className="carousel-card-scrim" aria-hidden="true" />

      <div className="carousel-card-info">
        {platform && (
          <span className="carousel-card-platform">
            <i className={platform.icon} aria-hidden="true" />
            {platform.label}
          </span>
        )}
        <span className="carousel-card-title">{item.title}</span>
      </div>
    </motion.div>
  );
}

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const id = setTimeout(() => setActive((a) => (a + 1) % COUNT), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, paused]);

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="carousel-glow" aria-hidden="true" />

      <div className="carousel-stage">
        {ITEMS.map((item, i) => (
          <CarouselCard
            key={item.id}
            item={item}
            slot={(i - active + COUNT) % COUNT}
            onSelect={() => setActive(i)}
          />
        ))}
      </div>

      <div className="carousel-bars">
        {ITEMS.map((item, i) => (
          <button
            key={item.id}
            className={`carousel-bar ${i === active ? "is-active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Show ${item.title}`}
          >
            {i === active && (
              // remounting on active/paused restarts the fill in step with the timer
              <span
                key={`${active}-${paused}`}
                className={`carousel-bar-fill ${paused ? "is-paused" : ""}`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;

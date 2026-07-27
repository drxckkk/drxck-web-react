import { useEffect, useRef, useState } from "react";
import "./HeroCarousel.css";
import videoVehicleSrc from "../assets/project1.mp4";
import videoOrbrc from "../assets/project2.mp4";
import videoJumpSrc from "../assets/project3.mp4";
import videoKartSrc from "../assets/project4.mp4";

const ITEMS = [
  { id: "project1", title: "Kart System", video: videoKartSrc },
  { id: "project2", title: "Orb System", video: videoOrbrc },
  { id: "project3", title: "Jump for UGC Game", video: videoJumpSrc },
];

const COUNT = ITEMS.length;
const AUTOPLAY_MS = 5000;

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const hovering = useRef(false);
  const videoRefs = useRef([]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!hovering.current) setActive((a) => (a + 1) % COUNT);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) v.play().catch(() => { });
      else v.pause();
    });
  }, [active]);

  const goTo = (i) => setActive(((i % COUNT) + COUNT) % COUNT);
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <div className="carousel-stage">
        {ITEMS.map((item, i) => {
          const slot = (i - active + COUNT) % COUNT;
          return (
            <div
              key={item.id}
              className={`carousel-card slot-${slot}`}
              onClick={() => slot !== 0 && goTo(i)}
              role={slot !== 0 ? "button" : undefined}
              tabIndex={slot !== 0 ? 0 : -1}
              aria-label={slot !== 0 ? `Show ${item.title}` : undefined}
            >
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                loop
                muted
                playsInline
              >
                <source src={item.video} type="video/mp4" />
              </video>
              <span className="carousel-card-label">{item.title}</span>
            </div>
          );
        })}
      </div>

      <div className="carousel-controls">
        <button className="carousel-arrow" onClick={prev} aria-label="Previous project">
          <i className="fa-solid fa-chevron-left" aria-hidden="true" />
        </button>

        <div className="carousel-dots">
          {ITEMS.map((item, i) => (
            <button
              key={item.id}
              className={`carousel-dot ${i === active ? "is-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to ${item.title}`}
            />
          ))}
        </div>

        <button className="carousel-arrow" onClick={next} aria-label="Next project">
          <i className="fa-solid fa-chevron-right" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default HeroCarousel;

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { PROFILE } from "../../data/profile";
import { prefersReducedMotion } from "../../routes";
import "./Hero.css";

const GRID = 22;
const SPOT = 380;

function usePointerLight(sectionRef, spotRef) {
  useEffect(() => {
    const section = sectionRef.current;
    const spot = spotRef.current;
    if (!section || !spot) return undefined;

    const fine = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return undefined;

    let rect = null;
    let frame = 0;
    const target = { sx: 0, sy: 0 };
    const current = { sx: 0, sy: 0 };

    const measure = () => {
      rect = section.getBoundingClientRect();
    };

    const tick = () => {
      current.sx += (target.sx - current.sx) * 0.28;
      current.sy += (target.sy - current.sy) * 0.28;

      const left = current.sx - SPOT / 2;
      const top = current.sy - SPOT / 2;
      spot.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      spot.style.backgroundPosition = `${-(left % GRID)}px ${-(top % GRID)}px`;

      const settling =
        Math.abs(target.sx - current.sx) > 0.3 ||
        Math.abs(target.sy - current.sy) > 0.3;

      frame = settling ? requestAnimationFrame(tick) : 0;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onEnter = (e) => {
      measure();
      current.sx = target.sx = e.clientX - rect.left;
      current.sy = target.sy = e.clientY - rect.top;
      section.classList.add("is-pointing");
      schedule();
    };

    const onMove = (e) => {
      if (!rect) measure();
      target.sx = e.clientX - rect.left;
      target.sy = e.clientY - rect.top;
      schedule();
    };

    const onLeave = () => {
      section.classList.remove("is-pointing");
    };

    const invalidate = () => {
      rect = null;
    };

    section.addEventListener("pointerenter", onEnter);
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);

    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, [sectionRef, spotRef]);
}

function Hero() {
  const sectionRef = useRef(null);
  const spotRef = useRef(null);

  usePointerLight(sectionRef, spotRef);

  return (
    <section className="hero" id="top" data-nav-section="home" ref={sectionRef}>
      <div className="hero-field" aria-hidden="true">
        <div className="hero-dots" />
        <div className="hero-spot" ref={spotRef} />
      </div>

      <div className="shell hero-inner">
        <h1 className="hero-name title-xl">{PROFILE.name}</h1>
        <p className="hero-role">{PROFILE.role}</p>
        <p className="hero-tagline body-l">{PROFILE.tagline}</p>

        <div className="hero-actions">
          <a className="btn btn-primary btn-lg" href="#work">
            View my work
            <ArrowRight className="icon-nudge" aria-hidden="true" strokeWidth={2.1} />
          </a>
          <a className="btn btn-lg" href="#contact">
            Contact me
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import LazyVideo from "./LazyVideo";
import Magnetic, { MagneticButton } from "./Magnetic";
import WordReveal from "./WordReveal";
import { PLATFORMS, PROJECTS, countFor, platformById } from "../data/projects";
import "./Projects.css";

const EASE = [0.16, 1, 0.3, 1];
const TILT = 9;   // max degrees of card rotation
const PULL = 0.06; // how far the card drifts toward the cursor

/* ---------------- platform filter ---------------- */

function PlatformBar({ active, onChange }) {
  const options = useMemo(
    () => [
      { id: "all", label: "All work", icon: "fa-solid fa-asterisk", count: PROJECTS.length },
      ...PLATFORMS.map((p) => ({ ...p, count: countFor(p.id) })),
    ],
    []
  );

  return (
    <div className="platform-bar" role="tablist" aria-label="Filter projects by platform">
      {options.map((option) => {
        const empty = option.count === 0;
        const isActive = active === option.id;

        return (
          <MagneticButton
            key={option.id}
            role="tab"
            aria-selected={isActive}
            disabled={empty}
            className={`platform-chip ${isActive ? "is-active" : ""} ${empty ? "is-empty" : ""}`}
            onClick={() => !empty && onChange(option.id)}
            title={empty ? `${option.label} — work coming soon` : option.blurb}
          >
            {isActive && (
              <motion.span
                className="platform-chip-bg"
                layoutId="platform-chip-bg"
                transition={{ duration: 0.5, ease: EASE }}
              />
            )}
            <span className="platform-chip-label">
              <i className={option.icon} aria-hidden="true" />
              {option.label}
              <span className="platform-count">{empty ? "" : option.count}</span>
            </span>
          </MagneticButton>
        );
      })}
    </div>
  );
}

/* ---------------- card ---------------- */

function ProjectCard({ project, index, onOpen }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const config = { stiffness: 220, damping: 22, mass: 0.5 };
  const rotateX = useSpring(rx, config);
  const rotateY = useSpring(ry, config);
  const x = useSpring(tx, config);
  const y = useSpring(ty, config);
  const glowX = useSpring(gx, config);
  const glowY = useSpring(gy, config);

  const glow = useMotionTemplate`radial-gradient(340px circle at ${glowX}% ${glowY}%, var(--wash), transparent 70%)`;

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    ry.set((px - 0.5) * TILT * 2);
    rx.set((0.5 - py) * TILT * 2);
    tx.set((e.clientX - (rect.left + rect.width / 2)) * PULL);
    ty.set((e.clientY - (rect.top + rect.height / 2)) * PULL);
    gx.set(px * 100);
    gy.set(py * 100);
  };

  const onEnter = () => setHovered(true);

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    tx.set(0);
    ty.set(0);
    gx.set(50);
    gy.set(50);
    setHovered(false);
  };

  const platform = platformById(project.platform);

  return (
    <motion.div
      className="project-card-wrap"
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.96 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay: (index % 3) * 0.08, ease: EASE }}
    >
      <motion.article
        ref={ref}
        className="project-card"
        role="button"
        tabIndex={0}
        aria-label={`Open ${project.title} details`}
        style={{ rotateX, rotateY, x, y }}
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
      >
        <motion.span className="project-card-glow" style={{ background: glow }} aria-hidden="true" />

        <div className="project-media">
          <LazyVideo
            src={project.video}
            label={project.title}
            play={hovered}
            warm
            resetOnPause
            spinnerClassName="is-small"
          />
          <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
          {project.featured && <span className="project-flag">Featured</span>}
        </div>

        <div className="project-body">
          <div className="project-meta">
            {platform && (
              <span className="project-platform">
                <i className={platform.icon} aria-hidden="true" />
                {platform.label}
              </span>
            )}
            <span className="project-year">{project.year}</span>
          </div>

          <h3 className="project-title">{project.title}</h3>
          <p className="project-summary">{project.summary}</p>
        </div>
      </motion.article>
    </motion.div>
  );
}

/* ---------------- detail ---------------- */

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("is-locked");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
    };
  }, [onClose]);

  const platform = platformById(project.platform);

  return (
    <motion.div
      className="project-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <motion.div
        className="project-modal"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.5, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <MagneticButton
          className="project-modal-close"
          wrapperClassName="project-modal-close-slot"
          onClick={onClose}
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </MagneticButton>

        <div className="project-modal-media">
          <LazyVideo
            src={project.video}
            label={project.title}
            play
            spinnerClassName="is-large"
          />
        </div>

        <div className="project-modal-body">
          <div className="project-meta">
            {platform && (
              <span className="project-platform">
                <i className={platform.icon} aria-hidden="true" />
                {platform.label}
              </span>
            )}
            <span className="project-year">{project.year}</span>
          </div>

          <h3 className="project-modal-title">{project.title}</h3>
          <WordReveal
            className="project-modal-overview"
            as="p"
            playOnMount
            delay={0.2}
            stagger={0.022}
            text={project.overview}
          />

          <div className="project-stats">
            {project.stats.map((stat) => (
              <div className="project-stat" key={stat.label}>
                <span className="project-stat-value">{stat.value}</span>
                <span className="project-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <Magnetic strength={0.2} className="project-modal-cta-slot">
            <a className="project-modal-cta" href="#contact" onClick={onClose}>
              Commission something like this
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </a>
          </Magnetic>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- section ---------------- */

function Projects() {
  const [platform, setPlatform] = useState("all");
  const [openId, setOpenId] = useState(null);

  const visible = useMemo(
    () => (platform === "all" ? PROJECTS : PROJECTS.filter((p) => p.platform === platform)),
    [platform]
  );

  const openProject = PROJECTS.find((p) => p.id === openId) || null;

  return (
    <section id="work" className="projects">
      <div className="shell">
        <div className="projects-head">
          <span className="label">Selected work</span>
          <WordReveal
            className="display display-l page-title"
            as="h2"
            text="Featured projects, *shipped*."
          />
          <WordReveal
            className="copy page-lead"
            as="p"
            stagger={0.022}
            delay={0.1}
            text="A selection of recent featured work, some of them even shipped and published to the public."
          />
        </div>

        <PlatformBar active={platform} onChange={setPlatform} />

        <motion.div className="project-grid" layout>
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onOpen={() => setOpenId(project.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {openProject && (
          <ProjectModal project={openProject} onClose={() => setOpenId(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

export default Projects;

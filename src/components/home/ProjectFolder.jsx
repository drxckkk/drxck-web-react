import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PROJECT_ICONS, iconFor } from "../icons";
import { prefetchWork } from "../../routes";
import "./ProjectFolder.css";

const MARK = Array.from({ length: 9 }, (_, i) => i);

function useOpenOnView(ref) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;

    const canHover = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
        idle(prefetchWork);
        if (!canHover && entry.intersectionRatio >= 0.55) {
          setOpen(true);
          observer.disconnect();
        } else if (canHover) {
          observer.disconnect();
        }
      },
      { threshold: [0.01, 0.55] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return open;
}

function ProjectFolder({ projects, total }) {
  const ref = useRef(null);
  const open = useOpenOnView(ref);

  return (
    <div
      ref={ref}
      className={`folder ${open ? "is-open" : ""}`}
      onPointerEnter={prefetchWork}
      onFocus={prefetchWork}
    >
      <div className="folder-body">
        <Link className="folder-back" to="/work" tabIndex={-1} aria-hidden="true">
          <span className="folder-tab" />
        </Link>

        <Link
          className="folder-front"
          to="/work"
          aria-label={`Work, open the archive of ${total} projects`}
        >
          <span className="folder-front-face">
            <span className="folder-label">Recent Work</span>
            <span className="folder-count">{total} projects</span>
          </span>
          <span className="folder-open-chip" aria-hidden="true">
            Open
            <ArrowUpRight strokeWidth={2.2} />
          </span>
          <span className="folder-mark" aria-hidden="true">
            {MARK.map((i) => (
              <span key={i} />
            ))}
          </span>
        </Link>

        <ul className="folder-sheets" aria-label="Featured projects">
          {projects.map((project, i) => {
            const Icon = iconFor(project.icon, PROJECT_ICONS);
            return (
              <li key={project.id} className="folder-slot" data-slot={i}>
                <Link className="sheet" to={`/work/${project.id}`}>
                  <span className="sheet-media">
                    <img
                      src={project.image.src}
                      srcSet={project.image.srcSet}
                      sizes="(max-width: 700px) 46vw, 300px"
                      width="640"
                      height="400"
                      alt=""
                      decoding="async"
                    />
                  </span>
                  <span className="sheet-caption">
                    <span className="sheet-icon" aria-hidden="true">
                      <Icon strokeWidth={2} />
                    </span>
                    <span className="sheet-text">
                      <span className="sheet-title">{project.title}</span>
                      <span className="sheet-category">{project.category}</span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="folder-hint" aria-hidden="true">
        <span className="folder-hint-hover">Hover to peek inside · click to open</span>
        <span className="folder-hint-touch">Tap a file to open it</span>
      </p>
    </div>
  );
}

export default ProjectFolder;

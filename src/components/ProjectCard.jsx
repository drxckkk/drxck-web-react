import { Link } from "react-router-dom";
import { PROJECT_ICONS, iconFor } from "./icons";
import "./ProjectCard.css";

const statusClass = (status = "") => `is-${status.toLowerCase().replace(/[^a-z]+/g, "-")}`;

const SIZES = {
  grid: "(max-width: 640px) 92vw, (max-width: 1100px) 46vw, 380px",
  wide: "(max-width: 640px) 92vw, (max-width: 1100px) 92vw, 780px",
  list: "112px",
};

export function StatusChip({ status }) {
  if (!status) return null;
  return (
    <span className={`chip status-chip ${statusClass(status)}`}>
      <span className="status-chip-dot" aria-hidden="true" />
      {status}
    </span>
  );
}

function ProjectCard({ project, layout = "grid", wide = false, eager = false, priority = false }) {
  const Icon = iconFor(project.icon, PROJECT_ICONS);
  const variant = layout === "list" ? "list" : wide ? "wide" : "grid";

  return (
    <Link to={`/work/${project.id}`} className={`project-card is-${variant}`}>
      <span className="project-thumb">
        <img
          src={project.image.src}
          srcSet={project.image.srcSet}
          sizes={SIZES[variant]}
          width="640"
          height="400"
          alt=""
          loading={eager || priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
        />
      </span>

      <span className="project-info">
        <span className="project-kind">
          <Icon aria-hidden="true" strokeWidth={2} />
          {project.category}
        </span>
        <span className="project-name">{project.title}</span>
        <span className="project-desc">{project.shortDescription}</span>
      </span>

      <span className="project-foot">
        <span className="project-year">{project.year}</span>
        <StatusChip status={project.status} />
      </span>
    </Link>
  );
}

export default ProjectCard;

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, Pause, Play } from "lucide-react";
import LazyVideo from "../components/LazyVideo";
import { StatusChip } from "../components/ProjectCard";
import { PROJECT_ICONS, iconFor } from "../components/icons";
import usePageMeta from "../hooks/usePageMeta";
import { PROJECTS, projectById } from "../data/projects";
import { prefersReducedMotion } from "../routes";
import "./ProjectPage.css";

function Media({ project }) {
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());

  if (!project.video) {
    return (
      <figure className="project-media">
        <img
          src={project.image.large}
          srcSet={project.image.srcSet}
          sizes="(max-width: 1240px) 100vw, 1240px"
          width="1280"
          height="800"
          alt={`${project.title}, screenshot`}
          fetchPriority="high"
        />
      </figure>
    );
  }

  return (
    <figure className="project-media is-video">
      <LazyVideo
        src={project.video}
        poster={project.image.large}
        play={playing}
        warm
        label={project.title}
        spinnerClassName="is-large"
        className="project-video"
        aria-label={`${project.title} gameplay video`}
      />
      <button
        type="button"
        className="project-media-toggle glass"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pause video" : "Play video"}
      >
        {playing ? (
          <Pause aria-hidden="true" strokeWidth={2.2} />
        ) : (
          <Play aria-hidden="true" strokeWidth={2.2} />
        )}
      </button>
    </figure>
  );
}

function Neighbour({ project, direction }) {
  const Arrow = direction === "prev" ? ArrowLeft : ArrowRight;
  return (
    <Link to={`/work/${project.id}`} className={`card project-neighbour is-${direction}`}>
      <span className="project-neighbour-thumb">
        <img src={project.image.src} width="640" height="400" alt="" loading="lazy" decoding="async" />
      </span>
      <span className="project-neighbour-text">
        <span className="meta">
          {direction === "prev" ? "Previous" : "Next"}
        </span>
        <span className="project-neighbour-title">{project.title}</span>
      </span>
      <Arrow className="project-neighbour-arrow" aria-hidden="true" strokeWidth={2} />
    </Link>
  );
}

function ProjectPage() {
  const { id } = useParams();
  const project = projectById(id);

  usePageMeta({
    title: project ? project.title : "Project not found",
    description: project ? `${project.shortDescription} ${project.category}, ${project.year}.` : undefined,
    path: `/work/${id}`,
  });

  if (!project) {
    return (
      <main id="main" className="site-main page not-found">
        <div className="shell not-found-inner">
          <span className="not-found-code">404</span>
          <h1 className="title-l">That project isn't in the folder.</h1>
          <Link className="btn btn-primary" to="/work">
            Browse all projects
          </Link>
        </div>
      </main>
    );
  }

  const Icon = iconFor(project.icon, PROJECT_ICONS);
  const index = PROJECTS.indexOf(project);
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const commissionable = project.stats.length > 0;

  return (
    <main id="main" className="site-main page project-page" key={project.id}>
      <div className="shell">
        <Link className="project-back" to="/work">
          <ChevronLeft aria-hidden="true" strokeWidth={2.2} />
          Work
        </Link>

        <header className="project-header">
          <p className="project-eyebrow">
            <Icon aria-hidden="true" strokeWidth={2} />
            {project.category}
            <span aria-hidden="true">·</span>
            {project.year}
          </p>
          <h1 className="title-xl project-title">{project.title}</h1>
          <p className="body-l project-lead">{project.summary}</p>

          {(project.url || commissionable) && (
            <div className="project-actions">
              {project.url && (
                <a className="btn btn-primary" href={project.url}>
                  {project.urlLabel || "Visit"}
                  <ArrowUpRight className="icon-nudge-diag" aria-hidden="true" strokeWidth={2.2} />
                </a>
              )}
              {commissionable && (
                <Link className={`btn ${project.url ? "" : "btn-primary"}`} to="/#contact">
                  Commission something like this
                </Link>
              )}
            </div>
          )}
        </header>

        <Media project={project} />

        <div className="project-body">
          <section className="project-overview" aria-labelledby="overview-title">
            <h2 id="overview-title" className="title-m">
              About the build
            </h2>
            <p className="body-l">{project.overview}</p>
          </section>

          <aside className="card project-facts" aria-label="Project details">
            <dl className="project-dl">
              <div>
                <dt>Type</dt>
                <dd>{project.category}</dd>
              </div>
              <div>
                <dt>Platform</dt>
                <dd>{project.platform}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{project.year}</dd>
              </div>
              {project.status && (
                <div>
                  <dt>Status</dt>
                  <dd>
                    <StatusChip status={project.status} />
                  </dd>
                </div>
              )}
              {project.stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>

            {project.tags.length > 0 && (
              <div className="project-tags">
                <p className="meta">Built with</p>
                <ul>
                  {project.tags.map((tag) => (
                    <li className="chip" key={tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        <nav className="project-pager" aria-label="More projects">
          <Neighbour project={prev} direction="prev" />
          <Neighbour project={next} direction="next" />
        </nav>
      </div>
    </main>
  );
}

export default ProjectPage;

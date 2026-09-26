import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProjectFolder from "./ProjectFolder";
import { FEATURED, PROJECTS } from "../../data/projects";
import { prefetchWork } from "../../routes";
import "./WorkSection.css";

function WorkSection() {
  return (
    <section id="work" className="section home-work" data-nav-section="work">
      <div className="shell home-work-grid">
        <div className="home-work-copy" data-reveal>
          <p className="eyebrow">Recent Work</p>
          <h2 className="title-l">Things I've built.</h2>
          <p className="body-l">
            Shipped games, gameplay systems and prototypes. Some of it is client work, some of it
            exists only because I wanted to find out whether it would work.
          </p>

          <Link
            to="/work"
            className="link-arrow"
            onPointerEnter={prefetchWork}
            onFocus={prefetchWork}
          >
            Browse recent projects
            <ArrowRight aria-hidden="true" strokeWidth={2.2} />
          </Link>
        </div>

        <div className="home-work-stage" data-reveal style={{ "--reveal-delay": "80ms" }}>
          <ProjectFolder projects={FEATURED} total={PROJECTS.length} />
        </div>
      </div>
    </section>
  );
}

export default WorkSection;

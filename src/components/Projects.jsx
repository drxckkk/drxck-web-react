import { motion } from "framer-motion";
import "./Projects.css";
import video1Src from "../assets/project1.mp4";
import video2Src from "../assets/project2.mp4";
import video3Src from "../assets/project3.mp4";

const PROJECTS = [
  {
    id: "project1",
    title: "Vehicle System",
    description:
      "A simple car system with raycasts and body forces for a smooth, responsive and arcade-like driving experience.",
    stack: ["Physics", "Raycasting"],
    stats: [
      { label: "Lines of code", value: "1,500" },
      { label: "Turnaround", value: "5 days" },
      { label: "Price", value: "$100" },
    ],
    video: video1Src,
  },
  {
    id: "project2",
    title: "Orb System",
    description:
      "A heavily optimized orb system built with custom physics and OOP to keep frame times low at scale even on low-end devices.",
    stack: ["Optimization", "Object Pooling"],
    stats: [
      { label: "Lines of code", value: "600" },
      { label: "Turnaround", value: "48 hours" },
      { label: "Price", value: "$120" },
    ],
    video: video2Src,
  },
  {
    id: "project3",
    title: "Jump For UGC Game",
    description:
      "A short showcase of a commissioned game, built and published on Roblox.",
    stack: ["Game Design", "React", "Modular"],
    stats: [
      { label: "Lines of code", value: "2,000" },
      { label: "Turnaround", value: "5 days" },
      { label: "Price", value: "$350" },
    ],
    video: video3Src,
  },
];

const handleMouseEnter = (e) => e.currentTarget.querySelector("video")?.play();
const handleMouseLeave = (e) => e.currentTarget.querySelector("video")?.pause();

function Projects() {
  return (
    <section id="work" className="section projects">
      <div className="section-inner">
        <span className="eyebrow">Selected work</span>
        <h2 className="section-heading">Featured projects</h2>
        <p className="section-sub">
          A list of recent systems I've built that show some areas I may specialize in.
        </p>

        <div className="project-list">
          {PROJECTS.map((project, i) => (
            <motion.article
              className={`project-row ${i % 2 === 1 ? "reverse" : ""}`}
              key={project.id}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="project-media"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <video loop muted playsInline>
                  <source src={project.video} type="video/mp4" />
                </video>
                <div className="project-media-overlay" />
              </div>

              <div className="project-content">
                <span className="project-index">0{i + 1}</span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                <ul className="project-stack">
                  {project.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>

                <div className="project-stats">
                  {project.stats.map((stat) => (
                    <div className="project-stat" key={stat.label}>
                      <span className="project-stat-value">{stat.value}</span>
                      <span className="project-stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;

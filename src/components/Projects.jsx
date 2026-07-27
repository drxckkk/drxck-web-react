import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Projects.css";
import video1Src from "../assets/project4.mp4";
import video2Src from "../assets/project2.mp4";
import video3Src from "../assets/project3.mp4";

const EASE = [0.16, 1, 0.3, 1];

const PROJECTS = [
  {
    id: "project1",
    title: "Kart System",
    description:
      "Kart system with a smooth driving, good handling and inspired by popular kart games.",
    stack: ["BodyForces", "Raycast", "Customizable"],
    stats: [
      { label: "Deadline", value: "5 days" },
      { label: "Price", value: "$200" },
    ],
    video: video1Src,
    overview:
      "Built a light raycast-based suspension, with body forces to handle physics and movement, so handling felt smooth at any speed. Built to run on any low-end device.",
  },
  {
    id: "project2",
    title: "Orb System",
    description:
      "A orb system built with custom physics and object pooling to keep frame times low at scale.",
    stack: ["Optimization", "Object Pooling", "Lua"],
    stats: [
      { label: "Deadline", value: "48 hours" },
      { label: "Price", value: "$70" },
    ],
    video: video2Src,
    overview:
      "Object pooling and custom physics, so orbs are reused instead of constantly created and destroyed. No frame drops even with over 512 orbs on screen at once.",
  },
];

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "snippet", label: "Code Snippet" },
];

const handleMouseEnter = (e) => e.currentTarget.querySelector("video")?.play();
const handleMouseLeave = (e) => e.currentTarget.querySelector("video")?.pause();

/* ---------------- Luau syntax highlighting ---------------- */

const TOKEN_REGEX =
  /(--\[\[[\s\S]*?\]\])|(--[^\n]*)|("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)|(\b\d+\.?\d*\b)|(\b(?:local|function|end|if|then|else|elseif|return|for|while|do|in|and|or|not|true|false|nil|break|repeat|until|self)\b)|(\b(?:game|workspace|script|task|table|string|math|Vector3|CFrame|Instance|Enum|Color3|require|print|pairs|ipairs|typeof|tostring|tonumber)\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_]+)/g;

const TOKEN_CLASSES = [
  "tok-comment",
  "tok-comment",
  "tok-string",
  "tok-number",
  "tok-keyword",
  "tok-builtin",
  "tok-identifier",
  "tok-plain",
  "tok-op",
];

function tokenize(code) {
  const tokens = [];
  let match;
  TOKEN_REGEX.lastIndex = 0;
  while ((match = TOKEN_REGEX.exec(code))) {
    const groupIndex = match.slice(1).findIndex((g) => g !== undefined);
    tokens.push({ text: match[0], className: TOKEN_CLASSES[groupIndex] });
  }
  return tokens;
}

function useTypewriter(text, active, speed = 14) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (!active) return;
    setLength(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setLength(i);
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);

  return { revealed: text.slice(0, length), done: length >= text.length };
}

function CodeSnippet({ code, active }) {
  const { revealed, done } = useTypewriter(code, active, 1);
  const tokens = tokenize(revealed);

  return (
    <div className="snippet-window">
      <div className="snippet-window-bar">
        <span className="snippet-lang">Luau</span>
      </div>
      <pre className="snippet-body">
        <code>
          {tokens.map((token, i) => (
            <span className={token.className} key={i}>
              {token.text}
            </span>
          ))}
          {!done && <span className="caret" />}
        </code>
      </pre>
    </div>
  );
}

function ProjectMedia({ project, onExpand }) {
  return (
    <motion.div
      className="project-media"
      layoutId={`project-media-${project.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onExpand}
      role="button"
      tabIndex={0}
      aria-label={`Expand ${project.title} details`}
      onKeyDown={(e) => (e.key === "Enter" ? onExpand() : null)}
    >
      <video loop muted playsInline>
        <source src={project.video} type="video/mp4" />
      </video>
      <div className="project-media-overlay" />
      <span className="expand-hint">
        <i className="fa-solid fa-arrows-up-down-left-right" aria-hidden="true" />
        <span>Expand</span>
      </span>
    </motion.div>
  );
}

function ProjectDetail({ project, onClose }) {
  const [tab, setTab] = useState("overview");

  return (
    <motion.div
      className="project-overlay-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      onClick={onClose}
    >
      <motion.div
        className="project-detail"
        layoutId={`project-media-${project.id}`}
        transition={{ layout: { duration: 0.55, ease: EASE } }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="project-detail-bar">
          <button className="dot dot-red" aria-label="Close" onClick={onClose} />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
          <span className="code-window-title">{project.title}</span>
        </div>

        <div className="project-detail-body">
          <div className="project-detail-media">
            <video autoPlay loop muted playsInline>
              <source src={project.video} type="video/mp4" />
            </video>
          </div>

          <div className="project-detail-content">
            <div className="file-tabs">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`file-tab ${tab === t.key ? "is-active" : ""}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="project-tab-content">
              <AnimatePresence mode="wait">
                {tab === "snippet" ? (
                  <motion.div
                    key="snippet"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <CodeSnippet code={project.snippet} active={tab === "snippet"} />
                  </motion.div>
                ) : (
                  <motion.p
                    key="overview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {project.overview}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="project-stats">
              {project.stats.map((stat) => (
                <div className="project-stat" key={stat.label}>
                  <span className="project-stat-value">{stat.value}</span>
                  <span className="project-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            <ul className="project-stack">
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Projects() {
  const [expandedId, setExpandedId] = useState(null);
  const expandedProject = PROJECTS.find((p) => p.id === expandedId) || null;

  return (
    <section id="work" className="section projects">
      <div className="section-inner">
        <span className="eyebrow">Recent work</span>
        <h2 className="section-heading">Featured projects</h2>
        <p className="section-sub">
          A showcase of recent work I've built, each one shipped
          for a real client, under real constraints.
        </p>

        <div className="project-list">
          {PROJECTS.map((project, i) => (
            <motion.article
              className={`project-row ${i % 2 === 1 ? "reverse" : ""}`}
              key={project.id}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <ProjectMedia
                project={project}
                onExpand={() => setExpandedId(project.id)}
              />

              <div className="project-content">
                <span className="project-index">#0{i + 1}</span>
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

      <AnimatePresence>
        {expandedProject && (
          <ProjectDetail project={expandedProject} onClose={() => setExpandedId(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

export default Projects;

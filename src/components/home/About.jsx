import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Clock, Hammer, Sparkles } from "lucide-react";
import Emblem from "../Emblem";
import Tuner from "./Tuner";
import { ABOUT, CURRENTLY, PROFILE, STATUS } from "../../data/profile";
import { projectById } from "../../data/projects";
import "./About.css";

function useLocalTime(timeZone) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer;
    const schedule = () => {
      timer = setTimeout(() => {
        setNow(new Date());
        schedule();
      }, 60000 - (Date.now() % 60000) + 50);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 12);
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";

  return { time: `${String(hour % 24).padStart(2, "0")}:${minute}`, hour: hour % 24 };
}

function ProfileCard() {
  return (
    <article className="card about-profile" data-reveal>
      <div className="profile-head">
        {PROFILE.avatar ? (
          <img className="profile-avatar" src={PROFILE.avatar} alt="" width="56" height="56" />
        ) : (
          <Emblem size={56} className="profile-emblem" />
        )}
        <div>
          <p className="profile-name">{PROFILE.name}</p>
          <p className="meta">
            @{PROFILE.handle} · {PROFILE.role}
          </p>
        </div>
      </div>

      <div className="profile-copy">
        {ABOUT.paragraphs.map((text) => (
          <p className="body-l" key={text.slice(0, 24)}>
            {text}
          </p>
        ))}
      </div>

      <dl className="profile-facts">
        {ABOUT.facts.map((fact) => (
          <div className="profile-fact" key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function StatusCard() {
  const { time, hour } = useLocalTime(PROFILE.timeZone);
  const asleep = hour < 7;

  return (
    <article className="card about-status" data-reveal style={{ "--reveal-delay": "60ms" }}>
      <p className="card-label">Status</p>
      <p className="status-line">
        <span className={`status-dot ${STATUS.state === "busy" ? "is-busy" : ""}`} aria-hidden="true" />
        <span className="status-word">{STATUS.label}</span>
        <span className="status-detail">{STATUS.detail}</span>
      </p>
      <p className="body status-note">{STATUS.note}</p>
      <p className="status-clock meta">
        <Clock aria-hidden="true" strokeWidth={2} />
        <span>
          <time>{time}</time> in {PROFILE.location}
          {asleep ? " (probably asleep)" : ""}
        </span>
      </p>
    </article>
  );
}

function BuildingCard() {
  const project = projectById(CURRENTLY.building);
  if (!project) return null;

  return (
    <Link
      to={`/work/${project.id}`}
      className="card about-building"
      data-reveal
      style={{ "--reveal-delay": "120ms" }}
    >
      <span className="building-media">
        <img
          src={project.image.src}
          srcSet={project.image.srcSet}
          sizes="(max-width: 700px) 90vw, 260px"
          width="640"
          height="400"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className="building-body">
        <span className="card-label">
          <Hammer aria-hidden="true" strokeWidth={2} />
          Currently building
        </span>
        <span className="building-title">{project.title}</span>
        <span className="meta building-line">{project.shortDescription}</span>
        {project.status && (
          <span className="chip building-status">
            <span className="building-pulse" aria-hidden="true" />
            {project.status}
          </span>
        )}
      </span>
      <ArrowUpRight className="card-corner" aria-hidden="true" strokeWidth={2} />
    </Link>
  );
}

function LearningCard() {
  return (
    <article className="card about-learning" data-reveal>
      <p className="card-label">
        <BookOpen aria-hidden="true" strokeWidth={2} />
        Currently learning
      </p>
      <ol className="learning-list">
        {CURRENTLY.learning.map((item, i) => (
          <li key={item}>
            <span className="learning-index" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            {item}
          </li>
        ))}
      </ol>
    </article>
  );
}

function PlayingCard() {
  return (
    <article className="card about-playing" data-reveal style={{ "--reveal-delay": "120ms" }}>
      <p className="card-label">
        <Sparkles aria-hidden="true" strokeWidth={2} />
        Playing with
      </p>
      <ul className="playing-list">
        {CURRENTLY.playingWith.map((item) => (
          <li className="playing-chip" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function About() {
  return (
    <section id="about" className="section home-about" data-nav-section="about">
      <div className="shell">
        <header className="section-head" data-reveal>
          <p className="eyebrow">About</p>
          <h2 className="title-l">{ABOUT.statement}</h2>
        </header>

        <div className="about-grid">
          <ProfileCard />
          <StatusCard />
          <BuildingCard />
          <LearningCard />
          <Tuner />
          <PlayingCard />
        </div>
      </div>
    </section>
  );
}

export default About;

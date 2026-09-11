import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutGrid, List, Search, X } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import useIndicator from "../hooks/useIndicator";
import usePageMeta from "../hooks/usePageMeta";
import { FILTERS, PROJECTS, countFor, matchesFilter, searchProjects } from "../data/projects";
import { loadProject } from "../routes";
import "./Work.css";

const VIEW_KEY = "work-view";

const FILTER_OPTIONS = FILTERS.map((f) => ({ ...f, count: countFor(f.id) })).filter(
  (f) => f.count > 0
);

const YEARS = PROJECTS.map((p) => Number(p.year)).filter(Boolean);
const SPAN =
  Math.min(...YEARS) === Math.max(...YEARS)
    ? String(Math.max(...YEARS))
    : `${Math.min(...YEARS)}–${Math.max(...YEARS)}`;

function readView() {
  try {
    return localStorage.getItem(VIEW_KEY) === "list" ? "list" : "grid";
  } catch {
    return "grid";
  }
}

function FolderGlyph() {
  return (
    <svg className="work-glyph" viewBox="0 0 64 52" aria-hidden="true">
      <path
        d="M4 10a6 6 0 0 1 6-6h14.5a6 6 0 0 1 4.6 2.2L32 10h22a6 6 0 0 1 6 6v4H4z"
        fill="var(--glyph-back)"
      />
      <rect x="4" y="14" width="56" height="34" rx="6" fill="url(#work-glyph-front)" />
      <path d="M8 19.5h48" stroke="rgba(255,255,255,.35)" strokeWidth="1" />
      <defs>
        <linearGradient id="work-glyph-front" x1="0" y1="14" x2="0" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--glyph-top)" />
          <stop offset="1" stopColor="var(--glyph-bottom)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Work() {
  usePageMeta({
    title: "Work",
    description:
      "The full archive: shipped Roblox games, gameplay systems, prototypes and more, all by me.",
    path: "/work",
  });

  const [params, setParams] = useSearchParams();
  const requested = params.get("filter");
  const filter = FILTER_OPTIONS.some((f) => f.id === requested) ? requested : "all";
  const [query, setQuery] = useState(() => params.get("q") || "");
  const [view, setView] = useState(readView);

  const searchRef = useRef(null);
  const trackRef = useRef(null);
  const indicatorRef = useRef(null);

  useIndicator(trackRef, indicatorRef, filter);

  const results = useMemo(
    () => searchProjects(query, PROJECTS.filter((p) => matchesFilter(p, filter))),
    [query, filter]
  );
  const browsing = filter === "all" && !query.trim();

  const updateParams = (key, value) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true, preventScrollReset: true }
    );
  };

  const chooseFilter = (id) => updateParams("filter", id === "all" ? "" : id);

  const changeQuery = (value) => {
    setQuery(value);
    updateParams("q", value.trim());
  };

  const chooseView = (next) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 300));
    idle(() => loadProject().catch(() => {}));
  }, []);

  return (
    <main id="main" className="site-main page work-page">
      <header className="shell work-head">
        <FolderGlyph />
        <div className="work-head-text">
          <h1 className="title-xl work-title">Work</h1>
          <p className="body-l">Games, software &amp; experiments.</p>
        </div>
        <p className="work-total meta">
          {PROJECTS.length} projects · {SPAN}
        </p>
      </header>

      <div className="shell">
        <div className="work-toolbar" role="search">
          <label className="work-search">
            <Search aria-hidden="true" strokeWidth={2} />
            <span className="sr-only">Search projects</span>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => changeQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape" && query) {
                  e.preventDefault();
                  changeQuery("");
                }
              }}
              placeholder="Search projects"
              autoComplete="off"
              spellCheck="false"
            />
            {query ? (
              <button
                type="button"
                className="work-search-clear"
                onClick={() => {
                  changeQuery("");
                  searchRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <X aria-hidden="true" strokeWidth={2.4} />
              </button>
            ) : (
              <kbd className="work-search-key" aria-hidden="true">
                /
              </kbd>
            )}
          </label>

          <div className="segmented" ref={trackRef} role="group" aria-label="Filter projects">
            <span className="segmented-indicator" ref={indicatorRef} aria-hidden="true" />
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                data-id={option.id}
                className={`segment ${filter === option.id ? "is-active" : ""}`}
                aria-pressed={filter === option.id}
                onClick={() => chooseFilter(option.id)}
              >
                {option.label}
                <span className="segment-count">{option.count}</span>
              </button>
            ))}
          </div>

          <div className="view-toggle" role="group" aria-label="Layout">
            <button
              type="button"
              aria-pressed={view === "grid"}
              aria-label="Grid view"
              title="Grid"
              onClick={() => chooseView("grid")}
            >
              <LayoutGrid aria-hidden="true" strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-pressed={view === "list"}
              aria-label="List view"
              title="List"
              onClick={() => chooseView("list")}
            >
              <List aria-hidden="true" strokeWidth={2} />
            </button>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {results.length === 1 ? "1 project" : `${results.length} projects`}
        </p>

        {results.length ? (
          <ul className={`work-collection is-${view}`} key={`${filter}-${view}`}>
            {results.map((project, i) => {
              const wide = browsing && view === "grid" && i === 0;
              return (
                <li
                  key={project.id}
                  className={wide ? "is-wide" : undefined}
                  style={{ "--i": Math.min(i, 8) }}
                >
                  <ProjectCard
                    project={project}
                    layout={view}
                    wide={wide}
                    eager={i < 3}
                    priority={i === 0}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="work-empty">
            <p className="title-s">Nothing matches “{query.trim()}”.</p>
            <p className="body">Try a tool like “Luau”, a year, or a different filter.</p>
            <button
              type="button"
              className="btn"
              onClick={() => {
                changeQuery("");
                chooseFilter("all");
              }}
            >
              Show everything
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default Work;

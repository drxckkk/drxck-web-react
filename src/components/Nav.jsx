import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Folder, House, Mail, Moon, Search, Sun, User } from "lucide-react";
import useIndicator from "../hooks/useIndicator";
import useTheme from "../hooks/useTheme";
import { prefersReducedMotion } from "../routes";
import "./Nav.css";

const CommandPalette = lazy(() => import("./CommandPalette"));

const ITEMS = [
  { id: "home", label: "Home", Icon: House, hash: "", route: "/" },
  { id: "work", label: "Work", Icon: Folder, hash: "work", route: "/work" },
  { id: "about", label: "About", Icon: User, hash: "about", route: "/#about" },
  { id: "contact", label: "Contact", Icon: Mail, hash: "contact", route: "/#contact" },
];

const CLICK_LOCK_MS = 900;

function useScrolled(sentinelRef) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [sentinelRef]);

  return scrolled;
}

function useSectionSpy(enabled, lockRef) {
  const [section, setSection] = useState("home");

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < lockRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) setSection(entry.target.dataset.navSection);
        });
      },
      { rootMargin: "-38% 0px -58% 0px" }
    );

    document.querySelectorAll("[data-nav-section]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled, lockRef]);

  return [section, setSection];
}

function Nav() {
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const sentinelRef = useRef(null);
  const trackRef = useRef(null);
  const indicatorRef = useRef(null);
  const lockRef = useRef(0);

  const scrolled = useScrolled(sentinelRef);
  const [section, setSection] = useSectionSpy(onHome, lockRef);
  const [theme, toggleTheme] = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const active = onHome ? section : pathname.startsWith("/work") ? "work" : null;

  useIndicator(trackRef, indicatorRef, active);

  const onItemClick = (event, item) => {
    if (!onHome) return;
    event.preventDefault();

    const behavior = prefersReducedMotion() ? "auto" : "smooth";
    const target = item.hash ? document.getElementById(item.hash) : null;

    lockRef.current = Date.now() + CLICK_LOCK_MS;
    setSection(item.id);

    if (target) target.scrollIntoView({ behavior, block: "start" });
    else window.scrollTo({ top: 0, behavior });

    window.history.replaceState(window.history.state, "", item.hash ? `/#${item.hash}` : "/");
  };

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="nav-sentinel" aria-hidden="true" />

      <header className={`nav-wrap ${scrolled ? "is-scrolled" : ""}`}>
        <nav className="nav glass" aria-label="Primary">
          <div className="nav-track" ref={trackRef}>
            <span className="nav-indicator" ref={indicatorRef} aria-hidden="true" />
            <ul className="nav-list">
              {ITEMS.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <Link
                      to={onHome ? (item.hash ? `/#${item.hash}` : "/") : item.route}
                      data-id={item.id}
                      className={`nav-item ${isActive ? "is-active" : ""}`}
                      aria-current={isActive ? (onHome ? "location" : "page") : undefined}
                      onClick={(e) => onItemClick(e, item)}
                    >
                      <item.Icon aria-hidden="true" strokeWidth={1.9} />
                      <span className="nav-label">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <span className="nav-divider" aria-hidden="true" />

          <button
            type="button"
            className="nav-icon-btn nav-search"
            onClick={openPalette}
            aria-label="Search projects and pages"
            aria-keyshortcuts="Meta+K Control+K"
            title="Search  ⌘K"
          >
            <Search aria-hidden="true" strokeWidth={1.9} />
          </button>

          <button
            type="button"
            className="nav-icon-btn nav-theme"
            data-mode={theme}
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light appearance" : "Switch to dark appearance"}
            title={theme === "dark" ? "Light appearance" : "Dark appearance"}
          >
            <Sun className="nav-theme-sun" aria-hidden="true" strokeWidth={1.9} />
            <Moon className="nav-theme-moon" aria-hidden="true" strokeWidth={1.9} />
          </button>
        </nav>
      </header>

      {paletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette onClose={closePalette} />
        </Suspense>
      )}
    </>
  );
}

export default Nav;

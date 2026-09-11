import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  CornerDownLeft,
  Folder,
  House,
  Mail,
  MapPin,
  Monitor,
  Search,
  User,
} from "lucide-react";
import { GitHubIcon } from "./icons";
import { PROJECTS, searchProjects } from "../data/projects";
import { CONTACT } from "../data/profile";
import "./CommandPalette.css";

const PAGES = [
  { id: "p-home", title: "Home", hint: "Start of the page", to: "/", Icon: House },
  { id: "p-work", title: "Work", hint: "Every project", to: "/work", Icon: Folder },
  { id: "p-about", title: "About", hint: "Who I am, what I'm up to", to: "/#about", Icon: User },
  { id: "p-places", title: "Places", hint: "Photos", to: "/#places", Icon: MapPin },
  { id: "p-uses", title: "What I use", hint: "Hardware, software, stack", to: "/#uses", Icon: Monitor },
  { id: "p-contact", title: "Contact", hint: "Email, Discord, GitHub", to: "/#contact", Icon: Mail },
];

const ELSEWHERE = [
  { id: "l-email", title: "Send an email", hint: CONTACT.email, href: `mailto:${CONTACT.email}`, Icon: Mail },
];

const matches = (item, words) => {
  const text = `${item.title} ${item.hint}`.toLowerCase();
  return words.every((w) => text.includes(w));
};

function CommandPalette({ onClose }) {
  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const uid = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const groups = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const projects = searchProjects(query).map((p) => ({
      id: `w-${p.id}`,
      title: p.title,
      hint: p.category,
      to: `/work/${p.id}`,
      thumb: p.image.src,
    }));
    return [
      { label: "Pages", items: PAGES.filter((i) => matches(i, words)) },
      { label: "Projects", items: projects },
      { label: "Elsewhere", items: ELSEWHERE.filter((i) => matches(i, words)) },
    ].filter((g) => g.items.length);
  }, [query]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    if (dialog?.showModal && !dialog.open) dialog.showModal();
    inputRef.current?.focus();
    return () => {
      if (dialog?.open && dialog.close) dialog.close();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (item) => {
    if (!item) return;
    onClose();
    if (item.href) {
      if (item.href.startsWith("mailto:")) window.location.href = item.href;
      else window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      navigate(item.to);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(flat[active]);
    }
  };

  let index = -1;

  return (
    <dialog
      ref={dialogRef}
      className="palette"
      aria-label="Search"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="palette-panel glass">
        <div className="palette-field">
          <Search aria-hidden="true" strokeWidth={2} />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${uid}-list`}
            aria-activedescendant={flat[active] ? `${uid}-${flat[active].id}` : undefined}
            aria-autocomplete="list"
            aria-label="Search pages and projects"
            placeholder="Search pages and projects…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck="false"
          />
          <kbd className="palette-esc">esc</kbd>
        </div>

        <div className="palette-results" id={`${uid}-list`} role="listbox" ref={listRef} aria-label="Results">
          {groups.map((group) => (
            <div className="palette-group" role="group" aria-label={group.label} key={group.label}>
              <p className="palette-group-label" aria-hidden="true">
                {group.label}
              </p>
              {group.items.map((item) => {
                index += 1;
                const i = index;
                const isActive = i === active;
                return (
                  <div
                    key={item.id}
                    id={`${uid}-${item.id}`}
                    role="option"
                    aria-selected={isActive}
                    data-index={i}
                    className={`palette-item ${isActive ? "is-active" : ""}`}
                    onPointerMove={() => !isActive && setActive(i)}
                    onClick={() => choose(item)}
                  >
                    <span className="palette-icon" aria-hidden="true">
                      {item.thumb ? (
                        <img src={item.thumb} alt="" width="36" height="24" />
                      ) : (
                        <item.Icon strokeWidth={1.9} />
                      )}
                    </span>
                    <span className="palette-text">
                      <span className="palette-title">{item.title}</span>
                      <span className="palette-hint">{item.hint}</span>
                    </span>
                    {item.href ? (
                      <ArrowUpRight className="palette-go" aria-hidden="true" strokeWidth={2} />
                    ) : (
                      <CornerDownLeft className="palette-go" aria-hidden="true" strokeWidth={2} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {!flat.length && (
            <p className="palette-empty">
              No results for “{query}”. There are {PROJECTS.length} projects in the archive.
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
}

export default CommandPalette;

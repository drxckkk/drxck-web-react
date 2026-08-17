import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

const LINKS = [
  { to: "/work", label: "work" },
  // { to: "/games", label: "games" },
  { to: "/about", label: "about" },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header-inner">
        <Link to="/" className="brand" aria-label="drxck, home">
          drxck.cyou
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? "is-active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}

          <a href="#contact" className="nav-contact">
            contact
            <span className="arrow" aria-hidden="true">→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;

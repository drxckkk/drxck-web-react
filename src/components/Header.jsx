import "./Header.css";
import { CIcon } from '@coreui/icons-react';
import { cibKoFi } from "@coreui/icons";

function Header() {
  return (
    <header>
      <div className="container">
        <h1>Drxck's Portfolio</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="kofi-container">
          <a
            href="https://ko-fi.com/drxck"
            target="_blank"
            rel="noopener noreferrer"
            className="kofi-button"
          >
            <span className="kofi-text"><CIcon icon={cibKoFi} /> Support me on Ko-fi</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;

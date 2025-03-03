import React from "react";
import "./Header.css";

function Header() {
  return (
    <header>
      <div className="container">
        <h1>Drxck's Portfolio</h1>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;

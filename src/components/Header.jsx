import "./Header.css";
import { CIcon } from '@coreui/icons-react';
import { cibKoFi } from "@coreui/icons";

function Header() {
  return (
    <>
      <div className="header-wrapper">
        <header>
          <div className="container">
            <nav>
              <ul>
                <a href="">Drxck's portfolio</a>
                <a href="#home">home</a>
                <a href="#projects">projects</a>
                <a href="#contact">contact me</a>
              </ul>
            </nav>
          </div>
        </header>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'none' }}>
        <defs>
          <filter id="displacementFilter">
            <feTurbulence type="turbulence"
              baseFrequency="0.01"
              numOctaves="2"
              result="turbulence" />

            <feDisplacementMap in="SourceGraphic"
              in2="turbulence"
              scale="200" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    </>
  );
}

export default Header;

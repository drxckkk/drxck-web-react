import "./Header.css";

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
      </div>
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

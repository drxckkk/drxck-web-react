import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./Game.css";

// The game is a .NET WebAssembly build that boots its own emscripten runtime and
// owns a fixed 1280x720 canvas. It lives in an iframe so its runtime, its
// pointer/keyboard handling and its canvas sizing stay isolated from the site's
// React tree.
// Trailing slash matters: pointing at index.html lets a server redirect to the
// extensionless path, after which the game's relative asset URLs resolve
// against the site root and every _framework request 404s.
const GAME_SRC = `${process.env.PUBLIC_URL || ""}/fnajk-app/`;

function Game() {
  const [started, setStarted] = useState(false);
  const frameRef = useRef(null);

  useEffect(() => {
    const previous = document.title;
    document.title = "FNAJK — drxck";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <motion.main
      className="game-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="game-header">
        <p className="game-eyebrow">Playable in browser</p>
        <h1 className="game-title">Five Night&apos;s At Juscelino Kubitschek</h1>
        <p className="game-summary">
          A point-and-click horror parody, running natively in the browser.
          Mouse to play; on touch devices the D-pad below the game sends W/A/S/D.
        </p>
      </header>

      <section className="game-stage">
        {started ? (
          <iframe
            ref={frameRef}
            className="game-frame"
            src={GAME_SRC}
            title="Five Night's At Juscelino Kubitschek"
            allow="autoplay; fullscreen"
          />
        ) : (
          <button className="game-start" onClick={() => setStarted(true)}>
            <span className="game-start-label">Play</span>
            <span className="game-start-note">
              Loads roughly 140&nbsp;MB — best on a fast connection
            </span>
          </button>
        )}
      </section>

      <section className="game-notes">
        <h2 className="game-section-title">Notes</h2>
        <ul>
          <li>First load is slow: the whole game is downloaded before it starts.</li>
          <li>Audio starts once you interact with the page — browsers require it.</li>
          <li>
            Trouble running it? <a href="https://github.com/drxckkk/fnjk">Source on GitHub</a>.
          </li>
        </ul>
      </section>
    </motion.main>
  );
}

export default Game;

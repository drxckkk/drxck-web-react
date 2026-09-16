import { useCallback, useEffect, useRef, useState } from "react";
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

// iPhone Safari implements the Fullscreen API only for <video>, so
// Element.requestFullscreen is simply absent there. Where it is missing we fall
// back to pinning the iframe over the viewport, which has to happen in this
// page: a CSS "fullscreen" applied inside the iframe could never escape the
// iframe's own box.
const canNativeFullscreen = () =>
  typeof document !== "undefined" &&
  document.fullscreenEnabled &&
  typeof HTMLElement.prototype.requestFullscreen === "function";

function Game() {
  const [started, setStarted] = useState(false);
  const [covering, setCovering] = useState(false);
  const [native, setNative] = useState(false);
  const frameRef = useRef(null);

  // Keep local state honest when the user leaves fullscreen with Esc or the
  // browser's own control rather than our button.
  useEffect(() => {
    const sync = () => setNative(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  // Hide the site's fixed nav/footer while the fallback covers the screen.
  // They sit in their own stacking context, so out-competing them with z-index
  // is fragile; not rendering them is both simpler and what fullscreen means.
  useEffect(() => {
    document.body.classList.toggle("game-covering", covering);
    return () => document.body.classList.remove("game-covering");
  }, [covering]);

  // Esc cannot exit the CSS fallback on its own, so wire it up.
  useEffect(() => {
    if (!covering) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setCovering(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [covering]);

  const toggleFullscreen = useCallback(async () => {
    const frame = frameRef.current;
    if (!frame) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
      return;
    }
    if (covering) {
      setCovering(false);
      return;
    }
    if (canNativeFullscreen()) {
      try {
        await frame.requestFullscreen();
        return;
      } catch {
        // Fall through to the CSS fallback below.
      }
    }
    setCovering(true);
  }, [covering]);

  const expanded = native || covering;

  useEffect(() => {
    const previous = document.title;
    document.title = "FNAJK — drxck";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <motion.main
      className={`game-page${covering ? " game-page--covering" : ""}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="game-header">
        <h1 className="game-title">Five Night&apos;s At Juscelino Kubitschek</h1>
      </header>

      <section className="game-stage">
        {started ? (
          <>
            <div className="game-toolbar">
              <button
                type="button"
                className="game-tool"
                onClick={toggleFullscreen}
              >
                {expanded ? "Exit fullscreen" : "Fullscreen"}
              </button>
            </div>
            <iframe
              ref={frameRef}
              className={`game-frame${covering ? " game-frame--cover" : ""}`}
              src={GAME_SRC}
              title="Five Night's At Juscelino Kubitschek"
              allow="autoplay; fullscreen"
            />
            {covering && (
              <button
                type="button"
                className="game-tool game-tool--floating"
                onClick={toggleFullscreen}
              >
                Exit
              </button>
            )}
          </>
        ) : (
          <button className="game-start" onClick={() => setStarted(true)}>
            <span className="game-start-label">Play</span>
            <span className="game-start-note">
              ~140&nbsp;MB
            </span>
          </button>
        )}
      </section>
    </motion.main>
  );
}

export default Game;

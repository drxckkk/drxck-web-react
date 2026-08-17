import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HalftoneField from "../components/HalftoneField";
import LazyVideo from "../components/LazyVideo";
import WordReveal from "../components/WordReveal";
import { gameById } from "../data/games";
import "./GamePage.css";

const EASE = [0.16, 1, 0.3, 1];

/**
 * Landing page for a single game. Driven entirely by an id from data/games.js,
 * so a future title only needs a route pointing here — no new layout code.
 */
function GamePage({ gameId }) {
  const game = gameById(gameId);

  if (!game) {
    return (
      <>
        <Header />
        <main className="site-main page game-missing">
          <div className="shell">
            <h1 className="display display-m">This game isn't listed yet.</h1>
            <Link className="text-link" to="/games">
              back to games
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="site-main page game-page">
        <section className="game-hero">
          <div className="game-hero-field" aria-hidden="true">
            <HalftoneField variant="wave" density={20} speed={0.7} intensity={0.85} />
          </div>

          <div className="shell game-hero-inner">
            <Link className="game-back" to="/games">
              <span className="arrow" aria-hidden="true">←</span>
              games
            </Link>

            <div className="game-meta-row">
              <span className="label">{game.status}</span>
              <span className="label">{game.year}</span>
            </div>

            <WordReveal
              className="display display-xl game-hero-title"
              as="h1"
              playOnMount
              stagger={0.055}
              text={game.title}
            />

            <p className="copy game-hero-lead">{game.summary}</p>
          </div>
        </section>

        <motion.section
          className="shell game-media-wrap"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: EASE }}
        >
          <div className="game-media">
            <LazyVideo
              src={game.video}
              play
              warm
              className="game-media-video"
              label={game.title}
            />
          </div>
        </motion.section>

        <section className="shell game-detail">
          <div className="game-detail-grid">
            <div className="game-detail-col">
              <span className="label">About the build</span>
              <p className="copy game-overview">{game.overview}</p>
            </div>
          </div>

          <hr className="rule game-detail-rule" />

          <div className="game-next">
            <Link className="pill-link" to="/games">
              all games
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link className="pill-link" to="/work">
              selected work
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default GamePage;

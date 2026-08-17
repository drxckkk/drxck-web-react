import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HalftoneField from "../components/HalftoneField";
import WordReveal from "../components/WordReveal";
import { GAMES } from "../data/games";
import "./Games.css";

const EASE = [0.16, 1, 0.3, 1];

function GameRow({ game, index }) {
  const body = (
    <>
      <span className="game-index">{String(index + 1).padStart(2, "0")}</span>

      <span className="game-title-cell">
        <span className="game-title">{game.title}</span>
        <span className="game-summary">{game.summary}</span>
      </span>

      <span className="game-year">{game.year}</span>
      <span className="game-status">{game.status}</span>

      <span className="game-arrow" aria-hidden="true">
        {game.route ? "→" : ""}
      </span>
    </>
  );

  return (
    <motion.li
      className={`game-row ${game.route ? "is-linked" : ""}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.06, ease: EASE }}
    >
      {game.route ? (
        <Link to={game.route} className="game-link">
          {body}
        </Link>
      ) : (
        <span className="game-link">{body}</span>
      )}
    </motion.li>
  );
}

function Games() {
  return (
    <>
      <Header />
      <main className="site-main page">
        <section className="page-head">
          <div className="page-head-field" aria-hidden="true">
            <HalftoneField variant="perspective" density={19} speed={0.5} intensity={0.9} />
          </div>

          <div className="shell page-head-inner">
            <span className="label">Games</span>
            <WordReveal
              className="display display-l page-title"
              as="h1"
              playOnMount
              stagger={0.05}
              text="Things you can actually play."
            />
            <p className="copy page-lead">
              Finished products rather than systems — built, balanced and shipped.
              A few were commissions, a few existed only to find out if the idea
              held up.
            </p>
          </div>
        </section>

        <section className="shell games-section">
          <hr className="rule" />
          <ul className="game-list">
            {GAMES.map((game, i) => (
              <GameRow key={game.id} game={game} index={i} />
            ))}
          </ul>

          <p className="games-note copy">
            Systems and client commissions live on{" "}
            <Link className="text-link games-note-link" to="/work">
              selected work
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Games;

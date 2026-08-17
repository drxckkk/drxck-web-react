import "./Marquee.css";

const WORDS = [
  "Full projects",
  "Systems",
  "Showcases",
  "Open for business",
  "High quality",
  "Efficiency",
  "2D & 3D",
  "Interfaces",
];

/**
 * A thin metadata band, not a marketing banner. The word list is duplicated
 * once and the track translates exactly -50%, so the loop is seamless.
 */
function Marquee({ words = WORDS, speed = 46 }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {words.map((word) => (
              <span className="marquee-item" key={word}>
                {word}
                <span className="marquee-sep">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marquee;

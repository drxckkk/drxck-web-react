import { Fragment } from "react";
import { motion } from "framer-motion";
import "./WordReveal.css";

const EASE = [0.16, 1, 0.3, 1];

const word = {
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE },
  },
};

/**
 * Reveals a string one word at a time, each word rising out of a blur —
 * the same motion as the hero headline, reused for every block of copy.
 *
 * Wrap a word in asterisks to accent it: "make it *real*" renders "real"
 * in italic green. That keeps markup out of the caller while still allowing
 * emphasis inside an animated line.
 */
function WordReveal({
  text,
  as = "p",
  className = "",
  stagger = 0.035,
  delay = 0,
  amount = 0.5,
  once = true,
  playOnMount = false,
}) {
  const Tag = motion[as] || motion.p;
  const words = String(text).split(/\s+/).filter(Boolean);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const trigger = playOnMount
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once, amount } };

  return (
    <Tag className={className} variants={container} initial="hidden" {...trigger}>
      {words.map((raw, i) => {
        // punctuation can sit outside the marker, as in "*real*." — keep it
        // attached to the word but outside the accent
        const accent = /^([^*]*)\*([^*]+)\*([^*]*)$/.exec(raw);
        return (
          <Fragment key={`${raw}-${i}`}>
            <motion.span className="wr-word" variants={word}>
              {accent ? (
                <>
                  {accent[1]}
                  <span className="wr-accent">{accent[2]}</span>
                  {accent[3]}
                </>
              ) : (
                raw
              )}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}

export default WordReveal;

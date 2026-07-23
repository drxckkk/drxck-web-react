import { motion } from "framer-motion";
import "./Contact.css";

const LINKS = [
  { label: "drxckpro123@gmail.com", icon: "fa-solid fa-envelope" },
  { label: "drxck", icon: "fa-brands fa-discord" },
  { label: "drxck", icon: "fa-brands fa-discord" },
];

function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="section-inner contact-inner">
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Get in touch
        </motion.span>

        <motion.h2
          className="contact-heading"
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          Interested? Let's start making your project come alive.
        </motion.h2>

        <motion.div
          className="contact-links"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {LINKS.map((link) => (
            <a
              key={link.label}
              rel="noreferrer"
              className="contact-link"
            >
              <i className={link.icon} aria-hidden="true" />
              {link.label}
            </a>
          ))}
        </motion.div>

        <p className="contact-terms">
          When contacting me for business, you agree to my{" "}
          <a
            className="link-underline"
            href="https://docs.google.com/document/d/1lAAyg9JxJ-Uc4r9aaH-KvpafnYdOsE_U"
            target="_blank"
            rel="noreferrer"
          >
            Terms of Service
          </a>{" "}
          and to using PayPal for transactions.
        </p>
      </div>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Drxck. All rights reserved.</span>
      </footer>
    </section>
  );
}

export default Contact;

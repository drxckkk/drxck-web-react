import { useState } from "react";
import { motion } from "framer-motion";
import { ActionButton, MagneticButton } from "./Magnetic";
import WordReveal from "./WordReveal";
import "./Contact.css";

const EASE = [0.16, 1, 0.3, 1];

const CHANNELS = [
  {
    id: "email",
    label: "Email",
    value: "drxckpro123@gmail.com",
    icon: "fa-solid fa-envelope",
  },
  {
    id: "discord",
    label: "Discord",
    value: "drxck",
    icon: "fa-brands fa-discord",
  },
];

function Contact() {
  const [copied, setCopied] = useState(null);

  const copy = (channel) => {
    navigator.clipboard
      ?.writeText(channel.value)
      .then(() => {
        setCopied(channel.id);
        setTimeout(() => setCopied((c) => (c === channel.id ? null : c)), 1800);
      })
      .catch(() => {});
  };

  return (
    <section id="contact" className="section contact">
      <div className="section-inner contact-inner">
        <WordReveal
          className="contact-heading"
          as="h2"
          stagger={0.05}
          text="Got something to build? Let's make it *real*."
        />

        <motion.div
          className="channel-list"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
        >
          {CHANNELS.map((channel) => (
            <div className="channel" key={channel.id}>
              <span className="channel-icon">
                <i className={channel.icon} aria-hidden="true" />
              </span>

              {channel.href ? (
                <a className="channel-value" href={channel.href}>
                  {channel.value}
                </a>
              ) : (
                <span className="channel-value">{channel.value}</span>
              )}

              <MagneticButton
                className={`channel-copy ${copied === channel.id ? "is-copied" : ""}`}
                onClick={() => copy(channel)}
                aria-label={`Copy ${channel.label}`}
              >
                <i
                  className={copied === channel.id ? "fa-solid fa-check" : "fa-regular fa-copy"}
                  aria-hidden="true"
                />
                {copied === channel.id ? "Copied" : "Copy"}
              </MagneticButton>
            </div>
          ))}
        </motion.div>

        <WordReveal
          className="contact-terms"
          as="p"
          stagger={0.015}
          text="When contacting me for business, you agree to my Terms of Service and to using PayPal for transactions."
        />

        <motion.a
          className="contact-terms-link link-underline"
          href="https://docs.google.com/document/d/1lAAyg9JxJ-Uc4r9aaH-KvpafnYdOsE_U"
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Read the Terms of Service
        </motion.a>
      </div>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Drxck</span>
      </footer>
    </section>
  );
}

export default Contact;

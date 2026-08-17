import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const CHANNELS = [
  { label: "Email", value: "drxckpro123@gmail.com"},
  { label: "Discord", value: "drxck" },
];

const ELSEWHERE = [
  { to: "/work", label: "My work" },
  //{ to: "/games", label: "Games" },
  { to: "/about", label: "About me" },
];

function Footer() {
  const [copied, setCopied] = useState(null);

  const copy = (channel) => {
    navigator.clipboard
      ?.writeText(channel.value)
      .then(() => {
        setCopied(channel.label);
        setTimeout(() => setCopied((c) => (c === channel.label ? null : c)), 1800);
      })
      .catch(() => {});
  };

  return (
    <footer className="page-footer" id="contact">
      <div className="shell">
        <hr className="rule" />

        <div className="footer-grid">
          <div className="footer-lead">
            <span className="label">Get in touch</span>
            <p className="display display-m footer-statement">
              Have something worth <em>building</em>?
            </p>
          </div>

          <div className="footer-col">
            <span className="label">CONTACT</span>
            <ul className="footer-list">
              {CHANNELS.map((channel) => (
                <li key={channel.label}>
                  <span className="footer-channel">
                    {channel.href ? (
                      <a className="footer-link" href={channel.href}>
                        {channel.value}
                      </a>
                    ) : (
                      <span className="footer-link is-static">{channel.value}</span>
                    )}

                    <button
                      className={`footer-copy ${copied === channel.label ? "is-copied" : ""}`}
                      onClick={() => copy(channel)}
                      aria-label={`Copy ${channel.label}`}
                    >
                      {copied === channel.label ? "copied" : "copy"}
                    </button>
                  </span>
                  <span className="footer-meta">{channel.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <span className="label">Elsewhere</span>
            <ul className="footer-list">
              {ELSEWHERE.map((item) => (
                <li key={item.to}>
                  <Link className="footer-link" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-base">
          <span>When hiring me you agree to my Terms of Service</span>
          <span><Link to="https://docs.google.com/document/d/1lAAyg9JxJ-Uc4r9aaH-KvpafnYdOsE_U/edit?usp=sharing&ouid=118064404027309110262&rtpof=true&sd=true">Terms of Service</Link></span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

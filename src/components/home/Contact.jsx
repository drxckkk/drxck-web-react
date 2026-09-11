import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { DiscordIcon, GitHubIcon } from "../icons";
import { CONTACT } from "../../data/profile";
import "./Contact.css";

const CHANNELS = [
  {
    id: "email",
    label: "Email",
    value: CONTACT.email,
    Icon: Mail,
    copy: true,
  },
  {
    id: "discord",
    label: "Discord",
    value: CONTACT.discord,
    Icon: DiscordIcon,
    copy: true,
  },
  {
    id: "github",
    label: "GitHub",
    value: CONTACT.github.user,
    href: CONTACT.github.url,
    Icon: GitHubIcon,
    external: true,
  },
];

function useCopy() {
  const [copied, setCopied] = useState(null);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = (channel) => {
    if (!navigator.clipboard) return;
    navigator.clipboard
      .writeText(channel.value)
      .then(() => {
        setCopied(channel.id);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(null), 1800);
      })
      .catch(() => {});
  };

  return [copied, copy];
}

function Contact() {
  const [copied, copy] = useCopy();
  const copiedChannel = CHANNELS.find((c) => c.id === copied);

  return (
    <section id="contact" className="home-contact" data-nav-section="contact">
      <div className="contact-field" aria-hidden="true" />

      <div className="shell contact-inner">
        <div className="contact-lead" data-reveal>
          <p className="eyebrow">Contact</p>
          <h2 className="contact-title">Let's build something.</h2>
          <p className="body-l contact-copy">
            Systems, full games or a small project; my inbox is open.
          </p>
        </div>

        <div className="contact-side" data-reveal style={{ "--reveal-delay": "90ms" }}>
          <ul className="card contact-channels">
            {CHANNELS.map((channel) => {
              const isCopied = copied === channel.id;
              const Main = channel.href ? "a" : "div";
              return (
                <li className="channel" key={channel.id}>
                  <Main
                    className="channel-main"
                    {...(channel.href
                      ? {
                          href: channel.href,
                          ...(channel.external ? { target: "_blank", rel: "noreferrer" } : {}),
                        }
                      : {})}
                  >
                    <span className="channel-icon" aria-hidden="true">
                      <channel.Icon strokeWidth={1.9} />
                    </span>
                    <span className="channel-text">
                      <span className="channel-label">{channel.label}</span>
                      <span className="channel-value">{channel.value}</span>
                    </span>
                    {channel.href && (
                      <ArrowUpRight className="channel-go" aria-hidden="true" strokeWidth={2} />
                    )}
                  </Main>
                  {channel.copy && (
                    <button
                      type="button"
                      className={`channel-copy ${isCopied ? "is-copied" : ""}`}
                      onClick={() => copy(channel)}
                      aria-label={`Copy ${channel.label.toLowerCase()} ${channel.value}`}
                    >
                      {isCopied ? (
                        <Check aria-hidden="true" strokeWidth={2.4} />
                      ) : (
                        <Copy aria-hidden="true" strokeWidth={2} />
                      )}
                      <span>{isCopied ? "Copied" : "Copy"}</span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <p className="contact-terms meta">
            Hiring me means agreeing to my{" "}
            <a href={CONTACT.terms} target="_blank" rel="noreferrer">
              Terms of Service
            </a>
            .
          </p>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {copiedChannel ? `${copiedChannel.label} copied to clipboard` : ""}
      </p>
    </section>
  );
}

export default Contact;

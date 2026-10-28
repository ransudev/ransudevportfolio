"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Github, Mail, MessageCircle } from "lucide-react";
import { contactInfo, socialLinks } from "../../data/socials";

type CopyTarget = "email" | "discord";

const COPIED_RESET_MS = 1800;

export default function ContactPage() {
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const resetTimer = useRef<number | null>(null);
  const github = socialLinks.find((social) => social.name === "GitHub");
  const [emailUser, emailDomain] = contactInfo.email.split("@");

  useEffect(() => () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
  }, []);

  const copy = async (target: CopyTarget, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard access can be blocked; the value is still visible to copy by hand.
      return;
    }
    setCopied(target);
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(null), COPIED_RESET_MS);
  };

  return (
    <section id="contact" className="page contact-page scroll-section" aria-labelledby="contact-title">
      <header className="page-intro" data-reveal="heading">
        <h2 id="contact-title" className="page-title">Contact</h2>
      </header>

      <div className="contact-finale" data-reveal="group">
        <div className="contact-finale__main">
          <h3 className="contact-finale__pitch">Got something to ship?</h3>
          <a href={`mailto:${contactInfo.email}`} className="contact-finale__email">
            {emailUser}@<wbr />{emailDomain}
          </a>
          <div className="contact-finale__actions">
            <a href={`mailto:${contactInfo.email}`} className="btn btn--primary">
              <Mail size={20} aria-hidden="true" /> Send an email
            </a>
            <button type="button" className="btn btn--outline" onClick={() => copy("email", contactInfo.email)}>
              {copied === "email" ? <Check size={20} aria-hidden="true" /> : <Copy size={20} aria-hidden="true" />}
              {copied === "email" ? "Copied" : "Copy email"}
            </button>
          </div>
        </div>

        <ul className="contact-channels" aria-label="Other ways to reach me">
          {github && (
            <li className="contact-channel">
              <Github size={24} aria-hidden="true" />
              <div className="contact-channel__text">
                <span className="contact-channel__label">GitHub</span>
                <span className="contact-channel__value">github.com/ransudev</span>
              </div>
              <a href={github.url} target="_blank" rel="noopener noreferrer" className="contact-channel__action" aria-label="Open GitHub profile">
                <ArrowUpRight size={22} aria-hidden="true" />
              </a>
            </li>
          )}
          <li className="contact-channel">
            <MessageCircle size={24} aria-hidden="true" />
            <div className="contact-channel__text">
              <span className="contact-channel__label">Discord</span>
              <span className="contact-channel__value">@{contactInfo.discord}</span>
            </div>
            <button
              type="button"
              className="contact-channel__action"
              aria-label={copied === "discord" ? "Discord username copied" : "Copy Discord username"}
              onClick={() => copy("discord", contactInfo.discord)}
            >
              {copied === "discord" ? <Check size={22} aria-hidden="true" /> : <Copy size={22} aria-hidden="true" />}
            </button>
          </li>
        </ul>

        <p className="sr-only" aria-live="polite">
          {copied === "email" ? "Email address copied" : copied === "discord" ? "Discord username copied" : ""}
        </p>
      </div>
    </section>
  );
}

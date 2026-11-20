"use client";

import { useEffect, useRef, useState } from "react";
import Section from "../../components/retro/Section";
import { RetroImg } from "../../components/retro/Badges";
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
    <Section id="contact" title="Contact" divider="flame">
      <div className="contact">
        <p className="contact__pitch">
          <RetroImg src="/retro/mail.gif" width={34} height={24} /> Got something to ship? E-mail me!!{" "}
          <RetroImg src="/retro/mail.gif" width={34} height={24} />
        </p>
        <p className="contact__email">
          <a href={`mailto:${contactInfo.email}`}>
            {emailUser}@<wbr />{emailDomain}
          </a>
        </p>
        <p className="contact__actions">
          <a href={`mailto:${contactInfo.email}`} className="btn">Send an email</a>
          <button type="button" className="btn" onClick={() => copy("email", contactInfo.email)}>
            {copied === "email" ? "Copied!" : "Copy email"}
          </button>
        </p>
      </div>

      <table className="facts contact__channels">
        <caption>~ other ways to reach me ~</caption>
        <tbody>
          {github && (
            <tr>
              <th scope="row">GitHub</th>
              <td>
                <a href={github.url} target="_blank" rel="noopener noreferrer">
                  github.com/ransudev
                </a>
              </td>
            </tr>
          )}
          <tr>
            <th scope="row">Discord</th>
            <td>
              @{contactInfo.discord}{" "}
              <button
                type="button"
                className="btn btn--small"
                aria-label={copied === "discord" ? "Discord username copied" : "Copy Discord username"}
                onClick={() => copy("discord", contactInfo.discord)}
              >
                {copied === "discord" ? "Copied!" : "Copy"}
              </button>
            </td>
          </tr>
          <tr>
            <th scope="row">Guestbook</th>
            <td>no guestbook yet, so the email up there is the guestbook ✉</td>
          </tr>
        </tbody>
      </table>

      <p className="sr-only" aria-live="polite">
        {copied === "email" ? "Email address copied" : copied === "discord" ? "Discord username copied" : ""}
      </p>
    </Section>
  );
}

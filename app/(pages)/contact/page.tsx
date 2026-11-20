"use client";

import { useEffect, useRef, useState } from "react";
import RetroWindow from "../../components/retro/RetroWindow";
import { Perch } from "../../components/retro/Cats";
import { contactInfo, socialLinks } from "../../data/socials";
import { BackToTop, Divider, RetroImg } from "../../components/retro/Badges";

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
    <section id="contact" className="scroll-section section" aria-labelledby="contact-title">
      <h2 id="contact-title" className="section-title">
        <span aria-hidden="true">✦ </span>Contact<span aria-hidden="true"> ✦</span>
      </h2>
      <Divider kind="paws" />

      <Perch pose="sit" side="left">
        <RetroWindow title="new_message.eml" icon="✉">
          <div className="contact">
            <p className="contact__pitch">
              <RetroImg src="/retro/mail.gif" width={34} height={24} /> Got something to ship? E-mail me!!{" "}
              <RetroImg src="/retro/mail.gif" width={34} height={24} />
            </p>
                      <a href={`mailto:${contactInfo.email}`} className="contact__email">
              {emailUser}@<wbr />{emailDomain}
            </a>
            <div className="contact__actions">
              <a href={`mailto:${contactInfo.email}`} className="btn btn--primary">
                ✉ Send an email
              </a>
              <button type="button" className="btn" onClick={() => copy("email", contactInfo.email)}>
                {copied === "email" ? "✓ Copied!" : "⧉ Copy email"}
              </button>
            </div>
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
                  <span>@{contactInfo.discord}</span>{" "}
                  <button
                    type="button"
                    className="btn btn--small"
                    aria-label={copied === "discord" ? "Discord username copied" : "Copy Discord username"}
                    onClick={() => copy("discord", contactInfo.discord)}
                  >
                    {copied === "discord" ? "✓ Copied" : "⧉ Copy"}
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
        </RetroWindow>
      </Perch>
      <BackToTop />
    </section>
  );
}

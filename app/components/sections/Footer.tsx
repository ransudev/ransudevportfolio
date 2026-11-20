import { socialLinks } from "../../data/socials";
import { lastUpdated } from "../../data/badges";
import { Divider } from "../retro/Badges";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Divider kind="flame" />
      <p className="site-footer__links">
        [{" "}
        {socialLinks.map((social, index) => (
          <span key={social.name}>
            {index > 0 && " | "}
            <a
              href={social.url}
              target={social.url.startsWith("http") ? "_blank" : undefined}
              rel={social.url.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {social.name}
            </a>
          </span>
        ))}
        {" | "}
        <a href="#home">Back to top ▲</a>{" "}
        ]
      </p>
      <p>last updated: {lastUpdated} · best viewed at 800x600 in any browser, honestly</p>
      <p className="site-footer__meta">© {currentYear} ransudev · made by hand (ish)</p>
    </footer>
  );
}

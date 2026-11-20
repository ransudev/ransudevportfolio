"use client";

import { useEffect, useState } from "react";
import RetroWindow from "../retro/RetroWindow";
import HitCounter from "../retro/HitCounter";
import { BlinkieStack, ButtonWall } from "../retro/Badges";

const navLinks = [
  { href: "#home", id: "home", label: "Home" },
  { href: "#projects", id: "projects", label: "Projects" },
  { href: "#skills", id: "skills", label: "Skills" },
  { href: "#about", id: "about", label: "About me" },
  { href: "#contact", id: "contact", label: "Contact" },
];

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("home");

  // Highlight the section that's under the upper part of the viewport.
  useEffect(() => {
    const sections = navLinks
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const updateActiveSection = () => {
      const viewportMarker = window.innerHeight * 0.42;
      const current = sections.reduce((active, section) => {
        return section.getBoundingClientRect().top <= viewportMarker ? section : active;
      }, sections[0]);

      if (current) setActiveSection(current.id);
    };

    let scrollFrame = 0;
    const scheduleActiveSectionUpdate = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        updateActiveSection();
      });
    };

    const observer = new IntersectionObserver(scheduleActiveSectionUpdate, {
      rootMargin: "-38% 0px -58% 0px",
      threshold: 0,
    });

    sections.forEach((section) => observer.observe(section));
    updateActiveSection();

    window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
    window.addEventListener("hashchange", scheduleActiveSectionUpdate);
    window.addEventListener("resize", scheduleActiveSectionUpdate);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", scheduleActiveSectionUpdate);
      window.removeEventListener("hashchange", scheduleActiveSectionUpdate);
      window.removeEventListener("resize", scheduleActiveSectionUpdate);
    };
  }, []);

  // Scroll to the hash on load and on hash changes (old /about style URLs redirect to #about).
  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const scrollToHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    };

    const initialScrollFrame = window.requestAnimationFrame(scrollToHash);
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.cancelAnimationFrame(initialScrollFrame);
      window.removeEventListener("hashchange", scrollToHash);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return (
    <div className="sidebar">
      <nav className="sidenav" aria-label="Primary navigation">
        <p className="sidenav__heading" aria-hidden="true">~ navigate ~</p>
        <ul className="sidenav__list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="sidenav__link"
                aria-current={activeSection === link.id ? "location" : undefined}
              >
                <span className="sidenav__arrow" aria-hidden="true">►</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <aside className="sidebar__extras" aria-label="Site extras">
        <RetroWindow title="status.txt" icon="♪">
          <dl className="status">
            <div>
              <dt>mood:</dt>
              <dd>shipping</dd>
            </div>
            <div>
              <dt>building:</dt>
              <dd>Project L</dd>
            </div>
            <div>
              <dt>open to:</dt>
              <dd>internships &amp; collabs</dd>
            </div>
          </dl>
        </RetroWindow>

        <HitCounter />
        <BlinkieStack />
        <ButtonWall />
      </aside>
    </div>
  );
}

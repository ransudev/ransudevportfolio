"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#home", id: "home", label: "Home" },
  { href: "#projects", id: "projects", label: "Projects" },
  { href: "#skills", id: "skills", label: "Skills" },
  { href: "#about", id: "about", label: "About" },
  { href: "#contact", id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

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

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <a href="#home" className="site-nav__brand" aria-label="Ransu portfolio home">
          ransu.dev
        </a>

        <nav className="site-nav__links" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="site-nav__link"
              aria-current={activeSection === link.id ? "location" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="site-nav__toggle"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!isMenuOpen}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="mobile-nav__link"
            onClick={() => setIsMenuOpen(false)}
            aria-current={activeSection === link.id ? "location" : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

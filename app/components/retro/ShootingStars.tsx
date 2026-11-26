"use client";

import { useEffect, useRef } from "react";

const POOL_SIZE = 3;
const MIN_GAP_MS = 3000;
const MAX_GAP_MS = 8000;
const PAIR_CHANCE = 1 / 6;

// Now and then a star streaks across the banner sky. Off under reduced motion.
// A fixed pool of nodes is recycled (like CursorTrail), and the timer pauses
// while the banner is offscreen or the tab is hidden.
export default function ShootingStars() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const stars = Array.from({ length: POOL_SIZE }, () => {
      const star = document.createElement("span");
      star.className = "shooting-star";
      star.addEventListener("animationend", () => star.classList.remove("is-live"));
      layer.appendChild(star);
      return star;
    });

    let next = 0;
    let timer = 0;
    let onScreen = true;

    const launch = (delay = 0) => {
      const star = stars[next];
      next = (next + 1) % POOL_SIZE;
      const { width, height } = layer.getBoundingClientRect();
      // Start somewhere in the top half, heading down-left like a real meteor.
      star.style.setProperty("--x", `${Math.round(width * (0.25 + Math.random() * 0.7))}px`);
      star.style.setProperty("--y", `${Math.round(height * Math.random() * 0.45)}px`);
      star.style.setProperty("--angle", `${150 + Math.random() * 20}deg`);
      star.style.setProperty("--len", `${Math.round(Math.min(width * 0.35, 120 + Math.random() * 120))}px`);
      star.style.setProperty("--delay", `${delay}ms`);
      star.classList.remove("is-live");
      void star.offsetWidth;
      star.classList.add("is-live");
    };

    const schedule = () => {
      window.clearTimeout(timer);
      if (!onScreen || document.hidden) return;
      const gap = MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS);
      timer = window.setTimeout(() => {
        launch();
        if (Math.random() < PAIR_CHANCE) launch(220);
        schedule();
      }, gap);
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      schedule();
    });
    observer.observe(layer);
    document.addEventListener("visibilitychange", schedule);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      stars.forEach((star) => star.remove());
    };
  }, []);

  return <div ref={layerRef} className="banner__sky" aria-hidden="true" />;
}

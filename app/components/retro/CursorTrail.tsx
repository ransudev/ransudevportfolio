"use client";

import { useEffect, useRef } from "react";

const POOL_SIZE = 18;
const SPAWN_GAP_MS = 28;
const LIFETIME_MS = 650;
const GLYPHS = ["✦", "★", "✧", "·"];

// Sparkles that trail the mouse. Only on fine pointers, and off under reduced motion.
// A fixed pool of nodes is recycled, so a long session never grows the DOM.
export default function CursorTrail() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    if (motionQuery.matches || !pointerQuery.matches) return;

    const sparks = Array.from({ length: POOL_SIZE }, (_, index) => {
      const spark = document.createElement("span");
      spark.className = "trail__spark";
      spark.textContent = GLYPHS[index % GLYPHS.length];
      layer.appendChild(spark);
      return spark;
    });

    let next = 0;
    let lastSpawn = 0;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - lastSpawn < SPAWN_GAP_MS) return;
      lastSpawn = now;

      const spark = sparks[next];
      next = (next + 1) % POOL_SIZE;
      const drift = (Math.random() - 0.5) * 24;
      spark.style.setProperty("--x", `${event.clientX}px`);
      spark.style.setProperty("--y", `${event.clientY}px`);
      spark.style.setProperty("--drift", `${drift}px`);
      spark.style.setProperty("--life", `${LIFETIME_MS}ms`);
      // Restart the animation on a recycled node.
      spark.classList.remove("is-live");
      void spark.offsetWidth;
      spark.classList.add("is-live");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      sparks.forEach((spark) => spark.remove());
    };
  }, []);

  return <div ref={layerRef} className="trail" aria-hidden="true" />;
}

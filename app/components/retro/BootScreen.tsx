"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { RetroImg } from "./Badges";

const MEMORY_KB = 640;
const MEMORY_START_MS = 350;
const MEMORY_RUN_MS = 700;

// Seconds after load each line appears; the CSS does the timing, so the screen
// still plays out and leaves on its own even if this script never runs.
const at = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

// A fake BIOS boot screen, once per browser session. The inline script in
// app/layout.tsx adds `booted` to <html> before paint for return visits,
// deep links and reduced motion, which hides this with CSS (no flash).
export default function BootScreen() {
  const screenRef = useRef<HTMLDivElement>(null);
  const memoryRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const screen = screenRef.current;
    if (!screen || root.classList.contains("booted")) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    let frame = 0;
    const started = performance.now();
    const countMemory = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - started - MEMORY_START_MS) / MEMORY_RUN_MS));
      if (memoryRef.current) memoryRef.current.textContent = `${Math.round(progress * MEMORY_KB)}K`;
      if (progress < 1) frame = requestAnimationFrame(countMemory);
    };
    frame = requestAnimationFrame(countMemory);

    const finish = () => {
      root.classList.add("booted");
      cleanup();
    };
    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.target === screen && event.animationName === "boot-out") finish();
    };

    function cleanup() {
      cancelAnimationFrame(frame);
      body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", finish);
      screen?.removeEventListener("click", finish);
      screen?.removeEventListener("animationend", onAnimationEnd);
    }

    window.addEventListener("keydown", finish);
    screen.addEventListener("click", finish);
    screen.addEventListener("animationend", onAnimationEnd);
    return cleanup;
  }, []);

  return (
    <div ref={screenRef} className="boot" aria-hidden="true">
      <div className="boot__inner">
        <span className="boot__badge">
          <RetroImg src="/retro/cat-sit.gif" width={60} height={56} />
        </span>
        <p className="boot__line" style={at(0.15)}>
          <span className="boot__logo">★</span> RansuOS BIOS v4.0
        </p>
        <p className="boot__line boot__dim" style={at(0.15)}>
          (C) 1998-2026 Ransu Megatrends, Inc.
        </p>
        <p className="boot__line boot__gap" style={at(0.35)}>
          Memory Test: <span ref={memoryRef}>0K</span>
          <span className="boot__line boot__ok" style={at(1.1)}> OK</span>
        </p>
        <p className="boot__line" style={at(1.3)}>Detecting cats.......... 3 found</p>
        <p className="boot__line" style={at(1.65)}>Mounting night sky...... done</p>
        <p className="boot__line boot__gap" style={at(2)}>
          Loading Ransu.dev<span className="boot__cursor">_</span>
        </p>
        <p className="boot__hint">press any key to skip</p>
      </div>
    </div>
  );
}

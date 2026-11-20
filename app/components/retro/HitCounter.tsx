"use client";

import { useSyncExternalStore } from "react";

// The site is static with no backend, so this is a per-browser counter on top of a base number.
// A real shared count would need a small Worker + KV.
const BASE_COUNT = 1337;
const STORAGE_KEY = "ransu-visits";
const DIGITS = 7;

// Count this page load once, however many times React renders.
let visitsThisLoad: number | null = null;

function readCount() {
  if (visitsThisLoad === null) {
    try {
      visitsThisLoad = Number(window.localStorage.getItem(STORAGE_KEY) ?? "0") + 1;
      window.localStorage.setItem(STORAGE_KEY, String(visitsThisLoad));
    } catch {
      // Storage can be blocked (private windows); fall back to one visit.
      visitsThisLoad = 1;
    }
  }
  return BASE_COUNT + visitsThisLoad;
}

const subscribe = () => () => {};

export default function HitCounter() {
  // On the server (and the first client render) there's no storage, so show the base number.
  const count = useSyncExternalStore(subscribe, readCount, () => null);
  const digits = String(count ?? BASE_COUNT).padStart(DIGITS, "0").split("");

  return (
    <div className="counter">
      <p className="counter__label">you are visitor #</p>
      <p className="counter__digits" aria-label={count ? `Visitor number ${count}` : "Visitor counter"}>
        {digits.map((digit, index) => (
          <span key={index} aria-hidden="true">{digit}</span>
        ))}
      </p>
    </div>
  );
}

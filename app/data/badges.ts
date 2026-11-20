// Hand-made 88x31 buttons and blinkies for the 90s homepage look.
// They're drawn in CSS, so there are no third-party GIFs to host.

export interface Button88 {
  top: string;
  bottom: string;
  // Colour scheme, mapped to a CSS modifier class.
  scheme: "oxblood" | "terracotta" | "ink" | "gold" | "blue" | "cream";
  href?: string;
  label?: string;
}

export const buttons88: Button88[] = [
  { top: "RANSU", bottom: ".DEV", scheme: "oxblood", href: "#home", label: "ransu.dev home" },
  { top: "MADE WITH", bottom: "RUST", scheme: "terracotta" },
  { top: "NEXT.JS", bottom: "POWERED", scheme: "ink" },
  { top: "AI", bottom: "ASSISTED", scheme: "gold" },
  { top: "GITHUB", bottom: "@ransudev", scheme: "blue", href: "https://github.com/ransudev", label: "GitHub profile" },
  { top: "BEST VIEWED", bottom: "800x600", scheme: "cream" },
  { top: "NO", bottom: "COOKIES", scheme: "ink" },
  { top: "HTML", bottom: "IS ART", scheme: "terracotta" },
];

export interface Blinkie {
  text: string;
  scheme: "oxblood" | "terracotta" | "gold";
}

export const blinkies: Blinkie[] = [
  { text: "★ break it fix it ship it ★", scheme: "oxblood" },
  { text: "♥ i ♥ windows apis", scheme: "terracotta" },
  { text: "☕ powered by coffee", scheme: "gold" },
  { text: "✦ open to work ✦", scheme: "oxblood" },
];

export const newsItems = [
  "NOW BUILDING: Project L, a desktop dragon with a local AI brain",
  "ShardFlipper is LIVE at shardflipper.vercel.app",
  "new site layout!! (it's 1999 again)",
  "sign... er, email me: ransu.email@gmail.com",
];

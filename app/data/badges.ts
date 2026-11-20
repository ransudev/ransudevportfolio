// 88x31 buttons and blinkies for the 90s homepage look.
// The images are real pixel GIFs drawn by scripts/make-retro-assets.py (nothing is hotlinked).

export interface Button88 {
  src: string;
  alt: string;
  href?: string;
}

export const buttons88: Button88[] = [
  { src: "/retro/88-ransu.gif", alt: "ransu.dev", href: "#home" },
  { src: "/retro/88-rust.gif", alt: "Made with Rust" },
  { src: "/retro/88-nextjs.gif", alt: "Powered by Next.js" },
  { src: "/retro/88-ai.gif", alt: "AI assisted, human made" },
  { src: "/retro/88-github.gif", alt: "GitHub: @ransudev", href: "https://github.com/ransudev" },
  { src: "/retro/88-800x600.gif", alt: "Best viewed at 800x600" },
  { src: "/retro/88-cookies.gif", alt: "No cookies" },
  { src: "/retro/88-html.gif", alt: "HTML is art" },
  { src: "/retro/88-cats.gif", alt: "I love cats" },
];

export interface Blinkie {
  src: string;
  alt: string;
}

export const blinkies: Blinkie[] = [
  { src: "/retro/blinkie-ship.gif", alt: "Break it, fix it, ship it" },
  { src: "/retro/blinkie-windows.gif", alt: "I love Windows APIs" },
  { src: "/retro/blinkie-coffee.gif", alt: "Powered by coffee" },
  { src: "/retro/blinkie-work.gif", alt: "Open to work" },
  { src: "/retro/blinkie-meow.gif", alt: "Meow meow meow" },
];

export const newsItems = [
  "NOW BUILDING: Project L, a desktop dragon with a local AI brain",
  "ShardFlipper is LIVE at shardflipper.vercel.app",
  "new site layout!! (it's 1999 again)",
  "no guestbook yet, so email me instead: ransu.email@gmail.com",
];

// Shown in the footer. Bump it when the site changes.
export const lastUpdated = "November 20, 2026";

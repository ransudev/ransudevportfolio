export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  // Shown on the typographic poster when there's no screenshot yet.
  logoUrl?: string;
  // Poster colour for projects without a screenshot.
  tone?: "blue" | "yellow" | "pink";
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "ShardFlipper",
    description: "A live market tool for Hypixel SkyBlock that matches real-time Bazaar prices to shard fusion recipes, ranking hundreds of fusion paths by profit, margin, and estimated weekly sales, with price-manipulation warnings.",
    techStack: ["Next.js", "TypeScript", "Hypixel API"],
    liveUrl: "https://shardflipper.vercel.app",
    imageUrl: "/projects/shardflipper.webp",
    featured: true,
  },
  {
    id: 2,
    title: "Repeatable",
    description: "A Windows macro recorder and player built in Rust, letting users record mouse and keyboard actions and replay them with adjustable speed, looping, global hotkeys, and both compact and expanded UI modes.",
    techStack: ["Rust", "Windows", "Macro Automation"],
    githubUrl: "https://github.com/ransudev/Repeatable",
    logoUrl: "/projects/repeatable-logo.png",
    tone: "blue",
  },
  {
    id: 3,
    title: "DeskPeek",
    description: "A lightweight Windows tray utility that brings a macOS-style gesture to the desktop: double-click empty desktop space to hide or reveal your icons, with no admin rights needed.",
    techStack: ["C#", ".NET 8", "Windows"],
    githubUrl: "https://github.com/ransudev/DeskPeek",
    tone: "yellow",
  },
  {
    id: 4,
    title: "JellyPiP",
    description: "A client-side Fabric mod that adds picture-in-picture to Minecraft: toggle a borderless, always-on-top mini window with a hotkey, drag it anywhere, and tune size, opacity, and placement.",
    techStack: ["Kotlin", "Fabric Modding", "GLFW"],
    githubUrl: "https://github.com/ransudev/jellypip",
    tone: "pink",
  },
  {
    id: 5,
    title: "StewardshipHub",
    description: "An environmental learning platform built with Next.js and TypeScript, featuring an interactive waste-sorting game, rotating eco facts, and a community gallery for sharing sustainability stories.",
    techStack: ["Next.js", "TypeScript", "Interactive Learning"],
    githubUrl: "https://github.com/ransudev/StewardshipHub",
    liveUrl: "https://stewardship-hub-nine.vercel.app",
    imageUrl: "/projects/stewardshiphub.webp",
  },
];

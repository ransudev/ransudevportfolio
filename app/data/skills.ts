import { Terminal, Layout, Monitor, Gamepad2, Code } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface Skill {
  name: string;
}

export interface SkillCategory {
  category: string;
  icon: LucideIcon;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Languages",
    icon: Code,
    skills: [
      { name: "TypeScript" },
      { name: "Rust" },
      { name: "C#" },
      { name: "Kotlin" },
      { name: "Java" },
      { name: "Python" },
      { name: "SQL" },
    ],
  },
  {
    category: "Web",
    icon: Layout,
    skills: [
      { name: "Next.js" },
      { name: "React" },
      { name: "Tailwind CSS" },
      { name: "HTML & CSS" },
    ],
  },
  {
    category: "Desktop & systems",
    icon: Monitor,
    skills: [
      { name: "Windows APIs" },
      { name: ".NET 8" },
      { name: "GLFW" },
    ],
  },
  {
    category: "Game modding",
    icon: Gamepad2,
    skills: [
      { name: "Fabric" },
      { name: "Minecraft client mods" },
    ],
  },
  {
    category: "Tools",
    icon: Terminal,
    skills: [
      { name: "Git" },
      { name: "VS Code" },
      { name: "MySQL" },
      { name: "Vercel" },
      { name: "AI-assisted development" },
    ],
  },
];

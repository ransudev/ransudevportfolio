import { GraduationCap, MapPin, Code, Sparkles } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface InfoCard {
  title: string;
  value: string;
  icon: LucideIcon;
}

export const aboutParagraphs = [
  "I'm Lance, a computer science student in the Philippines. I build tools that fix annoying problems: take the problem apart, then ship something that works.",
  "I use AI the way I use a debugger: to move faster, not to think for me. I still read the code, and I own what ships.",
];

export const infoCards: InfoCard[] = [
  {
    title: "Studying",
    value: "Computer Science",
    icon: GraduationCap,
  },
  {
    title: "Based in",
    value: "Philippines",
    icon: MapPin,
  },
  {
    title: "Builds",
    value: "Desktop tools, web apps, game mods",
    icon: Code,
  },
  {
    title: "Works with",
    value: "AI as a force multiplier",
    icon: Sparkles,
  },
];

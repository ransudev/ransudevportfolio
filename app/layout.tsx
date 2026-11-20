import type { Metadata } from "next";
import "./globals.css";

// No web fonts: 90s pages used whatever the computer had (Times, Arial, Verdana, Comic Sans).

export const metadata: Metadata = {
  title: "Ransu's Homepage — Lance, Developer",
  description: "Portfolio of Lance, a computer science student who builds desktop tools, web apps and game mods. Break it, fix it, ship it.",
  keywords: ["developer", "portfolio", "web development", "rust", "typescript"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

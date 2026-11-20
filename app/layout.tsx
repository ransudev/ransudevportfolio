import type { Metadata } from "next";
import { Pixelify_Sans, VT323 } from "next/font/google";
import "./globals.css";

const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
});

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
    // Font variables sit on <html> so the :root tokens in tokens.css can resolve them.
    <html lang="en" className={`scroll-smooth ${pixelify.variable} ${vt323.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

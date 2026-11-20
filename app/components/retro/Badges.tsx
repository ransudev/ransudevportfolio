// Tiny pixel GIFs are plain <img> tags (not next/image) so they keep animating and stay crisp.
import type { CSSProperties } from "react";
import { blinkies, buttons88, type Button88 } from "../../data/badges";

interface RetroImgProps {
  src: string;
  width: number;
  height: number;
  alt?: string;
  className?: string;
  style?: CSSProperties;
}

// A pixel GIF at its native size. Empty alt by default, since most of these are decoration.
// Reduced-motion visitors get the still first frame (a .png the asset script writes next to each .gif).
export function RetroImg({ src, width, height, alt = "", className, style }: RetroImgProps) {
  return (
    <picture className={["px", className].filter(Boolean).join(" ")} style={style}>
      <source media="(prefers-reduced-motion: reduce)" srcSet={src.replace(/\.gif$/, ".png")} />
      <img src={src} width={width} height={height} alt={alt} loading="lazy" decoding="async" />
    </picture>
  );
}

export function Button88x31({ button }: { button: Button88 }) {
  if (button.href) {
    const external = button.href.startsWith("http");
    return (
      <a
        href={button.href}
        className="b88"
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        <RetroImg src={button.src} width={88} height={31} alt={button.alt} />
      </a>
    );
  }
  return <RetroImg src={button.src} width={88} height={31} alt={button.alt} className="b88" />;
}

export function ButtonWall() {
  return (
    <div className="b88-wall">
      {buttons88.map((button) => <Button88x31 key={button.src} button={button} />)}
    </div>
  );
}

export function BlinkieStack() {
  return (
    <div className="blinkie-stack">
      {blinkies.map((blinkie) => (
        <RetroImg key={blinkie.src} src={blinkie.src} width={150} height={20} alt={blinkie.alt} className="blinkie" />
      ))}
    </div>
  );
}

export function UnderConstruction() {
  return <RetroImg src="/retro/construction.gif" width={360} height={44} alt="Under construction" className="construction" />;
}

export function SpinStar({ className }: { className?: string }) {
  return <RetroImg src="/retro/star.gif" width={17} height={17} className={className} />;
}

export function NewBadge() {
  return <RetroImg src="/retro/new.gif" width={36} height={17} alt="New!" className="new-badge" />;
}

export type DividerKind = "paws" | "stars" | "beads";

// A repeat-x strip of a small GIF tile, like the image <hr>s of old.
export function Divider({ kind = "stars" }: { kind?: DividerKind }) {
  return <div className={`divider divider--${kind}`} role="presentation" />;
}

export function BackToTop() {
  return (
    <p className="back-to-top">
      <a href="#home">↑ back to top</a>
    </p>
  );
}

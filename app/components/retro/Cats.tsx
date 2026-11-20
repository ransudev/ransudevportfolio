import type { ReactNode } from "react";
import { Divider, RetroImg } from "./Badges";

// Pixel cats drawn by scripts/make-retro-assets.py, shown at 2x so they read at a glance.
// All of them are decoration, so they carry no alt text.

// A tabby that trots back and forth along a trail of paw prints.
// `offset` starts it partway through its walk, so two cats on the page aren't in step.
export function WalkingCat({ offset = 0 }: { offset?: number }) {
  return (
    <div className="catwalk" aria-hidden="true">
      <Divider kind="paws" />
      <span className="catwalk__cat" style={{ animationDelay: `${-offset}s` }}>
        <RetroImg src="/retro/cat-walk.gif" width={64} height={48} />
      </span>
    </div>
  );
}

type CatPose = "sleep" | "sit";

const POSES: Record<CatPose, { src: string; width: number; height: number }> = {
  sleep: { src: "/retro/cat-sleep.gif", width: 82, height: 56 },
  sit: { src: "/retro/cat-sit.gif", width: 60, height: 56 },
};

export function Cat({ pose, className }: { pose: CatPose; className?: string }) {
  const { src, width, height } = POSES[pose];
  return <RetroImg src={src} width={width} height={height} className={className} />;
}

// Sits a cat on top of whatever it wraps, like it's napping on the window.
export function Perch({ pose, side = "right", children }: { pose: CatPose; side?: "left" | "right"; children: ReactNode }) {
  return (
    <div className="perch">
      <span className={`perch__cat perch__cat--${side}`} aria-hidden="true">
        <Cat pose={pose} />
      </span>
      {children}
    </div>
  );
}

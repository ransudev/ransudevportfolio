import type { ReactNode } from "react";
import { BackToTop, Divider, type DividerKind } from "./Badges";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  divider?: DividerKind;
  lede?: ReactNode;
}

// A WordArt heading, an image divider, then a plain bordered panel: one 90s "table" per section.
export default function Section({ id, title, children, divider = "stars", lede }: SectionProps) {
  return (
    <section id={id} className="scroll-section section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="section-title wordart">{title}</h2>
      <Divider kind={divider} />
      {lede && <p className="section-lede">{lede}</p>}
      <div className="panel">{children}</div>
      <BackToTop />
    </section>
  );
}

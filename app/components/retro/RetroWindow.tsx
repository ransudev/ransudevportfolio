import type { ReactNode } from "react";

interface RetroWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
  // An optional little icon in the title bar, e.g. "★" or "✉".
  icon?: string;
  as?: "div" | "section" | "article" | "aside";
  id?: string;
  labelledBy?: string;
}

// A beveled Win9x-style box with a title bar. The _ □ X controls are decoration only.
export default function RetroWindow({
  title,
  children,
  className,
  icon,
  as: Tag = "div",
  id,
  labelledBy,
}: RetroWindowProps) {
  return (
    <Tag id={id} className={["window", className].filter(Boolean).join(" ")} aria-labelledby={labelledBy}>
      <div className="window__bar">
        <span className="window__title">
          {icon && <span className="window__icon" aria-hidden="true">{icon}</span>}
          {title}
        </span>
        <span className="window__controls" aria-hidden="true">
          <span>_</span>
          <span>□</span>
          <span>×</span>
        </span>
      </div>
      <div className="window__body">{children}</div>
    </Tag>
  );
}

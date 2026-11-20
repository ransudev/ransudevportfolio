import { blinkies, buttons88, type Blinkie as BlinkieData, type Button88 } from "../../data/badges";

export function Button88x31({ button }: { button: Button88 }) {
  const content = (
    <>
      <span className="b88__top">{button.top}</span>
      <span className="b88__bottom">{button.bottom}</span>
    </>
  );
  const className = `b88 b88--${button.scheme}`;

  if (button.href) {
    const external = button.href.startsWith("http");
    return (
      <a
        href={button.href}
        className={className}
        aria-label={button.label}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return <span className={className} aria-hidden="true">{content}</span>;
}

export function Blinkie({ blinkie, index = 0 }: { blinkie: BlinkieData; index?: number }) {
  return (
    <span className={`blinkie blinkie--${blinkie.scheme}`} style={{ animationDelay: `${index * -0.35}s` }} aria-hidden="true">
      {blinkie.text}
    </span>
  );
}

export function ButtonWall({ limit }: { limit?: number }) {
  return (
    <div className="b88-wall">
      {buttons88.slice(0, limit).map((button) => (
        <Button88x31 key={`${button.top}-${button.bottom}`} button={button} />
      ))}
    </div>
  );
}

export function BlinkieStack() {
  return (
    <div className="blinkie-stack">
      {blinkies.map((blinkie, index) => (
        <Blinkie key={blinkie.text} blinkie={blinkie} index={index} />
      ))}
    </div>
  );
}

// A small "under construction" sign, drawn in CSS.
export function UnderConstruction() {
  return (
    <div className="construction" aria-hidden="true">
      <span className="construction__stripes" />
      <span className="construction__text">UNDER CONSTRUCTION</span>
      <span className="construction__stripes" />
    </div>
  );
}

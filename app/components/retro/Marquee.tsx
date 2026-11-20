interface MarqueeProps {
  items: string[];
  label: string;
}

// A CSS marquee. The track holds the items twice so the loop is seamless;
// screen readers get one plain list and skip the duplicate.
export default function Marquee({ items, label }: MarqueeProps) {
  const row = (hidden: boolean) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item}>
          <span className="marquee__star" aria-hidden="true">✦</span> {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee" role="region" aria-label={label}>
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { aboutParagraphs, infoCards } from "../../data/about";

export default function AboutPage() {
  return (
    <article id="about" className="page document-page scroll-section" aria-labelledby="about-title">
      <header className="page-intro" data-reveal="heading">
        <h2 id="about-title" className="page-title">About</h2>
      </header>

      <div className="document-page__body">
        <div className="document-page__lead" data-reveal="copy">
          {aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>

        <section className="document-section" aria-labelledby="at-a-glance-title">
          <h3 id="at-a-glance-title" className="document-section__title" data-reveal="title">At a glance</h3>
          <div className="fact-list">
            {infoCards.map((card, index) => (
              <div key={card.title} className="fact-list__row" data-reveal="item" style={{ "--reveal-index": index } as CSSProperties}>
                <span>{card.title}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <p className="document-page__close" data-reveal="copy">
          Got a problem that needs taking apart? {" "}
          <a href="#contact" className="text-link">Start a conversation <ArrowRight size={18} aria-hidden="true" /></a>
        </p>
      </div>
    </article>
  );
}

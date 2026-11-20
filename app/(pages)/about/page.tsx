import Image from "next/image";
import RetroWindow from "../../components/retro/RetroWindow";
import { aboutParagraphs, infoCards } from "../../data/about";
import { BackToTop, Divider } from "../../components/retro/Badges";

export default function AboutPage() {
  return (
    <section id="about" className="scroll-section section" aria-labelledby="about-title">
      <h2 id="about-title" className="section-title">
        <span aria-hidden="true">✦ </span>About Me<span aria-hidden="true"> ✦</span>
      </h2>
      <Divider kind="stars" />

      <RetroWindow title="about_me.txt" icon="☺">
        <div className="about">
          <figure className="about__photo">
            <Image src="/lance-pixel-avatar.png" alt="Pixel portrait of Lance" width={160} height={160} />
            <figcaption>this is me (pixelated)</figcaption>
          </figure>
          <div className="about__copy">
            {aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>

        <table className="facts">
          <caption>~ at a glance ~</caption>
          <tbody>
            {infoCards.map((card) => (
              <tr key={card.title}>
                <th scope="row">{card.title}</th>
                <td>{card.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="about__close">
          Got a problem that needs taking apart? <a href="#contact">Drop me a line ►</a>
        </p>
      </RetroWindow>
      <BackToTop />
    </section>
  );
}

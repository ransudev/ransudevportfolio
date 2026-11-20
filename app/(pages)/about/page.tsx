import Image from "next/image";
import Section from "../../components/retro/Section";
import { aboutParagraphs, infoCards } from "../../data/about";

export default function AboutPage() {
  return (
    <Section id="about" title="About Me" divider="stars">
      <div className="about">
        <figure className="about__photo">
          <Image src="/lance-pixel-avatar.png" alt="Pixel portrait of Lance" width={128} height={128} />
          <figcaption>this is me (pixelated)</figcaption>
        </figure>
        {aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
        Got a problem that needs taking apart? <a href="#contact">Drop me a line!</a>
      </p>
    </Section>
  );
}

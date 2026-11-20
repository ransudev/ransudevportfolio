import HeroLanyard from "../../components/ui/HeroLanyard";
import { SpinStar, UnderConstruction } from "../../components/retro/Badges";

export default function HomePage() {
  return (
    <section id="home" className="scroll-section" aria-labelledby="home-title">
      <div className="panel welcome">
        <div className="welcome__copy">
          <h2 id="home-title" className="welcome__title">
            <SpinStar /> Welcome to my homepage!! <SpinStar />
          </h2>
          <p>
            Hi, I&apos;m <b>Lance</b>, a computer science student from the Philippines. I build desktop tools, web
            apps and game mods. I take the problem apart, then ship something that works.
          </p>
          <p>
            Grab my ID badge and give it a swing, or skip straight to the good stuff:
          </p>
          <p className="welcome__actions">
            <a href="#projects" className="btn">See my projects &gt;&gt;</a>
            <a href="#contact" className="btn">Get in touch</a>
          </p>
          <p className="welcome__construction">
            <UnderConstruction />
          </p>
          <p className="welcome__note">
            <i>this site is always under construction. so am i.</i>
          </p>
        </div>

        <HeroLanyard />
      </div>
    </section>
  );
}

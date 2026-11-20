import HeroLanyard from "../../components/ui/HeroLanyard";
import RetroWindow from "../../components/retro/RetroWindow";
import { SpinStar, UnderConstruction } from "../../components/retro/Badges";

export default function HomePage() {
  return (
    <section id="home" className="scroll-section" aria-labelledby="home-title">
      <RetroWindow title="welcome.html" icon="★" className="welcome-window">
        <div className="welcome">
          <div className="welcome__copy">
            <h2 id="home-title" className="welcome__title">
              <SpinStar /> Welcome 2 my homepage!! <SpinStar />
            </h2>
            <p>
              Hi, I&apos;m <strong>Lance</strong>, a computer science student from the Philippines. I build desktop
              tools, web apps and game mods. I take the problem apart, then ship something that works.
            </p>
            <p>
              Grab my ID badge and give it a swing, or skip straight to the good stuff:
            </p>
            <div className="welcome__actions">
              <a href="#projects" className="btn btn--primary">
                ► See my projects
              </a>
              <a href="#contact" className="btn">
                ✉ Get in touch
              </a>
            </div>
            <p className="welcome__construction">
              <UnderConstruction />
            </p>
            <p className="welcome__note">
              this site is always under construction. so am i.
            </p>
          </div>

          <HeroLanyard />
        </div>
      </RetroWindow>
    </section>
  );
}

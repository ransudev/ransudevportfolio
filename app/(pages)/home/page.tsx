import { ArrowRight } from "lucide-react";
import MarqueeDivider from "../../components/ui/MarqueeDivider";
import HeroDecor from "../../components/ui/HeroDecor";
import HeroLanyard from "../../components/ui/HeroLanyard";

export default function HomePage() {
  return (
    <section id="home" className="neo-hero scroll-section" aria-labelledby="home-title">
      <HeroDecor />
      <div className="page neo-hero__inner">
        <div className="neo-hero__grid">
          <div className="neo-hero__copy">
            <h1 id="home-title">
              <span className="neo-hero__mark">Break it.</span>
              <span className="neo-hero__mark neo-hero__mark--delay">Fix it.</span>
              <span className="neo-hero__mark neo-hero__mark--delay-2">Ship it.</span>
            </h1>
            <div className="neo-hero__actions">
              <a href="#projects" className="btn btn--outline neo-hero__primary-action">
                See the work <ArrowRight size={20} aria-hidden="true" />
              </a>
              <a href="#contact" className="text-link neo-hero__secondary-action">
                Get in touch
              </a>
            </div>
          </div>

          <HeroLanyard />
        </div>
      </div>

      <MarqueeDivider className="neo-strip--hero" />
    </section>
  );
}

import Sidebar from "./components/sections/Sidebar";
import Footer from "./components/sections/Footer";
import Marquee from "./components/retro/Marquee";
import CursorTrail from "./components/retro/CursorTrail";
import { RetroImg, SpinStar } from "./components/retro/Badges";
import { WalkingCat } from "./components/retro/Cats";
import { newsItems } from "./data/badges";
import HomePage from "./(pages)/home/page";
import AboutPage from "./(pages)/about/page";
import SkillsPage from "./(pages)/skills/page";
import ProjectsPage from "./(pages)/projects/page";
import MiscPage from "./(pages)/misc/page";
import ContactPage from "./(pages)/contact/page";

export default function RootPage() {
  return (
    <div className="site">
      <header className="banner">
        <span className="banner__moon" aria-hidden="true">
          <RetroImg src="/retro/banner-moon.gif" width={52} height={52} />
        </span>
        <span className="banner__cat" aria-hidden="true">
          <RetroImg src="/retro/roof-cat.gif" width={36} height={40} />
        </span>
        <p className="banner__stars" aria-hidden="true"><SpinStar />彡</p>
        <h1 className="banner__title">
          <a href="#home">Ransu.dev</a>
        </h1>
        <p className="banner__stars" aria-hidden="true">彡<SpinStar /></p>
      </header>

      <Marquee items={newsItems} label="Site news" />
      <WalkingCat />

      <div className="layout">
        <Sidebar />
        <main id="main-content" className="site-main">
          <HomePage />
          <ProjectsPage />
          <SkillsPage />
          <AboutPage />
          <MiscPage />
          <ContactPage />
        </main>
      </div>

      <Footer />
      <CursorTrail />
    </div>
  );
}

import Sidebar from "./components/sections/Sidebar";
import Footer from "./components/sections/Footer";
import Marquee from "./components/retro/Marquee";
import CursorTrail from "./components/retro/CursorTrail";
import { Divider, SpinStar } from "./components/retro/Badges";
import { newsItems } from "./data/badges";
import HomePage from "./(pages)/home/page";
import AboutPage from "./(pages)/about/page";
import SkillsPage from "./(pages)/skills/page";
import ProjectsPage from "./(pages)/projects/page";
import ContactPage from "./(pages)/contact/page";

export default function RootPage() {
  return (
    <div className="site">
      <header className="banner">
        <SpinStar className="banner__star" />
        <h1 className="banner__title wordart">
          <a href="#home">Ransu.dev</a>
        </h1>
        <SpinStar className="banner__star" />
        <p className="banner__tagline">~*~ Break it. Fix it. Ship it. ~*~</p>
      </header>

      <Marquee items={newsItems} label="Site news" />
      <Divider kind="flame" />

      <div className="layout">
        <Sidebar />
        <main id="main-content" className="site-main">
          <HomePage />
          <ProjectsPage />
          <SkillsPage />
          <AboutPage />
          <ContactPage />
        </main>
      </div>

      <Footer />
      <CursorTrail />
    </div>
  );
}

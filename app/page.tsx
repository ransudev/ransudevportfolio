import Sidebar from "./components/sections/Sidebar";
import Footer from "./components/sections/Footer";
import Marquee from "./components/retro/Marquee";
import CursorTrail from "./components/retro/CursorTrail";
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
        <p className="banner__stars" aria-hidden="true">★彡</p>
        <h1 className="banner__title">
          <a href="#home">Ransu.dev</a>
        </h1>
        <p className="banner__stars" aria-hidden="true">彡★</p>
        <p className="banner__tagline">Break it. Fix it. Ship it.</p>
      </header>

      <Marquee items={newsItems} label="Site news" />

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

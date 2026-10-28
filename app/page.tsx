import Navbar from "./components/sections/Navbar";
import Footer from "./components/sections/Footer";
import MotionObserver from "./components/ui/MotionObserver";
import HomePage from "./(pages)/home/page";
import AboutPage from "./(pages)/about/page";
import SkillsPage from "./(pages)/skills/page";
import ProjectsPage from "./(pages)/projects/page";
import ContactPage from "./(pages)/contact/page";

export default function RootPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="site-main">
        <HomePage />
        <ProjectsPage />
        <SkillsPage />
        <AboutPage />
        <ContactPage />
      </main>
      <MotionObserver />
      <Footer />
    </>
  );
}

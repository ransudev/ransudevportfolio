import RetroWindow from "../../components/retro/RetroWindow";
import { Perch } from "../../components/retro/Cats";
import { skillCategories } from "../../data/skills";
import { BackToTop, Divider } from "../../components/retro/Badges";

export default function SkillsPage() {
  return (
    <section id="skills" className="scroll-section section" aria-labelledby="skills-title">
      <h2 id="skills-title" className="section-title">
        <span aria-hidden="true">✦ </span>My Toolbox<span aria-hidden="true"> ✦</span>
      </h2>
      <Divider kind="beads" />

      <Perch pose="sleep">
        <RetroWindow title="C:\RANSU\TOOLS" icon="▤">
          <div className="toolbox">
            {skillCategories.map((category, index) => (
              <section key={category.category} className="toolbox__group" aria-labelledby={`skill-${index}`}>
                <h3 id={`skill-${index}`} className="toolbox__heading">
                  <span aria-hidden="true">📁 </span>
                  {category.category}
                </h3>
                <ul className="toolbox__list">
                  {category.skills.map((skill) => <li key={skill.name}>{skill.name}</li>)}
                </ul>
              </section>
            ))}
          </div>
        </RetroWindow>
      </Perch>
      <BackToTop />
    </section>
  );
}

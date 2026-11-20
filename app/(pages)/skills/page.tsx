import RetroWindow from "../../components/retro/RetroWindow";
import { skillCategories } from "../../data/skills";

export default function SkillsPage() {
  return (
    <section id="skills" className="scroll-section section" aria-labelledby="skills-title">
      <h2 id="skills-title" className="section-title">
        <span aria-hidden="true">✦ </span>My Toolbox<span aria-hidden="true"> ✦</span>
      </h2>

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
        <p className="toolbox__note">
          These are working tools, not a claim of mastery. I keep the stack lean and add depth where the work demands
          it.
        </p>
      </RetroWindow>
    </section>
  );
}

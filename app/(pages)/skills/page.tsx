import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { skillCategories } from "../../data/skills";

export default function SkillsPage() {
  return (
    <section id="skills" className="page skills-page scroll-section" aria-labelledby="skills-title">
      <header className="page-intro" data-reveal="heading">
        <h2 id="skills-title" className="page-title">Skills</h2>
      </header>

      <div className="skills-index">
        {skillCategories.map((category, index) => (
          <section key={category.category} className="skill-group" aria-labelledby={`skill-${index}`} data-reveal="item" style={{ "--reveal-index": index } as CSSProperties}>
            <div className="skill-group__head">
              <h3 id={`skill-${index}`}>{category.category}</h3>
            </div>
            <ul className="skill-group__list">
              {category.skills.map((skill) => <li key={skill.name}>{skill.name}</li>)}
            </ul>
          </section>
        ))}
      </div>

      <div className="skills-page__close" data-reveal="copy">
        <p>These are working tools, not a claim of mastery. I keep the stack lean and add depth where the work demands it.</p>
        <a href="#contact" className="btn btn--primary">Start a conversation <ArrowRight size={20} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

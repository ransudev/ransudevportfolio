import Section from "../../components/retro/Section";
import { skillCategories } from "../../data/skills";

export default function SkillsPage() {
  return (
    <Section id="skills" title="My Toolbox" divider="beads">
      <table className="toolbox">
        <tbody>
          {skillCategories.map((category) => (
            <tr key={category.category}>
              <th scope="row">{category.category}</th>
              <td>
                <ul>
                  {category.skills.map((skill) => <li key={skill.name}>{skill.name}</li>)}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="toolbox__note">
        <i>
          These are working tools, not a claim of mastery. I keep the stack lean and add depth where the work
          demands it.
        </i>
      </p>
    </Section>
  );
}

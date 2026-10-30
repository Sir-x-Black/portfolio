import type { SiteContent } from '../content/types';
import { Annotated } from './Annotated';
import { Rich } from './Rich';

export function Skills({ content }: { content: SiteContent }) {
  const { skills } = content;
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <Annotated notes={[]}>
        <h2 id="skills-title" className="section__title">
          {skills.heading}
        </h2>
        <p className="section__intro">
          <Rich text={skills.intro} />
        </p>
        <dl className="skills">
          {skills.groups.map((group) => (
            <div key={group.label} className="skills__group">
              <dt>{group.label}</dt>
              <dd>
                <ul className="inline-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Annotated>
    </section>
  );
}

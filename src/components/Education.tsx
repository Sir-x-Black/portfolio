import type { SiteContent } from '../content/types';
import { Annotated } from './Annotated';

export function Education({ content }: { content: SiteContent }) {
  const { education } = content;
  return (
    <section id="education" className="section" aria-labelledby="education-title">
      <Annotated notes={[]}>
        <h2 id="education-title" className="section__title">
          {education.heading}
        </h2>
        <ul className="education">
          {education.items.map((item) => (
            <li key={item.title}>
              <span className="education__title">{item.title}</span>
              <span className="education__school">
                {item.school}
                {item.status ? `. ${item.status}.` : null}
              </span>
            </li>
          ))}
        </ul>
        <h3 className="subsection__title">{education.languagesHeading}</h3>
        <dl className="languages">
          {education.languages.map((language) => (
            <div key={language.name}>
              <dt>{language.name}</dt>
              <dd>{language.level}</dd>
            </div>
          ))}
        </dl>
      </Annotated>
    </section>
  );
}

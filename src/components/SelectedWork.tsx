import type { SiteContent } from '../content/types';
import { Annotated } from './Annotated';
import { Rich } from './Rich';

export function SelectedWork({ content }: { content: SiteContent }) {
  const { work } = content;
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <Annotated notes={[]}>
        <h2 id="work-title" className="section__title">
          {work.heading}
        </h2>
        <p className="section__intro">
          <Rich text={work.intro} />
        </p>
      </Annotated>
      {work.cases.map((study) => {
        const headingId = `case-${study.id}`;
        return (
          <Annotated key={study.id} notes={study.notes} as="article" className="case" labelledBy={headingId}>
            <h3 id={headingId} className="case__title">
              {study.title}
            </h3>
            <p className="case__kind">{study.kind}</p>
            {study.sections.map((section) => (
              <p key={section.label} className="case__section">
                <span className="case__label">{section.label}.</span> <Rich text={section.body} />
              </p>
            ))}
            {study.links.length > 0 && (
              <ul className="case__links">
                {study.links.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} rel="external">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Annotated>
        );
      })}
    </section>
  );
}

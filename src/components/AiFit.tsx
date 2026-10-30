import type { SiteContent } from '../content/types';
import { Annotated } from './Annotated';
import { Rich } from './Rich';

/**
 * Task-to-evidence mapping. A list of headed items rather than a <table>: it reads
 * as a table on wide screens, and keeps its semantics when it stacks on phones
 * (Safari drops table roles once table elements are restyled as blocks). Each
 * task is an h3, so screen-reader users can move between tasks by heading.
 */
export function AiFit({ content }: { content: SiteContent }) {
  const { aiFit } = content;
  return (
    <section id="ai-training" className="section" aria-labelledby="ai-training-title">
      <Annotated notes={aiFit.notes}>
        <h2 id="ai-training-title" className="section__title">
          {aiFit.heading}
        </h2>
        <p className="section__intro">
          <Rich text={aiFit.intro} />
        </p>
        <div className="fit">
          <div className="fit__head" aria-hidden="true">
            <span>
              {aiFit.columns.task}
              <span className="fit__head-sub">{aiFit.columns.needs}</span>
            </span>
            <span>{aiFit.columns.evidence}</span>
          </div>
          <ul className="fit__rows">
            {aiFit.rows.map((row) => (
              <li key={row.task} className="fit__row">
                <div className="fit__task">
                  <h3 className="fit__name">{row.task}</h3>
                  <p className="fit__needs">
                    <span className="visually-hidden">{aiFit.columns.needs}: </span>
                    <Rich text={row.needs} />
                  </p>
                </div>
                <p className="fit__evidence">
                  <span className="fit__evidence-label">{aiFit.columns.evidence}: </span>
                  <Rich text={row.evidence} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Annotated>
    </section>
  );
}

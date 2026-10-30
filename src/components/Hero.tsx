import { facts } from '../content/facts';
import type { SiteContent } from '../content/types';
import { withBase } from '../lib/paths';
import { cvOf } from '../lib/routes';
import { Annotated } from './Annotated';
import { Icon } from './Icon';
import { ReviewNotes, ReviewSheet } from './ReviewSheet';
import { Rich } from './Rich';

export function Hero({ content }: { content: SiteContent }) {
  const { hero } = content;
  const evidenceUrl = facts.links.source ? `${facts.links.source}/tree/main/evidence/spring-security-review` : null;

  return (
    <section className="hero" aria-labelledby="hero-name">
      <Annotated
        notes={[]}
        className="hero__intro"
        marginStart={
          <div className="hero__facts">
            <h2 className="visually-hidden">{hero.factsLabel}</h2>
            <ul>
              {hero.facts.map((fact) => (
                <li key={fact}>
                  <Rich text={fact} />
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <h1 id="hero-name" className="hero__name">
          {hero.name}
        </h1>
        <p className="hero__role">{hero.role}</p>
        <p className="hero__thesis">{hero.thesis}</p>
        <p className="hero__lede">
          <Rich text={hero.intro} />
        </p>
        <ul className="hero__actions">
          <li>
            <a className="button button--primary" href={`mailto:${facts.email}`}>
              <Icon name="mail" />
              {hero.actions.email}
            </a>
          </li>
          <li>
            <a className="button" href={withBase(cvOf(content.locale).path)}>
              <Icon name="file" />
              {hero.actions.cv}
            </a>
          </li>
          <li>
            <a className="text-link" href={facts.links.linkedin}>
              <Icon name="linkedin" />
              {hero.actions.linkedin}
            </a>
          </li>
          <li>
            <a className="text-link" href={facts.links.github}>
              <Icon name="github" />
              {hero.actions.github}
            </a>
          </li>
        </ul>
      </Annotated>

      <Annotated notes={[]} className="hero__review" marginStart={<ReviewNotes content={content} />}>
        <ReviewSheet content={content} evidenceUrl={evidenceUrl} />
      </Annotated>
    </section>
  );
}

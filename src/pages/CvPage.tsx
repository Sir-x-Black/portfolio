import { facts } from '../content/facts';
import type { SiteContent } from '../content/types';
import { Icon } from '../components/Icon';
import { Rich } from '../components/Rich';
import { formatMonth, isoMonth } from '../lib/dates';
import { withBase } from '../lib/paths';
import { homeOf } from '../lib/routes';

const display = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '');

/** A print-friendly résumé built from the same content as the portfolio. No phone number or street address. */
export function CvPage({ content }: { content: SiteContent }) {
  const { cv, experience, skills, education, hero, ui } = content;
  return (
    <main id="main" className="cv" tabIndex={-1}>
      <header className="cv__header">
        <div className="cv__tools">
          <a className="text-link" href={withBase(homeOf(content.locale).path)}>
            {cv.back}
          </a>
          <button type="button" className="button" data-print="" hidden>
            <Icon name="print" />
            {cv.print}
          </button>
        </div>
        <h1 className="cv__name">{facts.name.full}</h1>
        <p className="cv__role">{hero.role}</p>
        <ul className="cv__contact">
          <li>
            <a href={`mailto:${facts.email}`}>{facts.email}</a>
          </li>
          <li>
            <a href={facts.links.linkedin}>{display(facts.links.linkedin)}</a>
          </li>
          <li>
            <a href={facts.links.github}>{display(facts.links.github)}</a>
          </li>
          <li>
            {facts.location.city}, {facts.location.country}
          </li>
        </ul>
      </header>

      <section className="cv__section" aria-labelledby="cv-summary">
        <h2 id="cv-summary">{cv.summaryHeading}</h2>
        <p>
          <Rich text={cv.summary} />
        </p>
      </section>

      <section className="cv__section" aria-labelledby="cv-experience">
        <h2 id="cv-experience">{cv.experienceHeading}</h2>
        {experience.roles.map((role) => (
          <article key={role.id} className="cv__role-entry">
            <h3>
              {role.title}, {role.org}
            </h3>
            <p className="cv__meta">
              <time dateTime={isoMonth(role.start)}>{formatMonth(role.start, ui)}</time>
              {' – '}
              {role.end ? <time dateTime={isoMonth(role.end)}>{formatMonth(role.end, ui)}</time> : ui.present}
              {', '}
              {role.location}
            </p>
            {role.context && (
              <p>
                <Rich text={role.context} />
              </p>
            )}
            <ul>
              {role.bullets.map((bullet) => (
                <li key={bullet}>
                  <Rich text={bullet} />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="cv__section" aria-labelledby="cv-project">
        <h2 id="cv-project">{cv.projectsHeading}</h2>
        <p>
          <Rich text={cv.project} />
        </p>
      </section>

      <section className="cv__section" aria-labelledby="cv-skills">
        <h2 id="cv-skills">{cv.skillsHeading}</h2>
        <dl className="cv__skills">
          {skills.groups.map((group) => (
            <div key={group.label}>
              <dt>{group.label}</dt>
              <dd>{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="cv__section" aria-labelledby="cv-education">
        <h2 id="cv-education">{cv.educationHeading}</h2>
        <ul className="cv__plain">
          {education.items.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>, {item.school}
              {item.status ? `. ${item.status}.` : ''}
            </li>
          ))}
        </ul>
      </section>

      <section className="cv__section" aria-labelledby="cv-languages">
        <h2 id="cv-languages">{cv.languagesHeading}</h2>
        <ul className="cv__plain">
          {education.languages.map((language) => (
            <li key={language.name}>
              <strong>{language.name}</strong>: {language.level}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

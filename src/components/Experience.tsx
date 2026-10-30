import type { CSSProperties } from 'react';
import type { Role, SiteContent, YearMonth } from '../content/types';
import { buildMonth, formatMonth, fromIndex, isoMonth, monthSpan, toIndex } from '../lib/dates';
import { Annotated } from './Annotated';
import { Rich } from './Rich';

/** Roles on a shared time axis, drawn to scale from the first role to the build month. */
function Timeline({ roles, content }: { roles: Role[]; content: SiteContent }) {
  const first = fromIndex(Math.min(...roles.map((role) => toIndex(role.start))));
  const total = monthSpan(first, buildMonth);
  const offset = (date: YearMonth) => ((monthSpan(first, date) - 1) / total) * 100;
  const years: number[] = [];
  for (let year = first.year + 1; year <= buildMonth.year; year++) years.push(year);

  return (
    <figure className="timeline" aria-hidden="true">
      <div className="timeline__rows">
        {roles.map((role) => {
          const end = role.end ?? buildMonth;
          const style = {
            '--x': `${offset(role.start).toFixed(2)}%`,
            '--w': `${((monthSpan(role.start, end) / total) * 100).toFixed(2)}%`,
          } as CSSProperties;
          return (
            <div key={role.id} className="timeline__row">
              <span className="timeline__label">{role.short}</span>
              <span className="timeline__track">
                <span className={`timeline__bar${role.end ? '' : ' is-current'}`} style={style} />
              </span>
            </div>
          );
        })}
      </div>
      <div className="timeline__axis">
        <span className="timeline__label" />
        <span className="timeline__track">
          {years.map((year) => (
            <span key={year} className="timeline__tick" style={{ '--x': `${offset({ year, month: 1 }).toFixed(2)}%` } as CSSProperties}>
              {year}
            </span>
          ))}
        </span>
      </div>
      <figcaption className="timeline__caption">{content.experience.timelineNote}</figcaption>
    </figure>
  );
}

function RoleEntry({ role, content }: { role: Role; content: SiteContent }) {
  const headingId = `role-${role.id}`;
  return (
    <Annotated notes={role.notes} as="article" className="role" labelledBy={headingId}>
      <h3 id={headingId} className="role__title">
        {role.title}
        <span className="role__org">{role.org}</span>
      </h3>
      <p className="role__meta">
        <time dateTime={isoMonth(role.start)}>{formatMonth(role.start, content.ui)}</time>
        {' – '}
        {role.end ? <time dateTime={isoMonth(role.end)}>{formatMonth(role.end, content.ui)}</time> : content.ui.present}
        {', '}
        {role.location}
      </p>
      {role.context && (
        <p className="role__context">
          <Rich text={role.context} />
        </p>
      )}
      <ul className="role__bullets">
        {role.bullets.map((bullet) => (
          <li key={bullet}>
            <Rich text={bullet} />
          </li>
        ))}
      </ul>
    </Annotated>
  );
}

export function Experience({ content }: { content: SiteContent }) {
  const { experience } = content;
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <Annotated notes={[experience.thread]}>
        <h2 id="experience-title" className="section__title">
          {experience.heading}
        </h2>
        <Timeline roles={experience.roles} content={content} />
      </Annotated>
      {experience.roles.map((role) => (
        <RoleEntry key={role.id} role={role} content={content} />
      ))}
    </section>
  );
}

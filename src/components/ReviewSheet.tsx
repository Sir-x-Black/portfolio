import { Fragment, type ReactNode } from 'react';
import { answerLines, lineText, reviewedLines, type CodeLine, type Mark } from '../content/review-sample';
import type { SiteContent } from '../content/types';
import { handMark } from '../lib/handmark';
import { Icon } from './Icon';
import { Rich } from './Rich';

type View = 'answer' | 'reviewed';

const SYNTAX = /(@[A-Za-z]+)|("[^"]*")|\b(import|public|class|extends|protected|void|throws|return|new)\b/g;

/** Minimal, monochrome emphasis: keywords and annotations recede, strings are tinted. */
function highlight(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(SYNTAX)) {
    const [whole, annotation, string] = match;
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const kind = annotation ? 'an' : string ? 'st' : 'kw';
    nodes.push(
      <span key={match.index} className={`tk-${kind}`}>
        {whole}
      </span>,
    );
    last = match.index + whole.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function MarkedToken({ mark, part }: { mark: Mark; part: number }) {
  const ink = handMark(mark.text.length, mark.style, mark.issue * 97 + part * 13 + mark.text.length);
  return (
    <mark className={`mk mk--${mark.style}`} data-issue={mark.issue} data-part={part}>
      {highlight(mark.text)}
      <svg
        className="mk__ink"
        width={`${ink.widthEm}em`}
        height={`${ink.heightEm}em`}
        viewBox={ink.viewBox}
        aria-hidden="true"
        focusable="false"
      >
        <path d={ink.d} pathLength={1} />
      </svg>
    </mark>
  );
}

/** Numbers each mark within its issue (issue 3 has two), in reading order. */
function numberMarks(lines: CodeLine[]): Map<Mark, number> {
  const parts = new Map<Mark, number>();
  const count = new Map<number, number>();
  for (const line of lines) {
    for (const segment of line.segments) {
      if (typeof segment === 'string') continue;
      const part = (count.get(segment.issue) ?? 0) + 1;
      count.set(segment.issue, part);
      parts.set(segment, part);
    }
  }
  return parts;
}

function Lines({ lines, other, view }: { lines: CodeLine[]; other: CodeLine[]; view: View }) {
  const parts = numberMarks(lines);
  return (
    <code className="code__lines">
      {lines.map((line, index) => {
        const firstMark = line.segments.find((segment): segment is Mark => typeof segment !== 'string');
        const badge = view === 'answer' ? firstMark?.issue : line.resolves;
        const counterpart = other[index];
        // Lines identical in both views swap instantly; the rest are rewritten in sequence.
        const differs = !counterpart || lineText(counterpart) !== lineText(line) || Boolean(firstMark) || Boolean(line.changed);
        return (
          <span
            key={index}
            className="line"
            data-changed={view === 'reviewed' && line.changed ? '' : undefined}
            data-diff={differs ? '' : undefined}
          >
            <span className="line__no" aria-hidden="true">
              {index + 1}
            </span>
            <span className="line__gutter" aria-hidden="true">
              {badge !== undefined ? (
                <span className={`badge badge--${view}`} data-issue={badge} data-part={firstMark ? parts.get(firstMark) : undefined}>
                  {badge}
                </span>
              ) : view === 'reviewed' && line.changed ? (
                '+'
              ) : null}
            </span>
            <span className="line__code">
              {line.segments.map((segment, s) =>
                typeof segment === 'string' ? (
                  <Fragment key={s}>{highlight(segment)}</Fragment>
                ) : (
                  <MarkedToken key={s} mark={segment} part={parts.get(segment) ?? 1} />
                ),
              )}
            </span>
          </span>
        );
      })}
    </code>
  );
}

function Rubric({ review, ui }: { review: SiteContent['review']; ui: SiteContent['ui'] }) {
  return (
    <div className="rubric">
      <h3 className="rubric__title">{review.rubricTitle}</h3>
      <dl className="rubric__list">
        {review.rubric.map((criterion) => (
          <div key={criterion.label} className="rubric__row">
            <dt>{criterion.label}</dt>
            {(['answer', 'reviewed'] as const).map((view) => {
              const result = criterion[view];
              return (
                <dd key={view} className={`rubric__result is-${result.pass ? 'pass' : 'fail'}`} data-view={view}>
                  <Icon name={result.pass ? 'check' : 'cross'} />
                  <span>
                    {result.pass ? ui.yes : ui.no}
                    {result.detail ? `, ${result.detail}` : ''}
                  </span>
                </dd>
              );
            })}
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ReviewSheet({ content, evidenceUrl }: { content: SiteContent; evidenceUrl: string | null }) {
  const { review, ui } = content;
  return (
    <figure className="sheet" data-review="" aria-labelledby="review-title">
      <figcaption className="sheet__caption">
        <h2 id="review-title" className="sheet__title">
          {review.title}
        </h2>
        <p className="sheet__disclaimer">
          <Rich text={review.disclaimer} />
        </p>
      </figcaption>

      <p className="sheet__prompt">
        <span className="sheet__prompt-label">{review.promptLabel}</span> <Rich text={review.prompt} />
      </p>

      <fieldset className="switch">
        <legend className="switch__legend">{review.viewLegend}</legend>
        {(['answer', 'reviewed'] as const).map((view) => (
          <label key={view} className="switch__option">
            <input type="radio" name="review-view" value={view} defaultChecked={view === 'answer'} />
            <span>{review.views[view]}</span>
          </label>
        ))}
      </fieldset>

      {/* lib/enhance.ts makes this focusable only while it actually scrolls sideways. */}
      <div className="code" role="region" aria-label={review.codeLabel} data-scroller="">
        <div className="code__stack">
          <pre className="code__view" data-view="answer" lang="en" translate="no">
            <Lines lines={answerLines} other={reviewedLines} view="answer" />
          </pre>
          <pre className="code__view" data-view="reviewed" lang="en" translate="no">
            <Lines lines={reviewedLines} other={answerLines} view="reviewed" />
          </pre>
        </div>
      </div>
      <p className="sheet__excerpt">{review.excerptNote}</p>

      <Rubric review={review} ui={ui} />

      <p className="verdict">
        <span className="verdict__label">{review.verdictLabel}</span>{' '}
        <span data-view="answer">
          <Rich text={review.verdict.answer} />
        </span>
        <span data-view="reviewed">
          <Rich text={review.verdict.reviewed} />
        </span>
      </p>
      <p className="sheet__verification">
        <Rich text={review.verification} />
        {evidenceUrl && (
          <>
            {' '}
            <a href={evidenceUrl}>{review.evidenceLink}</a>
          </>
        )}
      </p>
    </figure>
  );
}

export function ReviewNotes({ content }: { content: SiteContent }) {
  const { review } = content;
  return (
    <div className="review-notes">
      <h3 className="review-notes__title">{review.notesTitle}</h3>
      <ol className="review-notes__list">
        {review.issues.map((issue) => (
          <li key={issue.id} className="issue" data-issue={issue.id}>
            <span className="badge badge--answer" aria-hidden="true">
              {issue.id}
            </span>
            <p className="issue__title">
              <Rich text={issue.title} />
            </p>
            <p className="issue__body">
              <Rich text={issue.body} />
            </p>
            <p className="issue__source">
              {review.sourcePrefix} <a href={issue.source.href}>{issue.source.label}</a>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { answerLines, lineText, reviewedLines } from '../src/content/review-sample';
import { handMark } from '../src/lib/handmark';

/** The Java file as the site shows it: no package line, no Spring imports, single blank lines. */
function displayed(file: string): string[] {
  const lines = readFileSync(new URL(`../evidence/spring-security-review/cases/${file}/SecurityConfig.java`, import.meta.url), 'utf8')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !line.startsWith('package ') && !line.startsWith('import org.springframework.'));
  const collapsed: string[] = [];
  for (const line of lines) {
    if (line === '' && (collapsed.length === 0 || collapsed.at(-1) === '')) continue;
    collapsed.push(line);
  }
  while (collapsed.at(-1) === '') collapsed.pop();
  return collapsed;
}

describe('review example', () => {
  it('shows exactly the model answer that was compiled', () => {
    expect(answerLines.map(lineText)).toEqual(displayed('answer'));
  });

  it('shows exactly the corrected version that was compiled', () => {
    expect(reviewedLines.map(lineText)).toEqual(displayed('reviewed'));
  });

  it('marks each of the four issues at least once, in reading order', () => {
    const issues = answerLines.flatMap((line) => line.segments.flatMap((segment) => (typeof segment === 'string' ? [] : [segment.issue])));
    expect(new Set(issues)).toEqual(new Set([1, 2, 3, 4]));
    expect(issues).toEqual([1, 2, 3, 4, 3]);
  });

  it('points each fix at an issue, once per issue', () => {
    const resolved = reviewedLines.flatMap((line) => (line.resolves ? [line.resolves] : []));
    expect(resolved).toEqual([1, 2, 3, 4]);
  });

  it('generates the same hand-drawn mark on every build', () => {
    expect(handMark(13, 'circle', 7)).toEqual(handMark(13, 'circle', 7));
    expect(handMark(13, 'circle', 7).d).not.toEqual(handMark(13, 'circle', 8).d);
  });
});

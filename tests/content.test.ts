import { describe, expect, it } from 'vitest';
import { en } from '../src/content/en';
import { es } from '../src/content/es';
import { facts } from '../src/content/facts';
import type { Note, Rich, SiteContent } from '../src/content/types';
import { normalizeAnchor } from '../src/components/Rich';

/** Shape of a value: same keys, same array lengths, same primitive types. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shape(inner)]));
  }
  return typeof value;
}

const anchorsIn = (texts: Rich[]): string[] =>
  texts.flatMap((text) => [...text.matchAll(/==(.+?)==/g)].map((match) => normalizeAnchor(match[1]!)));

/** Every annotated block: the rich texts in its main column and its margin notes. */
function blocks(content: SiteContent): { name: string; texts: Rich[]; notes: Note[] }[] {
  return [
    { name: 'aiFit', texts: [content.aiFit.intro, ...content.aiFit.rows.flatMap((row) => [row.needs, row.evidence])], notes: content.aiFit.notes },
    ...content.experience.roles.map((role) => ({
      name: `role ${role.id}`,
      texts: [role.context ?? '', ...role.bullets],
      notes: role.notes,
    })),
    ...content.work.cases.map((study) => ({
      name: `case ${study.id}`,
      texts: study.sections.map((section) => section.body),
      notes: study.notes,
    })),
  ];
}

describe('locales', () => {
  it('have exactly the same structure in English and Spanish', () => {
    expect(shape(es)).toEqual(shape(en));
  });

  it('take every date from the shared facts, so the languages cannot disagree', () => {
    for (const content of [en, es]) {
      const [ntt, cumbresoft, municipality] = content.experience.roles;
      expect(ntt).toMatchObject(facts.roles.ntt);
      expect(cumbresoft).toMatchObject(facts.roles.cumbresoft);
      expect(municipality).toMatchObject(facts.roles.municipality);
    }
  });

  it('state the same numbers in both languages', () => {
    // Every number anywhere in the content, with thousands separators removed
    // ("13,000" and "13.000" are the same). Sorted, because word order differs.
    const numbers = (content: SiteContent) =>
      (JSON.stringify(content).match(/\d[\d.,]*\d|\d/g) ?? []).map((n) => n.replace(/[.,](?=\d{3}\b)/g, '')).sort();
    expect(numbers(es)).toEqual(numbers(en));
  });
});

describe('margin notes', () => {
  for (const content of [en, es]) {
    for (const block of blocks(content)) {
      it(`${content.locale} ${block.name}: every anchored note has its phrase, and every phrase has a note`, () => {
        const phrases = anchorsIn(block.texts);
        const anchored = block.notes.filter((note) => note.anchor).map((note) => normalizeAnchor(note.anchor!));
        expect([...phrases].sort()).toEqual([...anchored].sort());
      });
    }
  }
});

describe('honesty guards', () => {
  const everything = (content: SiteContent) => JSON.stringify(content).toLowerCase();

  it('never claims bilingual English; the résumé says B2', () => {
    for (const content of [en, es]) {
      expect(everything(content)).not.toMatch(/bilingual|biling[üu]e|fluent|fluido|nativo en ingl|native english/);
      expect(everything(content)).toContain('b2');
    }
  });

  it('does not use the title "ingeniero" in Spanish, which is regulated and not held', () => {
    expect(everything(es)).not.toMatch(/\bingeniero\b/);
  });

  it('does not claim AI-training or machine-learning experience', () => {
    expect(everything(en)).not.toMatch(/\b(ai|ml) (expert|engineer)\b|experience (training|fine-tuning) (models|llms)/);
    expect(everything(en)).toContain('i haven’t worked on an ai training project yet');
    expect(everything(es)).toContain('todavía no trabajé en un proyecto de entrenamiento de ia');
  });

  it('does not overstate what the résumé supports', () => {
    // Each pattern was a real overstatement caught in review: the résumé never says
    // "daily", there is no AI-training work (paid or not), and the task mapping shows
    // the closest experience, not tasks already done.
    for (const content of [en, es]) {
      expect(everything(content)).not.toMatch(/\bdaily\b|\bdiari[oa]\b/);
      expect(everything(content)).not.toMatch(/paid ai|proyectos pagos/);
      expect(everything(content)).not.toMatch(/already do it|ya lo hago/);
    }
  });

  it('labels the review example as constructed, not client work', () => {
    expect(en.review.disclaimer).toMatch(/constructed example/i);
    expect(es.review.disclaimer).toMatch(/ejemplo construido/i);
  });
});

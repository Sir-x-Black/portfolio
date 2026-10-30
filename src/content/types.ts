export type Locale = 'en' | 'es';

/**
 * Inline markup used in content strings, parsed by <Rich>:
 *   `code`        inline code
 *   [label](url)  link
 *   ==phrase==    phrase annotated by the margin note of the same block
 *   **text**      strong
 */
export type Rich = string;

export type NoteKind = 'gloss' | 'public' | 'private' | 'claim';

export interface Note {
  kind: NoteKind;
  lead: string;
  body: Rich;
  /** Text of the ==phrase== this note annotates, if any. Matched case-insensitively. */
  anchor?: string;
}

export interface Link {
  label: string;
  href: string;
}

export interface YearMonth {
  year: number;
  /** 1–12 */
  month: number;
}

export interface Role {
  id: string;
  title: string;
  org: string;
  /** Short organisation name for the timeline. */
  short: string;
  location: string;
  start: YearMonth;
  /** null while the role is current */
  end: YearMonth | null;
  context?: Rich;
  bullets: Rich[];
  notes: Note[];
}

export interface CaseSection {
  label: string;
  body: Rich;
}

export interface CaseStudy {
  id: string;
  title: string;
  kind: string;
  sections: CaseSection[];
  links: Link[];
  notes: Note[];
}

export interface ReviewIssue {
  id: number;
  title: Rich;
  body: Rich;
  source: Link;
}

export interface RubricCriterion {
  label: string;
  answer: { pass: boolean; detail?: string };
  reviewed: { pass: boolean; detail?: string };
}

export interface SiteContent {
  locale: Locale;
  meta: {
    title: string;
    description: string;
    ogImageAlt: string;
    cvTitle: string;
    cvDescription: string;
    notFoundTitle: string;
  };
  ui: {
    skipToContent: string;
    primaryNav: string;
    nav: { aiFit: string; experience: string; work: string; contact: string };
    cvLink: string;
    otherLanguage: { label: string; name: string };
    yes: string;
    no: string;
    present: string;
    months: readonly [string, string, string, string, string, string, string, string, string, string, string, string];
  };
  hero: {
    name: string;
    role: string;
    thesis: string;
    intro: Rich;
    actions: { email: string; cv: string; linkedin: string; github: string };
    factsLabel: string;
    facts: Rich[];
  };
  review: {
    title: string;
    disclaimer: Rich;
    promptLabel: string;
    prompt: Rich;
    viewLegend: string;
    views: { answer: string; reviewed: string };
    codeLabel: string;
    excerptNote: string;
    notesTitle: string;
    sourcePrefix: string;
    issues: ReviewIssue[];
    rubricTitle: string;
    rubric: RubricCriterion[];
    verdictLabel: string;
    verdict: { answer: Rich; reviewed: Rich };
    verification: Rich;
    /** Label of the link to the compile check; shown only once the repository is public. */
    evidenceLink: string;
  };
  aiFit: {
    heading: string;
    intro: Rich;
    columns: { task: string; needs: string; evidence: string };
    rows: { task: string; needs: Rich; evidence: Rich }[];
    notes: Note[];
  };
  experience: {
    heading: string;
    timelineLabel: string;
    timelineNote: string;
    roles: Role[];
    thread: Note;
  };
  work: {
    heading: string;
    intro: Rich;
    cases: CaseStudy[];
  };
  skills: {
    heading: string;
    intro: Rich;
    groups: { label: string; items: string[] }[];
  };
  education: {
    heading: string;
    items: { title: string; school: string; status?: string }[];
    languagesHeading: string;
    languages: { name: string; level: string }[];
  };
  contact: {
    heading: string;
    intro: Rich;
    copy: string;
    copied: string;
    copyFailed: string;
    linkedin: string;
    github: string;
    location: Rich;
    availability: Rich;
  };
  footer: {
    colophon: Rich;
    source: string;
    rights: string;
  };
  cv: {
    heading: string;
    print: string;
    back: string;
    summaryHeading: string;
    summary: Rich;
    experienceHeading: string;
    skillsHeading: string;
    educationHeading: string;
    languagesHeading: string;
    projectsHeading: string;
    project: Rich;
  };
  notFound: {
    heading: string;
    body: Rich;
    home: string;
  };
}

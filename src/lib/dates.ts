import type { SiteContent, YearMonth } from '../content/types';

const [buildYear, buildMonthNumber] = __BUILD_MONTH__.split('-').map(Number);

/** The month the site was built, used as "present" so prerendered output is stable. */
export const buildMonth: YearMonth = { year: buildYear ?? 2026, month: buildMonthNumber ?? 1 };

/** Month names come from the content, not Intl, so output is identical in every runtime. */
export const formatMonth = (date: YearMonth, ui: SiteContent['ui']): string => `${ui.months[date.month - 1]} ${date.year}`;

export const formatPeriod = (start: YearMonth, end: YearMonth | null, ui: SiteContent['ui']): string =>
  `${formatMonth(start, ui)} – ${end ? formatMonth(end, ui) : ui.present}`;

/** Months since year 0, for comparing and doing arithmetic on dates. */
export const toIndex = (date: YearMonth): number => date.year * 12 + date.month - 1;

export const fromIndex = (index: number): YearMonth => ({ year: Math.floor(index / 12), month: (index % 12) + 1 });

/** Months from `from` to `to`, counting both ends (Dec 2019 to Feb 2020 is 3). */
export const monthSpan = (from: YearMonth, to: YearMonth): number => toIndex(to) - toIndex(from) + 1;

export const isoMonth = (date: YearMonth): string => `${date.year}-${String(date.month).padStart(2, '0')}`;

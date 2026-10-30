import { en } from './en';
import { es } from './es';
import type { Locale, SiteContent } from './types';

export const locales: readonly Locale[] = ['en', 'es'];

const byLocale: Record<Locale, SiteContent> = { en, es };

export const getContent = (locale: Locale): SiteContent => byLocale[locale];

export type { Locale, SiteContent } from './types';

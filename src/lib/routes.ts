import type { Locale } from '../content/types';

export type PageKind = 'home' | 'cv' | 'notFound';

export interface Route {
  id: string;
  locale: Locale;
  page: PageKind;
  /** Path relative to the site root, always with a trailing slash (or a file name). */
  path: string;
  /** Output file inside dist/. */
  file: string;
  indexable: boolean;
}

export const routes: readonly Route[] = [
  { id: 'en-home', locale: 'en', page: 'home', path: '/', file: 'index.html', indexable: true },
  { id: 'es-home', locale: 'es', page: 'home', path: '/es/', file: 'es/index.html', indexable: true },
  { id: 'en-cv', locale: 'en', page: 'cv', path: '/cv/', file: 'cv/index.html', indexable: false },
  { id: 'es-cv', locale: 'es', page: 'cv', path: '/es/cv/', file: 'es/cv/index.html', indexable: false },
  { id: 'not-found', locale: 'en', page: 'notFound', path: '/404.html', file: '404.html', indexable: false },
];

export const routeById = (id: string): Route | undefined => routes.find((route) => route.id === id);

/** The same page in the other language, if it exists. */
export const alternateOf = (route: Route): Route | undefined =>
  routes.find((candidate) => candidate.page === route.page && candidate.locale !== route.locale);

export const homeOf = (locale: Locale): Route =>
  routes.find((route) => route.page === 'home' && route.locale === locale) ?? routes[0]!;

export const cvOf = (locale: Locale): Route =>
  routes.find((route) => route.page === 'cv' && route.locale === locale) ?? routes[2]!;

/** Resolves the route for a pathname (without the base path). Used in development. */
export const routeForPath = (pathname: string): Route => {
  const normalized = pathname.endsWith('/') || pathname.endsWith('.html') ? pathname : `${pathname}/`;
  return routes.find((route) => route.path === normalized) ?? routes.find((route) => route.page === 'notFound')!;
};

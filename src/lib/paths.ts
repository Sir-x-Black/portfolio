const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Prefixes a root-relative path with the configured base path. */
export const withBase = (path: string): string => `${base}${path.startsWith('/') ? path : `/${path}`}`;

/** Strips the base path from a pathname. */
export const stripBase = (pathname: string): string =>
  base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;

/** Absolute URL on the deployed site, for canonical links, Open Graph and the sitemap. */
export const absoluteUrl = (path: string): string => `${__SITE_URL__}${withBase(path)}`;

export const isExternal = (href: string): boolean => /^https?:\/\//.test(href);

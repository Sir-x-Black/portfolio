import { renderToString } from 'react-dom/server';
import { App } from './App';
import { getContent } from './content';
import { buildHead } from './lib/head';
import { absoluteUrl, stripBase, withBase } from './lib/paths';
import { alternateOf, routeForPath, routes, type Route } from './lib/routes';

export { routeForPath, routes, stripBase, withBase };

/**
 * Fills the HTML template for one route. Used by the dev server middleware and by
 * scripts/prerender.mjs, so development and production render the same markup.
 * React renders to static HTML only; the client never hydrates.
 */
export function renderDocument(template: string, route: Route, extraHead = ''): string {
  const content = getContent(route.locale);
  const html = renderToString(<App route={route} content={content} />);
  const head = [buildHead(route, content), extraHead].filter(Boolean).join('\n    ');
  // Function replacements, so "$" sequences in content are never treated as patterns.
  return template
    .replace('<html lang="en">', () => `<html lang="${route.locale}">`)
    .replace('<!--app-head-->', () => head)
    .replace('data-route=""', () => `data-route="${route.id}"`)
    .replace('<!--app-html-->', () => html);
}

export function buildSitemap(): string {
  const entries = routes
    .filter((route) => route.indexable)
    .map((route) => {
      const alternate = alternateOf(route);
      const links = [route, alternate]
        .filter((item): item is Route => Boolean(item))
        .map((item) => `    <xhtml:link rel="alternate" hreflang="${item.locale}" href="${absoluteUrl(item.path)}" />`);
      const english = route.locale === 'en' ? route : alternate;
      if (english) links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(english.path)}" />`);
      return `  <url>\n    <loc>${absoluteUrl(route.path)}</loc>\n    <lastmod>${__BUILD_MONTH__}</lastmod>\n${links.join('\n')}\n  </url>`;
    });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
}

export const buildRobots = (): string => `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`;

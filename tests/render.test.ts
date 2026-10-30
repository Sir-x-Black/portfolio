import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildRobots, buildSitemap, renderDocument } from '../src/entry-server';
import { absoluteUrl } from '../src/lib/paths';
import { routes } from '../src/lib/routes';
// @ts-expect-error -- plain ES module shared with the build scripts
import { loadDenylist, scanText } from '../scripts/privacy-rules.mjs';

const template = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const pages = routes.map((route) => ({ route, html: renderDocument(template, route) }));
const denylist: string[] = loadDenylist();

const count = (html: string, pattern: RegExp) => html.match(pattern)?.length ?? 0;

describe.each(pages)('$route.id', ({ route, html }) => {
  it('sets the document language and fills every placeholder', () => {
    expect(html).toContain(`<html lang="${route.locale}">`);
    expect(html).not.toContain('<!--app-');
    expect(html).toContain(`data-route="${route.id}"`);
  });

  it('has one h1, a title and a description', () => {
    expect(count(html, /<h1[\s>]/g)).toBe(1);
    expect(html).toMatch(/<title>[^<]{10,}<\/title>/);
    expect(html).toMatch(/<meta name="description" content="[^"]{50,}"/);
  });

  it('is indexed only when it should be', () => {
    if (route.indexable) {
      expect(html).toContain('rel="canonical"');
      expect(html).toContain('hreflang="x-default"');
      expect(html).not.toContain('noindex');
    } else {
      expect(html).toContain('name="robots" content="noindex, follow"');
      expect(html).not.toContain('rel="canonical"');
    }
  });

  it('only links to pages and sections that exist', () => {
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
    const paths = new Set(routes.map((item) => item.path));
    for (const [, href] of html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
      if (!href || /^(https?:|mailto:)/.test(href)) continue;
      const [path, hash] = href.split('#');
      if (path) expect(paths, `unknown page ${href}`).toContain(path);
      if (hash && (!path || path === route.path)) expect(ids, `missing #${hash}`).toContain(hash);
    }
  });

  it('never renders "undefined", "null" or "NaN" as text', () => {
    const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
    expect(text).not.toMatch(/\b(undefined|null|NaN)\b/);
  });

  it('contains no private data', () => {
    expect(scanText(html, { kind: 'html', denylist })).toEqual([]);
  });
});

describe('home pages', () => {
  it('cross-link English and Spanish with hreflang', () => {
    const english = pages.find((page) => page.route.id === 'en-home')!.html;
    const spanish = pages.find((page) => page.route.id === 'es-home')!.html;
    for (const html of [english, spanish]) {
      expect(html).toContain(`<link rel="alternate" hreflang="en" href="${absoluteUrl('/')}" />`);
      expect(html).toContain(`<link rel="alternate" hreflang="es" href="${absoluteUrl('/es/')}" />`);
      expect(html).toContain(`<link rel="alternate" hreflang="x-default" href="${absoluteUrl('/')}" />`);
    }
    expect(english).toContain(`<link rel="canonical" href="${absoluteUrl('/')}" />`);
    expect(spanish).toContain(`<link rel="canonical" href="${absoluteUrl('/es/')}" />`);
  });

  it('describe the person with JSON-LD that names no private contact data', () => {
    const english = pages.find((page) => page.route.id === 'en-home')!.html;
    const json = english.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
    const person = JSON.parse(json ?? '{}');
    expect(person['@type']).toBe('Person');
    expect(person.telephone).toBeUndefined();
    expect(person.address).toBeUndefined();
  });

  it('render the view switch so it works without JavaScript', () => {
    const english = pages.find((page) => page.route.id === 'en-home')!.html;
    const radios = english.match(/<input type="radio" name="review-view"[^>]*>/g) ?? [];
    expect(radios).toHaveLength(2);
    expect(radios.find((input) => input.includes('value="answer"'))).toContain('checked=""');
    expect(radios.find((input) => input.includes('value="reviewed"'))).not.toContain('checked');
  });
});

describe('sitemap and robots', () => {
  it('list only indexable pages, with their alternates', () => {
    const sitemap = buildSitemap();
    expect(count(sitemap, /<loc>/g)).toBe(routes.filter((route) => route.indexable).length);
    expect(sitemap).not.toContain('/cv/');
    expect(sitemap).toContain('hreflang="x-default"');
  });

  it('point crawlers at the sitemap', () => {
    expect(buildRobots()).toMatch(/Sitemap: https:\/\/.+\/sitemap\.xml/);
  });
});

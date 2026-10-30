import { facts } from '../content/facts';
import type { SiteContent } from '../content/types';
import { absoluteUrl, withBase } from './paths';
import { alternateOf, type Route } from './routes';

const ogLocale = { en: 'en_US', es: 'es_AR' } as const;

const escapeAttr = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const meta = (attr: 'name' | 'property', key: string, value: string) =>
  `<meta ${attr}="${key}" content="${escapeAttr(value)}" />`;

const link = (attrs: Record<string, string>) =>
  `<link ${Object.entries(attrs)
    .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
    .join(' ')} />`;

const titleFor = (route: Route, content: SiteContent): string => {
  if (route.page === 'cv') return content.meta.cvTitle;
  if (route.page === 'notFound') return content.meta.notFoundTitle;
  return content.meta.title;
};

const descriptionFor = (route: Route, content: SiteContent): string =>
  route.page === 'cv' ? content.meta.cvDescription : content.meta.description;

function personJsonLd(route: Route, content: SiteContent): string {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: facts.name.full,
    alternateName: facts.name.display,
    givenName: facts.name.given,
    familyName: facts.name.family,
    url: absoluteUrl(route.path),
    jobTitle: 'Software Engineer',
    worksFor: { '@type': 'Organization', name: facts.employer },
    homeLocation: { '@type': 'Place', name: `${facts.location.city}, ${facts.location.country}` },
    knowsLanguage: ['es', 'en'],
    knowsAbout: ['Java', 'Spring Boot', 'Spring Security', 'Oracle Database', 'SQL', 'PL/SQL', 'OpenShift', 'Angular', 'Code review'],
    description: content.meta.description,
    sameAs: [facts.links.linkedin, facts.links.github],
  };
  // Escape "<" so the JSON can never close the script element.
  return `<script type="application/ld+json">${JSON.stringify(person).replaceAll('<', '\\u003c')}</script>`;
}

/** Head tags for one prerendered route. Fonts are preloaded separately by the prerender script. */
export function buildHead(route: Route, content: SiteContent): string {
  const title = titleFor(route, content);
  const description = descriptionFor(route, content);
  const url = absoluteUrl(route.path);
  const alternate = alternateOf(route);
  const image = absoluteUrl(`/og-${route.locale}.png`);

  const tags = [
    `<title>${escapeAttr(title)}</title>`,
    meta('name', 'description', description),
    meta('name', 'author', facts.name.full),
    link({ rel: 'icon', href: withBase('/favicon.svg'), type: 'image/svg+xml' }),
    link({ rel: 'icon', href: withBase('/favicon-32.png'), sizes: '32x32', type: 'image/png' }),
    link({ rel: 'apple-touch-icon', href: withBase('/apple-touch-icon.png') }),
  ];

  if (route.indexable) {
    tags.push(link({ rel: 'canonical', href: url }));
    if (alternate) {
      tags.push(link({ rel: 'alternate', hreflang: route.locale, href: url }));
      tags.push(link({ rel: 'alternate', hreflang: alternate.locale, href: absoluteUrl(alternate.path) }));
      const english = route.locale === 'en' ? route : alternate;
      tags.push(link({ rel: 'alternate', hreflang: 'x-default', href: absoluteUrl(english.path) }));
    }
  } else {
    tags.push(meta('name', 'robots', 'noindex, follow'));
  }

  if (route.page !== 'notFound') {
    tags.push(
      meta('property', 'og:type', route.page === 'home' ? 'profile' : 'website'),
      meta('property', 'og:site_name', facts.name.display),
      meta('property', 'og:title', title),
      meta('property', 'og:description', description),
      meta('property', 'og:url', url),
      meta('property', 'og:image', image),
      meta('property', 'og:image:width', '1200'),
      meta('property', 'og:image:height', '630'),
      meta('property', 'og:image:alt', content.meta.ogImageAlt),
      meta('property', 'og:locale', ogLocale[route.locale]),
      meta('property', 'og:locale:alternate', ogLocale[route.locale === 'en' ? 'es' : 'en']),
      meta('name', 'twitter:card', 'summary_large_image'),
    );
  }

  if (route.page === 'home') {
    tags.push(
      meta('property', 'profile:first_name', facts.name.given),
      meta('property', 'profile:last_name', facts.name.family),
      personJsonLd(route, content),
    );
  }

  return tags.join('\n    ');
}

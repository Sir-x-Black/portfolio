// Renders every route to static HTML inside dist/, then writes the sitemap and
// robots.txt. Runs after `vite build` (client) and `vite build --ssr` (renderer).

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('dist');
const ssrDir = resolve('dist-ssr');
const entryFile = readdirSync(ssrDir).find((file) => /^entry-server\.m?js$/.test(file));
if (!entryFile) throw new Error('dist-ssr/entry-server.js not found. Run `npm run build:server` first.');

const { routes, renderDocument, buildSitemap, buildRobots, withBase } = await import(pathToFileURL(join(ssrDir, entryFile)).href);

const template = readFileSync(join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('dist/index.html has no <!--app-html--> placeholder.');

// Preload the two faces visible in the first viewport: body text and the headline.
const assets = readdirSync(join(dist, 'assets'));
const preloads = ['public-sans-latin-wght-normal', 'newsreader-latin-wght-normal'].map((prefix) => {
  const file = assets.find((name) => name.startsWith(prefix) && name.endsWith('.woff2'));
  if (!file) throw new Error(`Font to preload not found in dist/assets: ${prefix}*.woff2`);
  return `<link rel="preload" href="${withBase(`/assets/${file}`)}" as="font" type="font/woff2" crossorigin />`;
});

for (const route of routes) {
  const target = join(dist, route.file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, renderDocument(template, route, preloads.join('\n    ')));
  console.log(`  ${route.path.padEnd(10)} -> dist/${route.file}`);
}

writeFileSync(join(dist, 'sitemap.xml'), buildSitemap());
writeFileSync(join(dist, 'robots.txt'), buildRobots());
console.log('  sitemap.xml, robots.txt');

rmSync(ssrDir, { recursive: true, force: true });

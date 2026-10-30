// Renders the raster images in public/ with a local Chrome: the Open Graph cards
// (one per language) and the PNG icons. Re-run after changing the name, role or
// thesis:  npm run images   (set CHROME_PATH if Chrome isn't found)
//
// Content and the hand-drawn mark come from src/ through Vite, so the images
// always use the same words and marks as the site.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'vite';

const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const chrome = chromeCandidates.find((path) => existsSync(path));
if (!chrome) throw new Error('Chrome not found. Set CHROME_PATH to a Chrome or Chromium executable.');

const fontUrl = (path) => pathToFileURL(resolve('node_modules', path)).href;
const fonts = `
  @font-face { font-family: 'Newsreader'; font-weight: 200 800; src: url('${fontUrl('@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2')}') format('woff2'); }
  @font-face { font-family: 'Public Sans'; font-weight: 100 900; src: url('${fontUrl('@fontsource-variable/public-sans/files/public-sans-latin-wght-normal.woff2')}') format('woff2'); }
  @font-face { font-family: 'JetBrains Mono'; font-weight: 400; src: url('${fontUrl('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2')}') format('woff2'); }
`;

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const { getContent } = await server.ssrLoadModule('/src/content/index.ts');
const { handMark } = await server.ssrLoadModule('/src/lib/handmark.ts');
await server.close();

const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function mark(token, style, seed) {
  const ink = handMark(token.length, style, seed);
  return `<mark>${escape(token)}<svg width="${ink.widthEm}em" height="${ink.heightEm}em" viewBox="${ink.viewBox}"><path d="${ink.d}" pathLength="1"/></svg></mark>`;
}

function ogCard(locale) {
  const { hero } = getContent(locale);
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><style>
    ${fonts}
    * { margin: 0; box-sizing: border-box; }
    html, body { width: 1200px; height: 630px; overflow: hidden; background: #eef0f3; color: #171c26; }
    body { position: relative; padding: 64px 72px; font-family: 'Public Sans'; }
    .name { font-family: 'Newsreader'; font-weight: 560; font-size: 40px; }
    .role { margin-top: 6px; font-size: 24px; color: #4b5466; }
    .thesis { margin-top: 36px; max-width: 980px; font-family: 'Newsreader'; font-weight: 370; font-size: 84px; line-height: 1.02; letter-spacing: -0.024em; }
    .sheet { position: absolute; left: 72px; right: 72px; bottom: -24px; padding: 26px 30px 44px; background: #fff; border: 1px solid #dde1e7; border-radius: 6px; box-shadow: 0 18px 40px -24px rgb(23 28 38 / 0.32); font-family: 'JetBrains Mono'; font-size: 22px; line-height: 1.7; white-space: pre; }
    .no { display: inline-block; width: 2.4ch; color: #626b7d; }
    .badge { display: inline-grid; place-items: center; width: 1.5em; height: 1.5em; margin-right: 0.9ch; border: 2px solid #b8322a; border-radius: 50%; color: #b8322a; font: 700 15px 'Public Sans'; vertical-align: 0.15em; }
    .kw { color: #4b5466; }
    mark { position: relative; display: inline-block; background: none; color: inherit; }
    mark svg { position: absolute; left: -0.5em; top: -0.32em; overflow: visible; }
    mark path { fill: none; stroke: #b8322a; stroke-width: 2.3; stroke-linecap: round; stroke-linejoin: round; }
  </style></head><body>
    <p class="name">${escape(hero.name)}</p>
    <p class="role">${escape(hero.role)}</p>
    <p class="thesis">${escape(hero.thesis)}</p>
    <div class="sheet"><span class="no">1</span><span class="badge">1</span><span class="kw">import</span> ${mark('javax.servlet', 'circle', 110)}.http.HttpServletResponse;
<span class="no">5</span><span class="badge">2</span><span class="kw">public class</span> SecurityConfig ${mark('extends WebSecurityConfigurerAdapter', 'underline', 231)} {</div>
  </body></html>`;
}

function icon(size, rounded) {
  const svg = readFileSync('public/favicon.svg', 'utf8').replace(rounded ? '' : 'rx="6" ', '');
  return `<!doctype html><html><head><style>html, body { margin: 0; width: ${size}px; height: ${size}px; overflow: hidden; background: #eef0f3; } svg { display: block; width: ${size}px; height: ${size}px; }</style></head><body>${svg}</body></html>`;
}

const jobs = [
  { out: 'public/og-en.png', width: 1200, height: 630, html: ogCard('en') },
  { out: 'public/og-es.png', width: 1200, height: 630, html: ogCard('es') },
  { out: 'public/apple-touch-icon.png', width: 180, height: 180, html: icon(180, false) },
  { out: 'public/favicon-32.png', width: 32, height: 32, html: icon(32, true) },
];

const work = mkdtempSync(join(tmpdir(), 'portfolio-images-'));
try {
  for (const job of jobs) {
    const page = join(work, `${job.width}x${job.height}-${job.out.replaceAll('/', '_')}.html`);
    writeFileSync(page, job.html);
    const result = spawnSync(
      chrome,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
        '--allow-file-access-from-files',
        `--window-size=${job.width},${job.height}`,
        '--virtual-time-budget=4000',
        `--screenshot=${resolve(job.out)}`,
        pathToFileURL(page).href,
      ],
      { encoding: 'utf8' },
    );
    if (result.status !== 0 || !existsSync(job.out)) throw new Error(`Chrome failed for ${job.out}: ${result.stderr}`);
    console.log(`  ${job.out} (${job.width}×${job.height})`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

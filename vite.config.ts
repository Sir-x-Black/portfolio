/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

// Absolute origin used for canonical URLs, Open Graph tags and the sitemap.
// Set SITE_URL in the hosting provider once the final domain is known.
// An empty value falls back to the default; anything that isn't a bare
// http(s) origin (no path) stops the build instead of publishing broken URLs.
const siteUrl = (process.env.SITE_URL || 'https://gonzalo-palavesino.pages.dev').replace(/\/+$/, '');
if (!/^https?:\/\//.test(siteUrl) || new URL(siteUrl).origin !== siteUrl) {
  throw new Error(`SITE_URL must be an origin such as https://example.pages.dev (no path); got "${siteUrl}". Put any path in BASE_PATH.`);
}

// Path prefix when the site is not served from the domain root
// (e.g. BASE_PATH=/portfolio/ for a GitHub Pages project site).
const basePath = `/${(process.env.BASE_PATH || '/').replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/');

// Month of the build, so "present" in the timeline is identical on every page.
const buildMonth = new Date().toISOString().slice(0, 7);

/**
 * Renders pages on the server in development too, through the same
 * renderDocument() the prerender script uses, so `npm run dev` shows exactly
 * the markup that gets deployed. Production never hydrates React.
 */
function devServerRender(): Plugin {
  return {
    name: 'portfolio:dev-server-render',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = new URL(req.originalUrl ?? '/', 'http://localhost').pathname;
        const wantsHtml = req.method === 'GET' && (req.headers.accept ?? '').includes('text/html');
        const isAsset = /\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith('.html');
        if (!wantsHtml || isAsset) return next();
        try {
          const entry = await server.ssrLoadModule('/src/entry-server.tsx');
          const route = entry.routeForPath(entry.stripBase(pathname));
          const template = await server.transformIndexHtml(req.originalUrl ?? '/', readFileSync(resolve('index.html'), 'utf8'));
          res.statusCode = route.page === 'notFound' ? 404 : 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(entry.renderDocument(template, route));
        } catch (error) {
          server.ssrFixStacktrace(error as Error);
          next(error);
        }
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  // Several real HTML pages, not a single-page app: `vite preview` then answers
  // unknown paths with a 404 instead of the home page, as Cloudflare Pages does.
  appType: 'mpa',
  plugins: [react(), devServerRender()],
  define: {
    __SITE_URL__: JSON.stringify(siteUrl),
    __BUILD_MONTH__: JSON.stringify(buildMonth),
  },
  build: {
    target: 'es2022',
  },
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    environment: 'node',
    // On Windows, a terminal opened as "d:\..." (lowercase drive, common in VS Code
    // and cmd) makes every suite fail in the default pool with "Cannot read
    // properties of undefined (reading 'config')". The VM pools are unaffected.
    pool: process.platform === 'win32' ? 'vmForks' : 'forks',
  },
});

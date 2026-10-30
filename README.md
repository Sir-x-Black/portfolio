# Gonzalo Palavesino, portfolio

Personal site of a Java and Oracle SQL software engineer, built to support applications for AI training and AI evaluation work, and for software engineering roles. English at `/`, Spanish at `/es/`, and a print-ready résumé at `/cv/` and `/es/cv/`.

Live at **https://gonzalo-palavesino.pages.dev**.

Its first screen is a constructed code review: a plausible AI-generated Spring Security config for Spring Boot 3, four problems marked by hand and explained in the margin, and the corrected version. The verdict is checked by a compiler, not asserted: see [`evidence/spring-security-review`](evidence/spring-security-review/).

## How it's built

| Choice | Why |
|---|---|
| React 19 + TypeScript, **rendered to static HTML at build time** | Components for authoring, plain HTML for delivery. React never runs in the browser: the page ships about 1 KB of JavaScript (gzip) for progressive enhancement and works with JavaScript off. |
| Vite 8 | Dev server and bundling. The dev server renders pages through the same `renderDocument()` as the production build, so what you see locally is what deploys. |
| Plain CSS with design tokens and cascade layers | The design is typographic and needs precise control; no framework, about 6.5 KB gzip. |
| Self-hosted fonts (Fontsource) | No third-party requests, so a strict Content Security Policy and nothing to consent to. |
| Motion for React: evaluated, **not used** | Every animation in the design is a CSS transition or keyframe animation. Motion's smallest React setup would add about 29 KB gzip for no capability the design uses. |

More detail in [`docs/architecture.md`](docs/architecture.md) and the visual concept in [`docs/art-direction.md`](docs/art-direction.md).

## Run it

Requires Node 22.12 or newer (`.node-version` pins 24.18.0). A JDK 17+ is needed only for the compile check. On Windows the tests run in Vitest's `vmForks` pool, because the default pool fails when the terminal reports the drive letter in lowercase (`d:\…`).

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/
npm run preview   # serves dist/ at http://localhost:4173
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server with server-side rendering |
| `npm run build` | Client build, renderer build, prerendering of every page, sitemap and robots.txt, then the privacy check on `dist/` |
| `npm run preview` | Serves the production build |
| `npm run check` | Typecheck, lint, tests and build: everything CI runs for the site |
| `npm run typecheck` / `lint` / `test` | Individually |
| `npm run verify:example` | Compiles the review example's cases with `javac` and checks the claims made on the page |
| `npm run images` | Re-renders the Open Graph cards and PNG icons with a local Chrome |
| `npm run deploy` | Builds, then uploads `dist/` to Cloudflare Pages (needs a Wrangler login, see `docs/deployment.md`) |

## Editing content

All copy lives in `src/content/`:

- `facts.ts`: dates, links and the email, defined once for both languages.
- `en.ts` and `es.ts`: every string on the site. TypeScript and the tests require both to have exactly the same shape.
- `review-sample.ts`: the code in the review example. A test fails if it stops matching the compiled files in `evidence/`.

Content strings accept a small inline markup: `` `code` ``, `[label](url)`, `**strong**`, and `==phrase==`, which links the phrase to the margin note in the same block whose `anchor` matches it.

After changing the name, role or headline, run `npm run images` so the social cards match. `facts.links.source` points at this repository: the footer links to the source and the review example links to its compile check.

## Quality gates

- **Tests** (Vitest): both languages have the same structure and numbers; every margin note's anchor exists and vice versa; the example shows exactly the compiled code; every prerendered page has one `h1`, its language, title, description, correct canonical and `hreflang` (or `noindex`), and only links to pages and sections that exist; honesty guards (no "bilingual English", no claimed AI-training experience, the example is labelled as constructed).
- **Privacy check**, run at the end of every build on `dist/` and on every file the repository would commit: fails on `tel:` links, phone-like numbers in any format, street addresses and their abbreviations, ID numbers, secrets (API keys, tokens, private keys) and any email other than the published one. `tests/privacy.test.ts` feeds it invented leaks to prove each rule fires. The exact private strings are kept out of the repository (even hashed, a phone number can be brute-forced); put them in `notes/private-denylist.txt`, which is git-ignored, to check against them locally.
- **CI** (`.github/workflows/ci.yml`): typecheck, lint, tests, build and the Java compile check on every push and pull request. A push to `main` that passes them all is deployed to Cloudflare Pages, once the repository has the Cloudflare token.
- Results of the browser, accessibility and Lighthouse audits: [`docs/qa-report.md`](docs/qa-report.md).

## Deploying

Cloudflare Pages, free plan, by Direct Upload: `npm run deploy` from a computer logged in to Wrangler, or the `deploy` job in CI, which publishes `main` after every check passes once the repository has a Cloudflare token. Step by step, with a GitHub Pages alternative: [`docs/deployment.md`](docs/deployment.md).

## Structure

```
src/
  content/        copy and facts (en, es), review example code
  components/     page sections; Annotated.tsx is the main column + margin layout
  pages/          home, résumé, 404
  lib/            routes, head tags and JSON-LD, hand-drawn marks, progressive enhancement
  styles/         tokens, base, layout, components, print
  entry-server.tsx  renders a route into the HTML template (dev server and prerender)
  entry-client.ts   loads the CSS and the enhancement script
scripts/          prerender, privacy rules and check, image rendering
evidence/         compile check behind the review example
tests/            Vitest suites
public/           icons, Open Graph cards, Cloudflare _headers
docs/             art direction, architecture, deployment, QA report
notes/            private working notes (git-ignored, never published)
```

## Privacy

Published: name, professional email, LinkedIn and GitHub links, city and country. Deliberately not published: phone number, street address, ID numbers, the original résumé files, and any client code, data or document. Client work is described without the client's name or internal project names.

## License

No license has been chosen yet, so all rights are reserved by default. If the code should be reusable, add a license that covers the code only (MIT is common); the written content and résumé stay personal.

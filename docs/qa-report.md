# QA report

Real results from running the checks on 29 October 2026 against the production build (`npm run build`, served by `vite preview`, which compresses with gzip). The same day the site was deployed to Cloudflare Pages and checked again there: see [Live deployment](#live-deployment).

## Environment

| Tool | Version |
|---|---|
| OS | Windows 11 Pro |
| Node.js / npm | 24.18.0 / 11.16.0 |
| Browser | Google Chrome 156 (headless), driven by playwright-core 1.64.1 |
| Second browser (live site only) | Firefox 159.0 (headless, empty temporary profile), driven over Marionette |
| Accessibility engine | axe-core 4.14.0 |
| Lighthouse | 13.6.0 |
| JDK (compile check) | Temurin 17.0.17 |

playwright-core, axe-core and Lighthouse were run from a temporary folder outside the project; they are not dependencies.

## Automated checks

| Check | Result |
|---|---|
| `npm run typecheck` | Pass, 0 errors |
| `npm run lint` (typescript-eslint, jsx-a11y strict, react-hooks) | Pass, 0 problems |
| `npm test` (Vitest) | 96 of 96 tests pass, in 4 files; also from a terminal that reports the drive as `d:\` |
| `npm run build` | Pass: 5 pages prerendered, sitemap and robots.txt written |
| Privacy check | Pass: 10 built files and 70 repository files, generic rules plus 11 local denylist entries |
| `npm run verify:example` | 4 of 4 claims hold, including the exact "6 errors from 3 root causes" (cold cache: downloads and SHA-256 checks included) |

Client JavaScript: 2.2 KB (1.1 KB gzip). CSS: 28 KB (6.7 KB gzip). Home page HTML: 48 KB (12.5 KB gzip).

## Browser checks

Screenshots of 4 pages (English home, Spanish home, résumé, 404) at 4 sizes (1440×900, 1280×720, 768×1024, 390×844) in light and dark: 32 combinations.

- Horizontal overflow: none in any of the 32.
- Console errors or warnings, failed requests: none.
- Screen-by-screen review at 1440×900 and 390×844 in both languages.

Interaction checks, scripted in Chrome:

| What | Result |
|---|---|
| Marks fit their tokens | Every mark measures exactly 0.6em per character, as `handmark.ts` assumes |
| "After review" by click | Model answer hidden (`visibility: hidden`), corrected code shown, rubric shows "Yes / Yes, no warnings / Yes", verdict switches, note numbers turn green |
| View switch by keyboard | Arrow keys move between the two options |
| Hovering a review note | Its mark's stroke thickens (2.3 to 3.6) |
| Hovering a margin note | Its annotated phrase gets the highlight (`background-size: 100% 100%`) |
| Copy email | Button appears only with the Clipboard API; copies the address and announces "Copied" through `role="status"` |
| Tab order from the top | Skip link, wordmark, 4 section links, résumé, language, then the hero actions, the view switch, the note sources, and onward in reading order. Every stop shows a 2px focus outline. |
| Section links on a phone | Shown as a two-by-two grid under the header in both languages; each link 37px tall |
| Code region on a phone | Gets `tabindex="0"` (it scrolls sideways); on desktop it doesn't (no scroll) |
| `prefers-reduced-motion: reduce` | Nothing deferred; marks and numbers rendered final from the first frame |
| `forced-colors: active` | The selected view gets a 2px outline and an underline; the other has neither |
| Example below the fold (phone) | Animation held, then plays when the code scrolls into view |
| Unknown paths in preview | `/nope` and `/es/nope/` answer 404 |
| Résumé printed (Chrome, A4) | 2 pages in English and in Spanish; header, footer and buttons hidden |
| `BASE_PATH=/portfolio/` build | Every asset, font URL in the CSS, page link, canonical, Open Graph and sitemap URL carries the prefix |
| Invalid `SITE_URL` (no scheme, or with a path) | The build stops with an explanatory error |

## Accessibility (axe-core)

WCAG 2.0, 2.1 and 2.2 A/AA rules plus best practices, on 5 pages × light and dark × 1440px and 390px, plus the "After review" state on both home pages: **28 runs, 0 violations.**

axe left some colour-contrast checks as "incomplete" because it couldn't compute the background. Each was checked by hand:

- Text inside the marked tokens: the hand-drawn SVG overlaps the token's box. The text is ink on white, 17.1:1.
- Code lines partly scrolled out of view on phones: the same colours as the rest of the code (5.4:1 or more).
- Annotated phrases: the highlight is a gradient background, transparent at rest. Highlighted, ink on `#ffe38a` is 13.5:1, and in dark mode 8.5:1.

Every text colour pair in both themes was computed with the WCAG formula: the lowest is 4.69:1 (tertiary text on paper, light theme). The view switch's border is 5.4:1 against the sheet (3:1 needed for UI components).

## Lighthouse 13.6 (simulated throttling)

Final run, after every fix below:

| Page | Form factor | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|---|
| `/` | Mobile | 100 | 100 | 100 | 100 | 1.2 s | 1.2 s | 70 ms | 0 |
| `/` | Desktop | 100 | 100 | 100 | 100 | 0.3 s | 0.3 s | 0 ms | 0 |
| `/es/` | Mobile | 100 | 100 | 100 | 100 | 1.2 s | 1.2 s | 90 ms | 0 |
| `/cv/` | Mobile | 100 | 100 | 100 | 63 | 0.8 s | 0.8 s | 0 ms | 0 |

Total blocking time moved between 0 and 90 ms across runs on the same build; the simulation is sensitive to load on the machine. The home page transfers 189 KiB in 8 requests, most of it the four font files. The résumé's SEO score of 63 is the deliberate `noindex`, so search results lead to the portfolio instead of a duplicate. An earlier run flagged a forced reflow from the enhancement script; it now reads positions from `IntersectionObserver` and `ResizeObserver` callbacks, and that audit passes.

## Live deployment

Deployed to Cloudflare Pages on 29 October 2026 at https://gonzalo-palavesino.pages.dev, from the build tested above, and checked there the same day.

Before uploading, the build was served by a local server that applies `public/_headers` the way Cloudflare does, because `vite preview` doesn't send those headers. Chrome logged no console errors, CSP violations or DevTools issues on any page. That includes the `interest-cohort` entry in Permissions-Policy, a retired feature that Chrome 156 ignores without logging anything.

Scripted HTTP checks against the live site, all passing:

| What | Result |
|---|---|
| Deployed pages | All four are byte-for-byte the local `dist/` |
| Status codes | `/`, `/es/`, `/cv/` and `/es/cv/` answer 200 |
| Trailing slash | `/es`, `/cv` and `/es/cv` redirect with 308 to the form with the slash |
| Unknown paths | `/nope`, `/es/nope/` and `/assets/nope.js` get `404.html` with status 404 |
| Headers | Every header in `_headers` arrives exactly as written; `/assets/*` gets `public, max-age=31536000, immutable` |
| Search | Canonical, `og:url` and `og:image` use the live origin; the résumé pages stay `noindex`, without a canonical. Production has no `X-Robots-Tag`; the deployment's own hashed address gets `noindex`. |
| Sitemap and robots.txt | The sitemap lists both home pages on the live origin; robots.txt points at it |
| Delivery | Brotli compression; HTTP/3 advertised (`alt-svc: h3`) |

In Chrome, with the real headers:

- Console: no errors or CSP violations on any page. The only entry is the expected 404 of the not-found page itself.
- Screenshots: the same 32 combinations as above, with no horizontal overflow, console errors or failed requests.
- axe-core: 28 runs, 0 violations. The live CSP blocks the inline script Playwright uses to inject axe, so the test context ran with Playwright's `bypassCSP`, which affects only the test's own script.
- Interaction script: the same results as on the local build.

Lighthouse 13.6 on the live site:

| Page | Form factor | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|---|
| `/` | Mobile | 99 | 100 | 100 | 100 | 1.1 s | 1.1 s | 100 ms | 0 |
| `/` | Desktop | 100 | 100 | 100 | 100 | 0.3 s | 0.3 s | 0 ms | 0 |
| `/es/` | Mobile | 99 | 100 | 100 | 100 | 1.1 s | 1.1 s | 100 ms | 0 |

The point lost on mobile is simulated total blocking time, which has varied between 0 and 100 ms across runs, local and live. The home page transfers 193 KiB.

Firefox 159, headless, with an empty temporary profile (no extensions or user data):

- 5 pages at 2 widths, light and dark (20 combinations): no horizontal overflow, `:has()` supported, the dark theme applied, and the enhancement script ran (the copy button appears).
- Firefox doesn't open windows narrower than 500px, so its narrow check ran at 500px; the 390px phone width was checked in Chrome only.
- The marks wait while the example is below the fold (`stroke-dashoffset: 1px`) and draw when it scrolls into view (`0px`), in both languages. A screenshot of the English example shows each mark on its token, as in Chrome.
- Clicking "After review" hides the model answer (`visibility: hidden`) and shows the corrected code.

## Web Interface Guidelines

The public [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) were applied by hand as a checklist. They led to three changes:

- `touch-action: manipulation` with an intentional tap highlight.
- Non-breaking spaces between product names and versions ("Spring Boot 3").
- Numerals for counts ("more than 10 microservices").

Deliberate deviations:

- Sentence case instead of Title Case: an editorial voice, and Spanish doesn't use Title Case.
- First person: it's a personal portfolio.
- Month names written out per language instead of `Intl.DateTimeFormat`, for exact control of "Nov 2021" and "nov 2021". Pages are rendered once at build time, so there is no server and client mismatch.
- The review view isn't reflected in the URL.
- Small paint-only transitions (stroke width, highlight size, colours) besides transform and opacity.

## Reviews

Two separate review passes: one of the code, one checking every claim on the site against the résumé.

**Code review.** The most serious finding: the label of one privacy rule used the real block-and-house shorthand of the home address as its example. It was caught before any commit and replaced with an invented one. The privacy check now also scans every file the repository would commit, so that class of mistake fails the build. Other findings, all fixed:

- The generic privacy rules missed realistic formats: `tel:` links, `+54 9 …` numbers, "Av. …" addresses, `github_pat_` tokens and JSON API keys. They were rewritten, and invented samples now prove each rule fires.
- Local denylist matching missed reformatted numbers and phrases split by React's comment separators.
- The view switch was indistinguishable in high-contrast mode.
- Tests failed when the terminal reported the drive letter in lowercase.
- Mixing `:has()` with plain selectors in one list would have broken the no-`:has()` fallback.
- The GitHub Pages workflow gave write permissions to the job that installs dependencies.
- Empty or malformed `SITE_URL` and `BASE_PATH` values produced broken URLs.
- The section links disappeared on phones.
- Several tests could pass for the wrong reason.
- The compile check didn't assert the "6 errors" shown in the rubric.

**Fact check.** It found claims stronger than the résumé supports, all corrected:

- A column header said "Where I already do it" for AI-training tasks; it is now "Closest experience".
- "Paid AI training projects" implied unpaid ones.
- "Daily work" isn't in the résumé.
- An invented link said "the same discipline went into…".
- A present tense made the Angular migration sound underway, though it was only planned.
- "Six years of reviewing and documenting" was stretched; only the NTT DATA years show it.
- `app-ads.txt` was described as Google Play's ads declaration.
- "Typical" described a constructed example.

It also flagged Spanish phrasing and English spellings to tidy up, which were fixed, and that "Computer Engineering" may not be the exact degree name, still to be confirmed. Tests now reject the overstated words.

## Other issues found and fixed during QA

- Header and footer were 40px wider than the content at large widths; they now share the same edges.
- On phones the rubric squeezed each criterion into three lines; results now sit under their criterion.
- While the animation waited for the example to scroll into view, the margin notes looked unnumbered; their numbers now wait dimmed.
- The compile check proved the first draft of note 3 wrong about `.and()`; the note now names the calls javac actually flags.
- A synchronous layout read at startup (Lighthouse: forced reflow) was removed.
- A test depended on HTML attribute order; it now parses the inputs.

## Not tested

- **Safari** (macOS and iPhone): no Apple device was available. The CSS features used (`:has()`, `color-mix()`, cascade layers, `text-wrap`) are supported in current Safari, but check the live site on an iPhone before sending it to recruiters.
- **Firefox on Android**, and Firefox at phone width (see above).
- **Screen readers** (NVDA, VoiceOver): semantics were checked through axe and the markup, not by listening.
- **The LinkedIn URL:** LinkedIn refuses automated requests (HTTP 999). Its Post Inspector, which previews the share card, needs a LinkedIn login and wasn't run.

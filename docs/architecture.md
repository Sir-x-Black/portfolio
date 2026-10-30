# Architecture and decisions

The site is a handful of static pages. The decisions below are about doing that well: fast on a phone, accessible, honest about its content, and easy to keep correct.

## Rendering: React at build time, HTML in the browser

Pages are React components rendered to HTML by `renderDocument()` in `src/entry-server.tsx`. The production build runs it once per route (`scripts/prerender.mjs`); the dev server runs the same function on every request (the `devServerRender` plugin in `vite.config.ts`). There is no hydration: the browser receives finished HTML, one CSS file and a 2 KB script.

Why not a client-rendered single-page app: the content is static, recruiters often open links on phones, and search engines and link previews read the HTML directly. Why not Astro or another static-site generator: I wanted to write it in React and TypeScript, and a 40-line prerender step gets the same result without a second framework.

The cost: anything that needs client-side state would require hydrating that part. Nothing does today.

## Interactions without a client framework

| Behaviour | How |
|---|---|
| Switching between the model answer and the corrected code | Two radio buttons. CSS `:has(input:checked)` shows one view, staggers the lines that differ and hides the other with `visibility`, which also removes it from the accessibility tree. Works before and without JavaScript. |
| A margin note highlighting the phrase it annotates, and the reverse | `data-k` attributes and `:has(:hover, :focus-within)` selectors in `layout.css`. |
| A review note highlighting its mark in the code | The same pattern with `data-issue`. |
| Marks drawing themselves on load | CSS keyframes on `stroke-dashoffset`, ordered by delay. |
| Holding that animation until the example is on screen | `src/lib/enhance.ts`, with `IntersectionObserver`. Positions come from the observer, so nothing forces a synchronous layout. |
| Keyboard access to the code when it scrolls sideways | `enhance.ts` adds `tabindex="0"` only while the region actually overflows, measured in a `ResizeObserver` callback. |
| Copying the email, printing the résumé | Buttons rendered `hidden` and revealed by `enhance.ts` only when the API they need exists. |

## Hand-drawn marks without measuring the DOM

Code is set in JetBrains Mono, whose advance width is 0.6em. A mark around a token of *n* characters is therefore 0.6·*n* em wide and one line tall, known at build time. `src/lib/handmark.ts` generates each path (a loose loop or a wavering underline) in a viewBox of 20 units per em from a fixed seed, and the SVG is sized in `em`. The marks are in the prerendered HTML, they cause no layout shift, and they stay correct at any font size or zoom. The 0.6em assumption was checked in Chrome: every mark measures exactly 0.6em per character.

## Two languages

English at `/`, Spanish at `/es/`, each a real prerendered page with `lang`, `hreflang` alternates (plus `x-default`), and its own Open Graph card. Facts that must not differ between languages (dates, links, the email) live once in `src/content/facts.ts`. Both content files implement the same `SiteContent` type, and a test compares their full structure and the numbers they state. There is no automatic redirect by browser language; the switch is a link in the header and the footer.

## SEO and sharing

`src/lib/head.ts` writes the title, description, canonical URL, `hreflang`, Open Graph and Twitter tags, and a schema.org `Person` with no phone or address. The sitemap lists the two home pages with their alternates. The résumé pages are `noindex` so search results lead to the portfolio rather than a duplicate. The Open Graph cards are rendered by `scripts/render-images.mjs` from the same content and the same mark generator as the page. All absolute URLs come from `SITE_URL`, and every internal path goes through `withBase()`, so the build also works under a sub-path such as a GitHub Pages project site.

## Privacy by construction

`scripts/privacy-rules.mjs` defines what must never be published. `scripts/check-privacy.mjs` applies it at the end of every build to `dist/` and to every file git would commit (`git ls-files --cached --others --exclude-standard`), and the tests apply it to every rendered page. Generic rules are in the repository: phone-like numbers in any format (lists of years excluded), `tel:` links and phone labels, street words and abbreviations, ID formats, secrets and unexpected emails. `tests/privacy.test.ts` proves each rule fires on an invented leak and stays quiet on the site's real content; secret-shaped samples are assembled at run time so no literal token sits in the repository, where GitHub's push protection would also reject it.

The exact private strings are not in the repository: a phone number has so little entropy that even its hash can be reversed by brute force. They live in the git-ignored `notes/private-denylist.txt` and are checked when present, matching numbers by their digits (any formatting) and phrases across HTML whitespace and React's comment separators.

## Evidence that can be re-run

The review example claims that the model answer doesn't compile on Spring Boot 3 and that the fix does. `evidence/spring-security-review/verify.mjs` downloads the exact libraries Spring Boot 3.5.16 manages (pinned by SHA-256), compiles each case with `javac -Xlint:all` and checks the compiler's output against every claim. CI runs it on each push. Writing that check corrected one of the review's own notes, which had wrongly said `.and()` was deprecated.

## Accessibility

- Landmarks, one `h1` per page, headings in order, a skip link, and visible focus on every interactive element.
- The task-to-evidence mapping is a list of headed items, not a `<table>` restyled for phones, which would lose its semantics in Safari.
- Colour is never the only signal: issues have numbers, diff lines have `+`, rubric results have a check or a cross and a word.
- `prefers-reduced-motion` removes every animation and transition; marks appear already drawn.
- In forced-colors (high-contrast) mode the selected view is marked with an outline and an underline, since backgrounds are replaced.
- Without `:has()` support the page falls back to showing the model answer only: the default rules are kept out of the `:has()` selector lists, because one unsupported selector invalidates a whole list.
- Every text colour pair meets WCAG AA in both themes (ratios in `art-direction.md`).

## Known trade-offs

- The Content Security Policy allows inline style attributes (`style-src 'unsafe-inline'`), because the timeline positions its bars with CSS custom properties. Scripts are strictly same-origin.
- Dark mode follows the operating system; there is no manual toggle.
- One `404.html` serves both languages, with the Spanish text below the English.
- `vite preview` (with `appType: 'mpa'`) answers unknown paths with an empty 404 and doesn't add a trailing slash to `/es`; Cloudflare Pages serves `404.html` with the 404 status and redirects `/es` to `/es/`. Internal links always carry the trailing slash.
- `SITE_URL` must be a bare origin and `BASE_PATH` is normalised to `/…/`; an invalid value stops the build instead of publishing broken canonical URLs.

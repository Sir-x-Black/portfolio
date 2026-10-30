# Deployment

The site is static: `npm run build` writes everything to `dist/`. It is hosted on **Cloudflare Pages**, free plan, at **https://gonzalo-palavesino.pages.dev**, with HTTPS, a global CDN and the security headers in `public/_headers`. GitHub Pages is documented below as an alternative.

Nothing here touches the existing `Sir-x-Black.github.io` repository or the Project Duck page.

## How it is deployed

The Cloudflare project `gonzalo-palavesino` was created on 29 October 2026 by **Direct Upload**: the site is built on a computer or in CI, and Wrangler, Cloudflare's CLI, uploads `dist/`. Cloudflare itself builds nothing.

From a computer logged in to Wrangler:

```sh
npm run deploy    # build (with the privacy check), then upload to production
```

Wrangler is run through `npx` at a pinned version (4.156.0), not installed as a dependency. To log in with only the permissions deployment needs, and to revoke that login later:

```sh
npx --yes wrangler@4.156.0 login --scopes account:read user:read pages:write
npx --yes wrangler@4.156.0 logout
```

Two things to know about this setup:

- **A Direct Upload project can't be connected to a Git repository later** ([Cloudflare's documentation](https://developers.cloudflare.com/pages/get-started/direct-upload/)). Deployments from GitHub go through GitHub Actions instead (next section), which keeps the same project and address.
- **Cloudflare now recommends Workers for new projects**, and Wrangler 4.156 tries to create new Pages projects as Workers. This project was created on classic Pages with `wrangler pages project create gonzalo-palavesino --production-branch main --force`, to keep the `pages.dev` address and the header behaviour the site was tested with. `--force` was needed only for creating it; later commands go straight to Pages.

## Deploying from GitHub

The code lives at [github.com/Sir-x-Black/portfolio](https://github.com/Sir-x-Black/portfolio). `.github/workflows/ci.yml` has a `deploy` job that publishes `main` to this project once the typecheck, lint, tests, build, privacy check and compile check have passed. It is skipped until the repository has the token:

1. In Cloudflare, create a token ([Cloudflare's guide](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)): open the **Account API tokens** page, then **Create Token** > **Custom token** > **Get started**. Name it `portfolio-deploy` and give it a single permission: **Account** > **Cloudflare Pages** > **Edit**. Select **Continue to summary** > **Create Token**, and copy the token; it is shown once.
2. In the GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**:
   - **Secrets** > **New repository secret**: `CLOUDFLARE_API_TOKEN`, with the token.
   - **Variables** > **New repository variable**: `CLOUDFLARE_ACCOUNT_ID`, with the account ID (it appears in the dashboard URL and in `npx wrangler whoami`).
3. Push to `main`. The run ends with **Deploy to Cloudflare Pages**, and the repository sidebar shows the `production` environment with the site's address.

Only the upload step receives the token; `npm ci` and the build run without it.

## Checking a deployment

The first deployment was checked on 29 October 2026; the results are in [`qa-report.md`](qa-report.md#live-deployment). To repeat the main checks after a deployment:

- [ ] `/` and `/es/` load, and the language links switch between them.
- [ ] `/cv/` and `/es/cv/` load and print to two A4 pages.
- [ ] A made-up path such as `/nope` shows the 404 page with status 404.
- [ ] Headers are applied:

  ```sh
  curl -sI https://gonzalo-palavesino.pages.dev/ | grep -iE "content-security-policy|x-content-type-options|referrer-policy"
  ```

- [ ] The page source has `<link rel="canonical">` pointing at the `pages.dev` address, not at `localhost`.
- [ ] Optional: paste the URL into LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/) to see the share card.

## Everyday use

- Once the repository is configured, every push to `main` deploys to production after CI passes. Without it, `npm run deploy` does the same from a logged-in computer.
- For a preview before publishing, upload under another branch name: `npm run build`, then `npx --yes wrangler@4.156.0 pages deploy dist --project-name gonzalo-palavesino --branch preview`. It appears at `preview.gonzalo-palavesino.pages.dev`. Cloudflare sends `X-Robots-Tag: noindex` on preview addresses, and their canonical tags still point at production.
- To roll back, open the project's **Deployments** tab in the dashboard and choose **Rollback** on an earlier deployment.

## Custom domain (optional, not free)

If you later buy a domain (for example `palavesino.dev`), add it in the project's **Custom domains** tab, follow the DNS instructions, then change `SITE_URL` to the new origin and deploy again. Cloudflare keeps the `pages.dev` address working.

## If something fails

| Symptom | Fix |
|---|---|
| Wrangler: `Authentication error` or `You are not authenticated` | Log in again with the command above. In CI, check that the secret and the variable exist and that the token has **Cloudflare Pages: Edit**. |
| `Privacy check failed` | The output lists the file and the rule. Remove the private data from `src/content/` and deploy again. |
| Share cards or the sitemap show the wrong domain | The build ran with a different `SITE_URL`. It defaults to the production address; unset it and build again. |
| You enabled Cloudflare Web Analytics and the browser console shows a CSP error | Add `https://static.cloudflareinsights.com` to `script-src` and `https://cloudflareinsights.com` to `connect-src` in `public/_headers`. |
| Creating a new Pages project fails with `Missing entry-point to Worker script or to assets directory` | Wrangler tried to create it as a Worker. Add `--force` to `wrangler pages project create`. |

## Alternative: GitHub Pages

The repository includes `.github/workflows/deploy-github-pages.yml`, which runs only when started by hand.

1. In the `portfolio` repository: **Settings** > **Pages** > **Build and deployment** > **Source**: **GitHub Actions**.
2. **Actions** > **Deploy to GitHub Pages** > **Run workflow**.
3. The site appears at `https://sir-x-black.github.io/portfolio/`. The workflow sets `BASE_PATH` and `SITE_URL` from the Pages configuration, so every link and asset gets the `/portfolio/` prefix.

Differences from Cloudflare: GitHub Pages ignores `public/_headers`, so the Content Security Policy and other headers are not sent, and there are no preview deployments. A project site at `/portfolio/` is separate from the Project Duck page at the domain root and doesn't change it.

Use one host, not both, or set the canonical `SITE_URL` to the one you link from your profiles.

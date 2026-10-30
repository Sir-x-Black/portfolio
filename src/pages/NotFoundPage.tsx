import { getContent } from '../content';
import type { SiteContent } from '../content/types';
import { withBase } from '../lib/paths';
import { homeOf } from '../lib/routes';

/** One 404 page serves both languages, so it carries the Spanish text too. */
export function NotFoundPage({ content }: { content: SiteContent }) {
  const spanish = getContent('es').notFound;
  return (
    <main id="main" className="page not-found" tabIndex={-1}>
      <h1 className="not-found__title">{content.notFound.heading}</h1>
      <p>{content.notFound.body}</p>
      <p>
        <a className="button button--primary" href={withBase(homeOf('en').path)}>
          {content.notFound.home}
        </a>
      </p>
      <div lang="es" className="not-found__alt">
        <p className="not-found__title-alt">{spanish.heading}</p>
        <p>{spanish.body}</p>
        <p>
          <a className="text-link" href={withBase(homeOf('es').path)}>
            {spanish.home}
          </a>
        </p>
      </div>
    </main>
  );
}

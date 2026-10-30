import { facts } from '../content/facts';
import type { SiteContent } from '../content/types';
import { withBase } from '../lib/paths';
import { alternateOf, homeOf, type Route } from '../lib/routes';
import { Rich } from './Rich';

export function SiteFooter({ content, route }: { content: SiteContent; route: Route }) {
  const { footer, ui } = content;
  const alternate = alternateOf(route) ?? homeOf(content.locale === 'en' ? 'es' : 'en');
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__colophon">
          <Rich text={footer.colophon} />
          {facts.links.source && (
            <>
              {' '}
              <a href={facts.links.source}>{footer.source}</a>
            </>
          )}
        </p>
        <p className="site-footer__meta">
          <span>{footer.rights}</span>
          <a href={withBase(alternate.path)} hrefLang={alternate.locale} lang={alternate.locale}>
            {ui.otherLanguage.label}
          </a>
        </p>
      </div>
    </footer>
  );
}

import type { SiteContent } from '../content/types';
import { withBase } from '../lib/paths';
import { alternateOf, cvOf, homeOf, type Route } from '../lib/routes';

export function SiteHeader({ content, route }: { content: SiteContent; route: Route }) {
  const { ui } = content;
  const home = homeOf(content.locale);
  const alternate = alternateOf(route) ?? homeOf(content.locale === 'en' ? 'es' : 'en');
  const onHome = route.page === 'home';
  const section = (id: string) => (onHome ? `#${id}` : `${withBase(home.path)}#${id}`);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="wordmark" href={withBase(home.path)}>
          {content.hero.name}
        </a>
        <nav className="site-nav" aria-label={ui.primaryNav}>
          <ul>
            <li>
              <a href={section('ai-training')}>{ui.nav.aiFit}</a>
            </li>
            <li>
              <a href={section('experience')}>{ui.nav.experience}</a>
            </li>
            <li>
              <a href={section('work')}>{ui.nav.work}</a>
            </li>
            <li>
              <a href={section('contact')}>{ui.nav.contact}</a>
            </li>
          </ul>
        </nav>
        <div className="site-header__tools">
          <a href={withBase(cvOf(content.locale).path)} aria-current={route.page === 'cv' ? 'page' : undefined}>
            {ui.cvLink}
          </a>
          <a href={withBase(alternate.path)} hrefLang={alternate.locale} lang={alternate.locale}>
            <span className="visually-hidden">{ui.otherLanguage.label}: </span>
            {ui.otherLanguage.name}
          </a>
        </div>
      </div>
    </header>
  );
}

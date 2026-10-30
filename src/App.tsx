import type { SiteContent } from './content/types';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import type { Route } from './lib/routes';
import { CvPage } from './pages/CvPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App({ route, content }: { route: Route; content: SiteContent }) {
  return (
    <>
      <a className="skip-link" href="#main">
        {content.ui.skipToContent}
      </a>
      <SiteHeader content={content} route={route} />
      {route.page === 'home' && <HomePage content={content} />}
      {route.page === 'cv' && <CvPage content={content} />}
      {route.page === 'notFound' && <NotFoundPage content={content} />}
      <SiteFooter content={content} route={route} />
    </>
  );
}

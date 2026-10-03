import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import DocumentTitle from './DocumentTitle';
import type { Lang } from './i18n';

/** Styled 404 page for both languages. */
export default function NotFoundContent({ lang }: { lang: Lang }) {
  const en = lang === 'en';
  return (
    <>
      <DocumentTitle title={en ? 'Page not found | bfsg-checken.de' : 'Seite nicht gefunden | bfsg-checken.de'} />
      <SiteHeader lang={lang} deHref="/" enHref="/en" />

      <main id="main">
        <div className="wrap notFound">
          <p className="notFoundCode" aria-hidden="true">404</p>
          <h1>{en ? 'Page not found' : 'Seite nicht gefunden'}</h1>
          <p>
            {en
              ? 'The page you are looking for does not exist or has been moved. Run a free accessibility check on the home page instead.'
              : 'Die gesuchte Seite gibt es nicht oder sie wurde verschoben. Auf der Startseite können Sie stattdessen einen kostenlosen BFSG-Check starten.'}
          </p>
          <a className="ctaBtn" href={en ? '/en' : '/'}>
            {en ? 'Go to the accessibility check →' : 'Zum BFSG-Check →'}
          </a>
        </div>
      </main>

      <div className="wrap">
        <SiteFooter lang={lang} />
      </div>
    </>
  );
}

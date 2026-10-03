import type { Lang } from './i18n';

interface Props {
  lang: Lang;
  /** URL of the German version of the current page */
  deHref: string;
  /** URL of the English version of the current page (or the English home page) */
  enHref: string;
}

/** Site header with logo and DE | EN language switch (used on every page). */
export default function SiteHeader({ lang, deHref, enHref }: Props) {
  return (
    <>
    <a className="skipLink" href="#main">
      {lang === 'en' ? 'Skip to main content' : 'Zum Hauptinhalt springen'}
    </a>
    <header className="header">
      <div className="wrap">
        <a className="header-logo" href={lang === 'en' ? '/en' : '/'}>
          <span aria-hidden="true">♿ </span><span className="logoAccent">BFSG</span>-checken.de
        </a>
        <nav className="langSwitch" aria-label={lang === 'en' ? 'Language' : 'Sprache'}>
          <a
            href={deHref}
            hrefLang="de"
            lang="de"
            aria-current={lang === 'de' ? 'page' : undefined}
          >
            DE<span className="srOnly"> – Deutsch</span>
          </a>
          <span className="langSep" aria-hidden="true">|</span>
          <a
            href={enHref}
            hrefLang="en"
            lang="en"
            aria-current={lang === 'en' ? 'page' : undefined}
          >
            EN<span className="srOnly"> – English</span>
          </a>
        </nav>
      </div>
    </header>
    </>
  );
}

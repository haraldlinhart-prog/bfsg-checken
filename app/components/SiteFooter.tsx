import ImpressumWidget from './ImpressumWidget';
import type { Lang } from './i18n';

interface Props {
  lang: Lang;
  /** On the contact page the last link points back to the check instead of to the contact page */
  showCheckLink?: boolean;
}

/** Site footer for both languages. Legal texts (Impressum, Datenschutz) exist in German only. */
export default function SiteFooter({ lang, showCheckLink = false }: Props) {
  const en = lang === 'en';
  return (
    <footer className="footer">
      <p className="footerLinks">
        {en ? 'A tool by' : 'Ein Tool von'}{' '}
        <a href={en ? 'https://webmaster.plus/en' : 'https://webmaster.plus'} target="_blank" rel="noopener noreferrer">webmaster.plus</a>
        {' · '}
        {en ? 'Part of the' : 'Teil des'}{' '}
        <a href="https://www.pan21.info" target="_blank" rel="noopener noreferrer" hrefLang="de">
          {en ? 'PAN21 network' : 'PAN21-Netzwerks'}
        </a>
        {' · '}
        {en ? (
          <a href="/datenschutz" hrefLang="de">Privacy policy (in German)</a>
        ) : (
          <a href="/datenschutz">Datenschutz</a>
        )}
        {' · '}
        {showCheckLink ? (
          <a href={en ? '/en' : '/'}>{en ? 'Run an accessibility check' : 'BFSG-Check starten'}</a>
        ) : (
          <a href={en ? '/en/contact' : '/kontakt'}>{en ? 'Contact' : 'Kontakt'}</a>
        )}
      </p>
      <div className="footerSeals">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="footerBadge"
          src="https://www.bfsg-checken.de/badge/bfsg-checken.de.svg"
          alt={en ? 'BFSG accessibility seal of bfsg-checken.de' : 'BFSG-Prüfsiegel von bfsg-checken.de'}
          width="120"
          height="120"
        />
        <div className="footerLegal">
          {en && <span>Legal notice (in German):</span>}
          <span lang="de">
            <ImpressumWidget />
          </span>
        </div>
      </div>
    </footer>
  );
}

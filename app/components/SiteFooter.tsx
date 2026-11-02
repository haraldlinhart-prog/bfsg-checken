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
      {/* Verzeichnis-Banner: Swiss Quality, German Quality, FFA-Links */}
      <div style={{ display:"flex", justifyContent:"center", gap:"12px", flexWrap:"wrap", margin:"1rem 0 0" }}>
        <a href="https://www.swiss-quality.de/ref/7fddac156971359bec" target="_blank" rel="noopener"><img src="https://www.swiss-quality.de/banner.svg" width="120" height="60" alt="Swiss Quality" /></a>
        <a href="https://www.german-quality.net/ref/a754331c068c154f83" target="_blank" rel="noopener"><img src="https://www.german-quality.net/banner.svg" width="120" height="60" alt="German Quality" /></a>
        <a href="https://www.ffa-links.de/ref/c99e1cf475cb1b2070" target="_blank" rel="noopener"><img src="https://www.ffa-links.de/banner.svg" width="120" height="60" alt="FFA-Links" /></a>
      </div>
      {/* Tool-Badges: site-ok.de, kaputte-links.de, pagespeed-plus.de */}
      <div style={{ display:"flex", justifyContent:"center", gap:"12px", flexWrap:"wrap", margin:"1rem 0 0" }}>
        <a href="https://www.site-ok.de/status.html?key=1yqneqj0gu" target="_blank" rel="noopener"><img src="https://www.site-ok.de/api/badge?key=1yqneqj0gu" alt="Site-Status" width="320" height="80" /></a>
        <a href="https://www.kaputte-links.de/status.html?key=cd85tr1zng" target="_blank" rel="noopener"><img src="https://www.kaputte-links.de/api/badge?key=cd85tr1zng" alt="Link-Status" width="320" height="80" /></a>
        <a href="https://www.pagespeed-plus.de/status.html?key=s35mxac77m" target="_blank" rel="noopener"><img src="https://www.pagespeed-plus.de/api/badge?key=s35mxac77m" alt="PageSpeed Score" /></a>
      </div>
    </footer>
  );
}

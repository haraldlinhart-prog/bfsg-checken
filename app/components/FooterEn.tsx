import ImpressumWidget from './ImpressumWidget';

/** Footer for the English pages. Legal texts are only available in German. */
export default function FooterEn({ showCheckLink = false }: { showCheckLink?: boolean }) {
  return (
    <footer className="footer">
      <p>
        A tool by{' '}
        <a href="https://webmaster.plus" target="_blank" rel="noopener noreferrer">webmaster.plus</a>
        {' '}· Part of the{' '}
        <a href="https://www.pan21.info" target="_blank" rel="noopener noreferrer">PAN21 network</a>
        {' '}·{' '}
        <a href="/datenschutz" hrefLang="de">Privacy policy (German)</a>
        {' '}·{' '}
        {showCheckLink ? (
          <a href="/en">Run an accessibility check</a>
        ) : (
          <a href="/en/contact">Contact</a>
        )}
      </p>
      <p className="footerLegal">
        <span>Legal notice (in German):</span>{' '}
        <span lang="de">
          <ImpressumWidget />
        </span>
      </p>
    </footer>
  );
}

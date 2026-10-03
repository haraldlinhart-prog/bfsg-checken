import CheckForm from './CheckForm';
import ImpressumWidget from './ImpressumWidget';

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="wrap">
          <a className="header-logo" href="/">
            ♿ <span>BFSG</span>-checken.de
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap">
            <h1>Ist Ihre Website barrierefrei?</h1>
            <p>
              Kostenloser BFSG-Schnellcheck: URL eingeben, Ergebnis sofort sehen —
              Alt-Texte, Sprache, Überschriften, Formulare, ARIA-Landmarks und mehr.
            </p>
            <CheckForm />
          </div>
        </section>
      </main>

      <div className="wrap">
        <section className="cta">
          <h2>Professionelle Hilfe gesucht?</h2>
          <p>
            Wir sind echte Webmaster — Server, Domains, Datenbanken, Formulare, Automatisierung.
            Beschreiben Sie Ihr Problem und nennen Sie Ihren Preis.
          </p>
          <a className="ctaBtn" href="https://webmaster.plus" target="_blank" rel="noopener noreferrer">
            Zu webmaster.plus →
          </a>
        </section>

        <footer className="footer">
          <p>
            Ein Tool von{' '}
            <a href="https://webmaster.plus" target="_blank" rel="noopener noreferrer">webmaster.plus</a>
            {' '}· Teil des{' '}
            <a href="https://www.pan21.info" target="_blank" rel="noopener noreferrer">PAN21-Netzwerks</a>
            {' '}·{' '}
            <ImpressumWidget />
            {' '}·{' '}
            <a href="/datenschutz">Datenschutz</a>
            {' '}·{' '}
            <a href="/kontakt">Kontakt</a>
            {' '}·{' '}
            <a href="/blog">Blog</a>
          </p>
        </footer>
      </div>
    </>
  );
}

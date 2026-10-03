import type { Metadata } from 'next';
import CheckForm from '../components/CheckForm';
import ImpressumWidget from '../components/ImpressumWidget';
import SiteHeader from '../components/SiteHeader';
import { alternatesFor } from '../components/i18n';

export const metadata: Metadata = {
  alternates: alternatesFor('/', '/en', 'de'),
};

export default function Home() {
  return (
    <>
      <SiteHeader lang="de" deHref="/" enHref="/en" />

      <main>
        <section className="hero">
          <div className="wrap">
            <h1>Ist Ihre Website barrierefrei?</h1>
            <p>
              Kostenloser BFSG-Schnellcheck: URL eingeben, Ergebnis sofort sehen —
              Alt-Texte, Sprache, Überschriften, Formulare, ARIA-Landmarks und mehr.
            </p>
            <CheckForm lang="de" />
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

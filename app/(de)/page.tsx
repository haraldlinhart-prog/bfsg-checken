import type { Metadata } from 'next';
import CheckForm from '../components/CheckForm';
import HomeInfo from '../components/HomeInfo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { alternatesFor } from '../components/i18n';

export const metadata: Metadata = {
  alternates: alternatesFor('/', '/en', 'de'),
};

export default function Home() {
  return (
    <>
      <SiteHeader lang="de" deHref="/" enHref="/en" />

      <main id="main">
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

        <div className="wrap">
          <HomeInfo lang="de" />
        </div>
      </main>

      <div className="wrap">
        <section className="cta" aria-labelledby="cta-heading">
          <h2 id="cta-heading">Professionelle Hilfe gesucht?</h2>
          <p>
            Wir sind echte Webmaster — Server, Domains, Datenbanken, Formulare, Automatisierung.
            Beschreiben Sie Ihr Problem und nennen Sie Ihren Preis.
          </p>
          <a className="ctaBtn" href="https://webmaster.plus" target="_blank" rel="noopener noreferrer">
            Zu webmaster.plus →
          </a>
        </section>

        <SiteFooter lang="de" />
      </div>
    </>
  );
}

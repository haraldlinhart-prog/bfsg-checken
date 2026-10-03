import type { Metadata } from 'next';
import CheckForm from '../components/CheckForm';
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
          <section className="info" aria-labelledby="about-bfsg">
            <h2 id="about-bfsg">Was ist das BFSG?</h2>
            <p>
              Das Barrierefreiheitsstärkungsgesetz (BFSG) setzt den European Accessibility Act (EAA)
              in deutsches Recht um. Seit dem 28. Juni 2025 müssen viele digitale Produkte und
              Dienstleistungen für Verbraucher — etwa Onlineshops, Buchungsportale und
              Bankdienstleistungen — für Menschen mit Behinderungen zugänglich sein.
            </p>
            <p>
              Gemessen wird Barrierefreiheit in der Praxis an den Web Content Accessibility
              Guidelines (WCAG), auf die die europäische Norm EN&nbsp;301&nbsp;549 verweist.
              Dieser Schnellcheck prüft automatisch zentrale WCAG-Kriterien und zeigt Ihnen, wo Sie
              ansetzen sollten. Er liefert eine erste Einschätzung — er ersetzt weder ein
              vollständiges Audit noch eine Rechtsberatung.
            </p>
          </section>
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

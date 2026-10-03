import ContactForm from '../../components/ContactForm';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { alternatesFor } from '../../components/i18n';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt | bfsg-checken.de',
  description: 'Fragen zur Barrierefreiheit, zum BFSG oder zum BFSG-Siegel? Schreiben Sie uns — wir helfen Ihnen gerne weiter.',
  alternates: alternatesFor('/kontakt', '/en/contact', 'de'),
  openGraph: {
    title: 'Kontakt | bfsg-checken.de',
    description: 'Fragen zur Barrierefreiheit, zum BFSG oder zum BFSG-Siegel? Schreiben Sie uns — wir helfen Ihnen gerne weiter.',
    url: '/kontakt',
    siteName: 'bfsg-checken.de',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    type: 'website',
  },
};

export default function KontaktPage() {
  return (
    <>
      <SiteHeader lang="de" deHref="/kontakt" enHref="/en/contact" />

      <main id="main">
        <section className="hero" style={{ paddingBottom: '0' }}>
          <div className="wrap">
            <h1>Kontakt</h1>
            <p>
              Fragen zur Barrierefreiheit, zum BFSG-Siegel oder zur professionellen Beratung?
              Schreiben Sie uns — wir antworten in der Regel innerhalb von 24 Stunden.
            </p>
          </div>
        </section>

        <div className="wrap">
          <ContactForm lang="de" />
        </div>
      </main>

      <div className="wrap">
        <SiteFooter lang="de" showCheckLink />
      </div>
    </>
  );
}

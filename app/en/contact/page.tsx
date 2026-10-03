import type { Metadata } from 'next';
import ContactForm from '../../components/ContactForm';
import SiteHeader from '../../components/SiteHeader';
import FooterEn from '../../components/FooterEn';
import { alternatesFor } from '../../components/i18n';

export const metadata: Metadata = {
  title: 'Contact | bfsg-checken.de',
  description: 'Questions about web accessibility, the BFSG or the European Accessibility Act? Write to us — we’re happy to help.',
  alternates: alternatesFor('/kontakt', '/en/contact', 'en'),
  openGraph: {
    title: 'Contact | bfsg-checken.de',
    description: 'Questions about web accessibility, the BFSG or the European Accessibility Act? Write to us — we’re happy to help.',
    url: '/en/contact',
    siteName: 'bfsg-checken.de',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader lang="en" deHref="/kontakt" enHref="/en/contact" />

      <main>
        <section className="hero" style={{ paddingBottom: '0' }}>
          <div className="wrap">
            <h1>Contact</h1>
            <p>
              Questions about accessibility, the BFSG seal or professional consulting?
              Write to us — we usually reply within 24 hours.
            </p>
          </div>
        </section>

        <div className="wrap">
          <ContactForm lang="en" />
        </div>
      </main>

      <div className="wrap">
        <FooterEn showCheckLink />
      </div>
    </>
  );
}

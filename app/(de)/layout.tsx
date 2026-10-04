import type { Metadata } from 'next';
import '../globals.css';
import { SITE_URL } from '../components/i18n';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Kostenloser BFSG-Check: Barrierefreiheit prüfen | bfsg-checken.de',
  description: 'Kostenloser BFSG-Check für Ihre Website. Prüfen Sie Barrierefreiheit nach dem Barrierefreiheitsstärkungsgesetz — Alt-Texte, Sprachangabe, Überschriften, Formulare und mehr.',
  openGraph: {
    title: 'BFSG-Check — Ist Ihre Website barrierefrei?',
    description: 'Kostenloser BFSG-Check: Alt-Texte, Sprachangabe, Überschriften, Formulare, ARIA, Fokus-Indikatoren.',
    url: SITE_URL,
    siteName: 'bfsg-checken.de',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}

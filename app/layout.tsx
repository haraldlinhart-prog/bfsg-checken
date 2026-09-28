import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BFSG-Check | bfsg-checken.de',
  description: 'Kostenloser BFSG-Check für Ihre Website. Prüfen Sie Barrierefreiheit nach dem Barrierefreiheitsstärkungsgesetz — Alt-Texte, Sprachangabe, Überschriften, Formulare und mehr.',
  openGraph: {
    title: 'BFSG-Check — Ist Ihre Website barrierefrei?',
    description: 'Kostenloser BFSG-Check: Alt-Texte, Sprachangabe, Überschriften, Formulare, ARIA, Fokus-Indikatoren.',
    url: 'https://bfsg-checken.de',
    siteName: 'bfsg-checken.de',
    locale: 'de_DE',
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

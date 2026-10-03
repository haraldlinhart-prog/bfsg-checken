import type { Metadata } from 'next';
import '../globals.css';
import { SITE_URL } from '../components/i18n';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Free Website Accessibility Check (BFSG / EAA) | bfsg-checken.de',
  description: 'Free accessibility check for your website under the BFSG, Germany’s implementation of the European Accessibility Act (EAA). Checks alt text, language, headings, forms, ARIA landmarks and more against WCAG.',
  openGraph: {
    title: 'Accessibility check — is your website accessible?',
    description: 'Free accessibility check (BFSG / European Accessibility Act): alt text, language, headings, forms, ARIA, focus indicators.',
    url: `${SITE_URL}/en`,
    siteName: 'bfsg-checken.de',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
    type: 'website',
  },
};

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

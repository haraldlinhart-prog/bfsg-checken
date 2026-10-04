import { ImageResponse } from 'next/og';
import type { Lang } from './i18n';

/** Open Graph image (1200×630) for both languages, in the site's dark colour scheme.
 *  All text colours have a contrast ratio of at least 7:1 against the background. */
export const OG_SIZE = { width: 1200, height: 630 };

export const OG_ALT: Record<Lang, string> = {
  de: 'bfsg-checken.de – Kostenloser BFSG-Check: Prüfen Sie die Barrierefreiheit Ihrer Website',
  en: 'bfsg-checken.de – Free accessibility check: test your website under the BFSG / European Accessibility Act',
};

const TEXT: Record<Lang, { title: string; claim: string; tags: string }> = {
  de: {
    title: 'Kostenloser BFSG-Check',
    claim: 'Ist Ihre Website barrierefrei? Zentrale WCAG-Kriterien automatisch prüfen.',
    tags: 'Barrierefreiheitsstärkungsgesetz · European Accessibility Act · WCAG',
  },
  en: {
    title: 'Free accessibility check',
    claim: 'Is your website accessible? Test key WCAG criteria automatically.',
    tags: 'BFSG · European Accessibility Act · WCAG',
  },
};

export function ogImage(lang: Lang) {
  const t = TEXT[lang];
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0f1117',
          color: '#f1f5f9',
          padding: '64px 72px',
          borderTop: '16px solid #7c3aed',
        }}
      >
        <div style={{ display: 'flex', fontSize: 44 }}>
          <span style={{ color: '#c4b5fd' }}>BFSG</span>
          <span>-checken.de</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 84, lineHeight: 1.1, marginBottom: 28 }}>{t.title}</div>
          <div style={{ display: 'flex', fontSize: 40, lineHeight: 1.35, color: '#e2e8f0', maxWidth: 1000 }}>
            {t.claim}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#cbd5e1' }}>{t.tags}</div>
      </div>
    ),
    OG_SIZE
  );
}

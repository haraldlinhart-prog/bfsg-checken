import type { MetadataRoute } from 'next';
import { SITE_URL } from './components/i18n';

/** German and English pages with hreflang alternates (the privacy policy exists in German only). */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pair = (de: string, en: string, priority: number): MetadataRoute.Sitemap => {
    const languages = { de: `${SITE_URL}${de}`, en: `${SITE_URL}${en}`, 'x-default': `${SITE_URL}${de}` };
    return [
      { url: `${SITE_URL}${de}`, lastModified, changeFrequency: 'monthly', priority, alternates: { languages } },
      { url: `${SITE_URL}${en}`, lastModified, changeFrequency: 'monthly', priority, alternates: { languages } },
    ];
  };
  return [
    ...pair('/', '/en', 1),
    ...pair('/kontakt', '/en/contact', 0.5),
    { url: `${SITE_URL}/datenschutz`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
  ];
}

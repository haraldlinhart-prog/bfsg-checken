export type Lang = 'de' | 'en';

/** Canonical origin (the apex domain redirects to www). */
export const SITE_URL = 'https://www.bfsg-checken.de';

/** hreflang alternates for a page that exists in both languages. */
export function alternatesFor(dePath: string, enPath: string, current: Lang) {
  return {
    canonical: current === 'en' ? enPath : dePath,
    languages: {
      de: dePath,
      en: enPath,
      'x-default': dePath,
    },
  };
}

import type { Metadata } from 'next';
import CheckForm from '../components/CheckForm';
import HomeInfo from '../components/HomeInfo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { alternatesFor } from '../components/i18n';

export const metadata: Metadata = {
  alternates: alternatesFor('/', '/en', 'en'),
};

export default function HomeEn() {
  return (
    <>
      <SiteHeader lang="en" deHref="/" enHref="/en" />

      <main id="main">
        <section className="hero">
          <div className="wrap">
            <h1>Is your website accessible?</h1>
            <p>
              Free quick accessibility check: enter a URL and see the results instantly —
              alt text, language, headings, forms, ARIA landmarks and more.
            </p>
            <CheckForm lang="en" />
          </div>
        </section>

        <div className="wrap">
          <HomeInfo lang="en" />
        </div>
      </main>

      <div className="wrap">
        <section className="cta" aria-labelledby="cta-heading">
          <h2 id="cta-heading">Looking for professional help?</h2>
          <p>
            We&rsquo;re real webmasters — servers, domains, databases, forms, automation.
            Describe your problem and name your price.
          </p>
          <a className="ctaBtn" href="https://webmaster.plus/en" target="_blank" rel="noopener noreferrer">
            Go to webmaster.plus →
          </a>
        </section>

        <SiteFooter lang="en" />
      </div>
    </>
  );
}

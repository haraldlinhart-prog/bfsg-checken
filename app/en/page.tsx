import type { Metadata } from 'next';
import CheckForm from '../components/CheckForm';
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
          <section className="info" aria-labelledby="about-bfsg">
            <h2 id="about-bfsg">What is the BFSG?</h2>
            <p>
              The <span lang="de">Barrierefreiheitsstärkungsgesetz</span> (BFSG) is Germany&rsquo;s
              implementation of the European Accessibility Act (EAA). Since 28 June 2025, many
              digital products and services offered to consumers in Germany — such as online
              shops, booking platforms and banking services — must be accessible to people
              with disabilities.
            </p>
            <p>
              In practice, accessibility is measured against the Web Content Accessibility
              Guidelines (WCAG), referenced by the European standard EN&nbsp;301&nbsp;549.
              This quick check automatically tests key WCAG criteria and shows you where to
              start. It gives you a first indication — it is not a full audit or legal advice.
            </p>
          </section>
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

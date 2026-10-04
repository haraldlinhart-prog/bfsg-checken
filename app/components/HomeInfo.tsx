import { SITE_URL, type Lang } from './i18n';

/**
 * Server-rendered explanatory content for the home pages (what the check covers, BFSG basics,
 * target audience, FAQ) plus the matching JSON-LD. The FAQ texts are plain strings so the
 * visible FAQ and the FAQPage structured data are always identical.
 */

interface Faq {
  q: string;
  a: string;
}

const FAQ: Record<Lang, Faq[]> = {
  de: [
    {
      q: 'Ist der BFSG-Check kostenlos?',
      a: 'Ja. Der Check kostet nichts und erfordert keine Registrierung. Voraussetzung ist, dass Sie das Siegel von bfsg-checken.de auf Ihrer Website einbinden. Den HTML-Code dafür erhalten Sie beim ersten Prüfversuch.',
    },
    {
      q: 'Warum muss ich das Siegel einbinden?',
      a: 'Der Check erkennt das Siegel automatisch im HTML-Code Ihrer Seite und startet erst dann die vollständige Auswertung. Solange das Siegel eingebunden bleibt, können Sie jederzeit einen neuen Check starten.',
    },
    {
      q: 'Welche Seiten werden geprüft?',
      a: 'Geprüft wird genau die Seite, deren URL Sie eingeben. Die übrige Website wird nicht durchsucht. Prüfen Sie wichtige Seiten wie Startseite, Produktseiten und Kontaktformular am besten einzeln.',
    },
    {
      q: 'Erfüllt meine Website alle Anforderungen, wenn alles grün ist?',
      a: 'Das lässt sich automatisch nicht feststellen. Viele Anforderungen, etwa aussagekräftige Alt-Texte, ausreichende Farbkontraste oder die vollständige Bedienbarkeit per Tastatur, kann nur ein Mensch beurteilen. Der Check ersetzt weder ein manuelles Audit noch eine Rechtsberatung.',
    },
    {
      q: 'Seit wann gilt das BFSG?',
      a: 'Seit dem 28. Juni 2025. Für einige Produkte und Dienstleistungen gelten Übergangsfristen.',
    },
    {
      q: 'Gilt das BFSG auch für meine Website?',
      a: 'Das hängt von Ihrem Angebot ab. Erfasst sind vor allem Websites und Apps, über die Verbraucher Verträge abschließen können, etwa Onlineshops oder Buchungsportale. Reine Informationsseiten fallen in der Regel nicht darunter. Kleinstunternehmen, die Dienstleistungen erbringen, sind ausgenommen. Im Zweifel sollten Sie das rechtlich prüfen lassen.',
    },
  ],
  en: [
    {
      q: 'Is the accessibility check free?',
      a: 'Yes. The check costs nothing and requires no sign-up. The only requirement is that you add the bfsg-checken.de seal to your website. You get the HTML code for it on your first check attempt.',
    },
    {
      q: 'Why do I need to add the seal?',
      a: 'The check detects the seal automatically in your page’s HTML and only then runs the full analysis. As long as the seal stays on your site, you can run a new check at any time.',
    },
    {
      q: 'Which pages are checked?',
      a: 'Only the page whose URL you enter. The rest of your website is not crawled. It is best to check important pages such as your home page, product pages and contact form one by one.',
    },
    {
      q: 'Does my website meet all requirements if everything is green?',
      a: 'That cannot be determined automatically. Many requirements, such as meaningful alt text, sufficient colour contrast or full keyboard operability, can only be assessed by a human. The check is no substitute for a manual audit or legal advice.',
    },
    {
      q: 'When did the BFSG start to apply?',
      a: 'On 28 June 2025. Transition periods apply to some products and services.',
    },
    {
      q: 'Does the BFSG apply to my website?',
      a: 'That depends on what you offer. It mainly covers websites and apps through which consumers can conclude contracts, such as online shops or booking platforms. Purely informational websites are usually not covered. Micro-enterprises providing services are exempt. If in doubt, get legal advice.',
    },
  ],
};

const TEXT = {
  de: {
    name: 'BFSG-Check von bfsg-checken.de',
    description:
      'Kostenloser automatischer Check der Barrierefreiheit einer Webseite nach dem Barrierefreiheitsstärkungsgesetz (BFSG): Sprachattribut, Alt-Texte, Überschriften, Formular-Labels, Skip-Link, Landmarks, Fokus-Indikatoren und Link-Texte.',
    url: `${SITE_URL}/`,
  },
  en: {
    name: 'Accessibility check by bfsg-checken.de',
    description:
      'Free automated accessibility check for a web page under the BFSG, Germany’s implementation of the European Accessibility Act: language attribute, alt text, headings, form labels, skip link, landmarks, focus indicators and link text.',
    url: `${SITE_URL}/en`,
  },
};

function jsonLd(lang: Lang) {
  const t = TEXT[lang];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: t.name,
        url: t.url,
        description: t.description,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        inLanguage: lang,
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        publisher: { '@type': 'Organization', name: 'PAN21.com International LLC', url: 'https://www.pan21.com' },
      },
      {
        '@type': 'FAQPage',
        inLanguage: lang,
        mainEntity: FAQ[lang].map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
}

function Checks({ lang }: { lang: Lang }) {
  if (lang === 'en') {
    return (
      <section className="info" aria-labelledby="what-we-check">
        <h2 id="what-we-check">What does the check examine?</h2>
        <p>
          The check loads the page you enter and analyses its HTML code plus up to five linked
          stylesheets. It tests:
        </p>
        <ul>
          <li><strong>Language attribute:</strong> does the <code>&lt;html&gt;</code> element have a <code>lang</code> attribute? (WCAG 3.1.1)</li>
          <li><strong>Alt text:</strong> do all images have an <code>alt</code> attribute? (WCAG 1.1.1)</li>
          <li><strong>Headings:</strong> are there headings, and exactly one H1? (WCAG 1.3.1)</li>
          <li><strong>Form labels:</strong> are text input fields labelled, with labels or ARIA labels? (WCAG 1.3.1)</li>
          <li><strong>Skip link:</strong> can keyboard users skip the navigation? (WCAG 2.4.1)</li>
          <li><strong>Landmarks:</strong> are <code>&lt;main&gt;</code> and <code>&lt;nav&gt;</code> present?</li>
          <li><strong>Focus indicators:</strong> is there focus styling, or is the outline suppressed? (WCAG 2.4.7)</li>
          <li><strong>Link text:</strong> are there generic link texts such as &ldquo;click here&rdquo; or &ldquo;read more&rdquo;? (WCAG 2.4.4)</li>
          <li><strong>Basics:</strong> HTTPS and whether the page is reachable.</li>
        </ul>
        <p>
          Some of these tests are heuristics: they point you to likely issues, not certain
          findings. Content loaded later via JavaScript, colour contrast, keyboard operation,
          videos and PDF documents are not checked. An automated check covers only part of the
          WCAG and does not replace a manual audit or legal advice.
        </p>
      </section>
    );
  }
  return (
    <section className="info" aria-labelledby="what-we-check">
      <h2 id="what-we-check">Was prüft der BFSG-Check?</h2>
      <p>
        Der Check lädt die von Ihnen eingegebene Seite und analysiert ihren HTML-Code sowie bis zu
        fünf eingebundene Stylesheets. Geprüft werden:
      </p>
      <ul>
        <li><strong>Sprachattribut:</strong> Hat das <code>&lt;html&gt;</code>-Element ein <code>lang</code>-Attribut? (WCAG 3.1.1)</li>
        <li><strong>Alt-Texte:</strong> Haben alle Bilder ein <code>alt</code>-Attribut? (WCAG 1.1.1)</li>
        <li><strong>Überschriften:</strong> Gibt es Überschriften und genau eine H1? (WCAG 1.3.1)</li>
        <li><strong>Formular-Labels:</strong> Sind Texteingabefelder mit Labels oder ARIA-Labels beschriftet? (WCAG 1.3.1)</li>
        <li><strong>Skip-Link:</strong> Können Tastaturnutzer die Navigation überspringen? (WCAG 2.4.1)</li>
        <li><strong>Landmarks:</strong> Sind <code>&lt;main&gt;</code> und <code>&lt;nav&gt;</code> vorhanden?</li>
        <li><strong>Fokus-Indikatoren:</strong> Gibt es Fokus-Styles, oder wird die Outline unterdrückt? (WCAG 2.4.7)</li>
        <li><strong>Link-Texte:</strong> Gibt es generische Link-Texte wie &bdquo;hier&ldquo; oder &bdquo;mehr&ldquo;? (WCAG 2.4.4)</li>
        <li><strong>Grundlagen:</strong> HTTPS und Erreichbarkeit der Seite.</li>
      </ul>
      <p>
        Einige Prüfungen sind Heuristiken: Sie liefern Hinweise, keine sicheren Befunde. Inhalte,
        die erst per JavaScript nachgeladen werden, Farbkontraste, Tastaturbedienung, Videos und
        PDF-Dokumente werden nicht geprüft. Ein automatischer Check deckt nur einen Teil der WCAG
        ab und ersetzt weder ein manuelles Audit noch eine Rechtsberatung.
      </p>
    </section>
  );
}

function About({ lang }: { lang: Lang }) {
  if (lang === 'en') {
    return (
      <>
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
            Micro-enterprises (fewer than ten employees and an annual turnover or balance sheet
            total of no more than 2 million euros) are exempt from the requirements for
            services. This exemption does not apply to products.
          </p>
          <p>
            In practice, accessibility is measured against the Web Content Accessibility
            Guidelines (WCAG), referenced by the European standard EN&nbsp;301&nbsp;549.
          </p>
        </section>
        <section className="info" aria-labelledby="who-for">
          <h2 id="who-for">Who is the check for?</h2>
          <p>
            For online shop owners, agencies, webmasters and anyone who wants a quick first
            overview: where does my website stand, and where should I start? For every test,
            the check shows what it found and names the related WCAG criterion.
          </p>
        </section>
      </>
    );
  }
  return (
    <>
      <section className="info" aria-labelledby="about-bfsg">
        <h2 id="about-bfsg">Was ist das BFSG?</h2>
        <p>
          Das Barrierefreiheitsstärkungsgesetz (BFSG) setzt den European Accessibility Act (EAA)
          in deutsches Recht um. Seit dem 28. Juni 2025 müssen viele digitale Produkte und
          Dienstleistungen für Verbraucher — etwa Onlineshops, Buchungsportale und
          Bankdienstleistungen — für Menschen mit Behinderungen zugänglich sein.
        </p>
        <p>
          Kleinstunternehmen (weniger als zehn Beschäftigte und höchstens 2&nbsp;Millionen Euro
          Jahresumsatz oder Jahresbilanzsumme) sind von den Anforderungen an Dienstleistungen
          ausgenommen. Für Produkte gilt diese Ausnahme nicht.
        </p>
        <p>
          Gemessen wird Barrierefreiheit in der Praxis an den Web Content Accessibility
          Guidelines (WCAG), auf die die europäische Norm EN&nbsp;301&nbsp;549 verweist.
        </p>
      </section>
      <section className="info" aria-labelledby="who-for">
        <h2 id="who-for">Für wen ist der Check?</h2>
        <p>
          Für Betreiber von Onlineshops, Agenturen, Webmaster und alle, die sich schnell einen
          ersten Überblick verschaffen möchten: Wo steht meine Website, und wo sollte ich zuerst
          ansetzen? Zu jedem Prüfpunkt zeigt der Check, was gefunden wurde, und nennt das
          zugehörige WCAG-Kriterium.
        </p>
      </section>
    </>
  );
}

export default function HomeInfo({ lang }: { lang: Lang }) {
  const en = lang === 'en';
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)).replace(/</g, '\\u003c') }}
      />
      <Checks lang={lang} />
      <About lang={lang} />
      <section className="info faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading">{en ? 'Frequently asked questions' : 'Häufige Fragen zum BFSG-Check'}</h2>
        {FAQ[lang].map((f) => (
          <div key={f.q} className="faqItem">
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </section>
    </>
  );
}

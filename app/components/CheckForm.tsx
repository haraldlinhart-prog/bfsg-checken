'use client';
import { useState } from 'react';
import type { Lang } from './i18n';

interface CheckResult {
  id: string;
  label: string;
  status: 'green' | 'yellow' | 'red';
  message: string;
  fix: { label: string; url: string } | null;
}

interface ApiResponse {
  url: string;
  checks: CheckResult[];
  error?: string;
  requiresBadge?: boolean;
  domain?: string;
  badgeUrl?: string;
  badgeHtml?: string;
}

/** PAN21 network tools (source: shop.pan21.com/api/webmaster-tools?v=2); English pages link to the /en versions. */
const TOOLS: { emoji: string; name: Record<Lang, string>; desc: Record<Lang, string>; url: Record<Lang, string> }[] = [
  { emoji: '🔒', name: { de: 'dsgvo-checken.de', en: 'dsgvo-checken.de' }, desc: { de: 'DSGVO-Check', en: 'GDPR check' }, url: { de: 'https://dsgvo-checken.de', en: 'https://dsgvo-checken.de/en' } },
  { emoji: '📄', name: { de: 'Impressum-Free', en: 'Impressum-Free' }, desc: { de: 'Impressum-Generator', en: 'Legal notice (Impressum) generator' }, url: { de: 'https://impressum-free.de', en: 'https://impressum-free.de/en' } },
  { emoji: '📧', name: { de: 'email-checken.de', en: 'email-checken.de' }, desc: { de: 'E-Mail-Sicherheitscheck', en: 'Email security check' }, url: { de: 'https://email-checken.de', en: 'https://email-checken.de/en' } },
  { emoji: '📊', name: { de: 'PAN21counter', en: 'PAN21counter' }, desc: { de: 'Besucherzähler', en: 'Visitor counter' }, url: { de: 'https://pan21counter.de', en: 'https://pan21counter.de/en' } },
  { emoji: '🟢', name: { de: 'site-ok.de', en: 'site-ok.de' }, desc: { de: 'Erreichbarkeit prüfen', en: 'Uptime check' }, url: { de: 'https://site-ok.de', en: 'https://site-ok.de/en' } },
  { emoji: '⚡', name: { de: 'PageSpeed-Plus', en: 'PageSpeed-Plus' }, desc: { de: 'Google-PageSpeed-Check', en: 'Google PageSpeed check' }, url: { de: 'https://pagespeed-plus.de', en: 'https://pagespeed-plus.de/en' } },
  { emoji: '🔗', name: { de: 'kaputte-links.de', en: 'kaputte-links.de' }, desc: { de: 'Defekte Links finden', en: 'Find broken links' }, url: { de: 'https://kaputte-links.de', en: 'https://kaputte-links.de/en' } },
  { emoji: '🛡️', name: { de: 'Spam-Abwehr', en: 'Spam-Abwehr' }, desc: { de: 'Spam-Blockliste für Formulare', en: 'Spam blocklist for forms' }, url: { de: 'https://spam-abwehr.de', en: 'https://spam-abwehr.de/en' } },
  { emoji: '✋', name: { de: 'anti-spam.info', en: 'anti-spam.info' }, desc: { de: 'Anti-Spam-Versprechen', en: 'Anti-spam pledge' }, url: { de: 'https://anti-spam.info', en: 'https://anti-spam.info/en' } },
  { emoji: '⚖️', name: { de: 'abmahnschutz.pro', en: 'abmahnschutz.pro' }, desc: { de: 'Erste Hilfe bei Abmahnungen', en: 'Help with cease-and-desist letters' }, url: { de: 'https://www.abmahnschutz.pro', en: 'https://www.abmahnschutz.pro/en' } },
  { emoji: '🔍', name: { de: 'suchmaschinen.pro', en: 'search-engines.pro' }, desc: { de: 'SEO-Artikel auf Ihrer Domain', en: 'SEO articles on your own domain' }, url: { de: 'https://www.suchmaschinen.pro', en: 'https://www.search-engines.pro' } },
];

const T = {
  de: {
    unknownError: 'Unbekannter Fehler',
    connectionError: 'Verbindungsfehler. Bitte versuchen Sie es erneut.',
    placeholder: 'https://ihre-website.de',
    inputLabel: 'Website-URL',
    checking: 'Prüfe…',
    checkWithBadge: 'Siegel prüfen & Check starten',
    checkNow: 'Jetzt prüfen',
    sealAlt: 'BFSG-geprüft Siegel',
    gateTitle: 'Erst Siegel einbinden — dann kostenlos prüfen',
    gateDesc: (
      <>
        Das Siegel zeigt Ihren Besuchern aktive Barrierefreiheits-Compliance —
        und dokumentiert Ihre Bemühungen nach dem BFSG.
      </>
    ),
    step1: (
      <>
        <strong>Kopieren Sie diesen HTML-Code</strong> und fügen Sie das Siegel in den Footer oder die Barrierefreiheitsseite Ihrer Website ein:
      </>
    ),
    copied: '✓ Kopiert!',
    copy: 'Code kopieren',
    previewLabel: 'So sieht das Siegel auf Ihrer Website aus:',
    previewAlt: 'BFSG-geprüft Siegel Vorschau',
    step2: (
      <>
        <strong>Publizieren Sie Ihre Website</strong> mit dem Siegel.
      </>
    ),
    step3: (
      <>
        <strong>Klicken Sie auf &ldquo;Siegel prüfen & Check starten&rdquo;</strong> oben — wir erkennen das Siegel automatisch und starten den vollständigen BFSG-Check.
      </>
    ),
    gateNote: '♿ Das Siegel dokumentiert Ihre Barrierefreiheitsbemühungen nach BFSG und WCAG. So lange es eingebunden ist, können Sie jederzeit einen neuen Check starten.',
    resultFor: 'Ergebnis für:',
    verifiedChip: '♿ BFSG-geprüft',
    summary: 'Zusammenfassung',
    ok: 'OK',
    notice: ['Hinweis', 'Hinweise'],
    problem: ['Problem', 'Probleme'],
    status: { green: 'OK', yellow: 'Hinweis', red: 'Problem' },
    toolsTitle: 'Weitere kostenlose Webmaster-Tools',
    toolsDesc: 'Teil des PAN21-Netzwerks — alle Tools von echten Webmastern für echte Webmaster.',
  },
  en: {
    unknownError: 'Unknown error',
    connectionError: 'Connection error. Please try again.',
    placeholder: 'https://your-website.com',
    inputLabel: 'Website URL',
    checking: 'Checking…',
    checkWithBadge: 'Verify seal & run check',
    checkNow: 'Check now',
    sealAlt: 'BFSG accessibility seal from bfsg-checken.de',
    gateTitle: 'Add the seal first — then check for free',
    gateDesc: (
      <>
        The seal shows your visitors that you actively work on accessibility —
        and documents your efforts under the BFSG, Germany&rsquo;s implementation of the European Accessibility Act.
      </>
    ),
    step1: (
      <>
        <strong>Copy this HTML code</strong> and place the seal in your website&rsquo;s footer or on your accessibility statement page:
      </>
    ),
    copied: '✓ Copied!',
    copy: 'Copy code',
    previewLabel: 'This is how the seal will look on your website:',
    previewAlt: 'Preview of the BFSG accessibility seal',
    step2: (
      <>
        <strong>Publish your website</strong> with the seal.
      </>
    ),
    step3: (
      <>
        <strong>Click &ldquo;Verify seal & run check&rdquo;</strong> above — we&rsquo;ll detect the seal automatically and run the full accessibility check.
      </>
    ),
    gateNote: '♿ The seal documents your accessibility efforts under the BFSG and WCAG. As long as it stays on your site, you can run a new check at any time.',
    resultFor: 'Results for:',
    verifiedChip: '♿ BFSG seal verified',
    summary: 'Summary',
    ok: 'OK',
    notice: ['warning', 'warnings'],
    problem: ['issue', 'issues'],
    status: { green: 'OK', yellow: 'Warning', red: 'Issue' },
    toolsTitle: 'More free webmaster tools',
    toolsDesc: 'Part of the PAN21 network — all tools built by real webmasters for real webmasters.',
  },
};

export default function CheckForm({ lang = 'de' }: { lang?: Lang }) {
  const t = T[lang];
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [apiError, setApiError] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setLoading(true);
    setResult(null);
    setApiError('');
    setCopied(false);
    try {
      const resp = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim(), lang }),
      });
      const data: ApiResponse = await resp.json();
      if (!resp.ok || data.error) {
        setApiError(data.error ?? t.unknownError);
      } else {
        setResult(data);
        // Move keyboard/screen reader focus to the result heading and bring it into view
        setTimeout(() => {
          const heading = document.getElementById('results-heading');
          heading?.focus({ preventScroll: true });
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch {
      setApiError(t.connectionError);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  const counts = result && !result.requiresBadge
    ? {
        green: result.checks.filter((c) => c.status === 'green').length,
        yellow: result.checks.filter((c) => c.status === 'yellow').length,
        red: result.checks.filter((c) => c.status === 'red').length,
      }
    : null;

  // Singular/plural: "1 Hinweis" / "2 Hinweise", "1 warning" / "2 warnings"
  const plural = (n: number, forms: string[]) => (n === 1 ? forms[0] : forms[1]);

  return (
    <>
      {/* Check form */}
      <form className="checkForm" onSubmit={handleSubmit} noValidate>
        <label htmlFor="check-url" className="srOnly">{t.inputLabel}</label>
        <input
          id="check-url"
          className="checkInput"
          type="url"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder={t.placeholder}
          required
          autoComplete="url"
          inputMode="url"
        />
        <button className="checkBtn" type="submit" disabled={loading}>
          {loading ? (
            <><span className="spinner" aria-hidden="true" />{t.checking}</>
          ) : result?.requiresBadge ? (
            t.checkWithBadge
          ) : (
            t.checkNow
          )}
        </button>
      </form>

      {apiError && <div className="errorMsg" role="alert">{apiError}</div>}

      {/* Badge gate */}
      {result?.requiresBadge && (
        <section id="results" className="badgeGate">
          <div className="badgeGateInner">
            <div className="badgeSiegelPreview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/siegel.svg" alt={t.sealAlt} width="140" height="140" />
            </div>
            <h2 id="results-heading" tabIndex={-1} className="badgeGateTitle">{t.gateTitle}</h2>
            <p className="badgeGateDesc">{t.gateDesc}</p>

            <ol className="badgeSteps">
              <li>{t.step1}</li>
            </ol>

            <div className="badgeCodeWrap">
              <pre className="badgeCode">{result.badgeHtml}</pre>
              <button
                className="badgeCopyBtn"
                onClick={() => handleCopy(result.badgeHtml ?? '')}
                type="button"
              >
                {copied ? t.copied : t.copy}
              </button>
            </div>

            <div className="badgePreview">
              <p className="badgePreviewLabel">{t.previewLabel}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/siegel.svg"
                alt={t.previewAlt}
                width="120"
                height="120"
                style={{ display: 'block', margin: '0 auto' }}
              />
            </div>

            <ol className="badgeSteps" start={2}>
              <li>{t.step2}</li>
              <li>{t.step3}</li>
            </ol>

            <p className="badgeGateNote">{t.gateNote}</p>
          </div>
        </section>
      )}

      {/* Results */}
      {result && !result.requiresBadge && (
        <section id="results" className="results">
          <h2 id="results-heading" tabIndex={-1} className="resultsUrl">
            {t.resultFor}{' '}
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              {result.url}
            </a>
            {result.checks.length > 2 && (
              <>
                {' '}
                <span className="badgeVerifiedChip">{t.verifiedChip}</span>
              </>
            )}
          </h2>

          {counts && (
            <div className="summaryBar">
              <span style={{ fontWeight: 600, fontSize: '.9rem' }}>{t.summary}</span>
              <div className="summaryBadges">
                {counts.green > 0 && <span className="badge badge-green">✓ {counts.green} {t.ok}</span>}
                {counts.yellow > 0 && <span className="badge badge-yellow">⚠ {counts.yellow} {plural(counts.yellow, t.notice)}</span>}
                {counts.red > 0 && <span className="badge badge-red">✕ {counts.red} {plural(counts.red, t.problem)}</span>}
              </div>
            </div>
          )}

          <div className="checkList">
            {result.checks.map((c) => (
              <div key={c.id} className="checkCard">
                <span className={`checkDot dot-${c.status}`} aria-hidden="true" />
                <div>
                  <div className="checkLabel">
                    <span className="srOnly">{t.status[c.status]}: </span>
                    {c.label}
                  </div>
                  <div className="checkMessage">{c.message}</div>
                  {c.fix && (
                    <div className="checkFix">
                      <a
                        className="checkFixBtn"
                        href={c.fix.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {c.fix.label} →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tools grid */}
      <section className="toolsSection">
        <div className="wrap">
          <h2>{t.toolsTitle}</h2>
          <p>{t.toolsDesc}</p>
          <div className="toolsGrid">
            {TOOLS.map((tool) => (
              <a key={tool.url[lang]} className="toolCard" href={tool.url[lang]} target="_blank" rel="noopener noreferrer">
                <span className="toolEmoji" aria-hidden="true">{tool.emoji}</span>
                <div>
                  <div className="toolName">{tool.name[lang]}</div>
                  <div className="toolDesc">{tool.desc[lang]}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

'use client';
import { useState } from 'react';

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

const TOOLS = [
  { emoji: '🔒', name: 'dsgvo-checken.de', desc: 'DSGVO-Check', url: 'https://dsgvo-checken.de' },
  { emoji: '📄', name: 'Impressum-Free', desc: 'Impressum-Generator', url: 'https://impressum-free.de' },
  { emoji: '📊', name: 'PAN21counter', desc: 'Besucherzähler', url: 'https://pan21counter.de' },
  { emoji: '🟢', name: 'site-ok.de', desc: 'Erreichbarkeit prüfen', url: 'https://site-ok.de' },
  { emoji: '⚡', name: 'PageSpeed-Plus', desc: 'Google-PageSpeed-Check', url: 'https://pagespeed-plus.de' },
  { emoji: '🔗', name: 'kaputte-links.de', desc: 'Defekte Links finden', url: 'https://kaputte-links.de' },
  { emoji: '🛡️', name: 'Spam-Abwehr', desc: 'Spam-Blockliste', url: 'https://spam-abwehr.de' },
  { emoji: '⚖️', name: 'abmahnschutz.pro', desc: 'Abmahnschutz', url: 'https://www.abmahnschutz.pro' },
];

export default function CheckForm() {
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
        body: JSON.stringify({ url: inputUrl.trim() }),
      });
      const data: ApiResponse = await resp.json();
      if (!resp.ok || data.error) {
        setApiError(data.error ?? 'Unbekannter Fehler');
      } else {
        setResult(data);
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch {
      setApiError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
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

  return (
    <>
      {/* Check form */}
      <form className="checkForm" onSubmit={handleSubmit} noValidate>
        <input
          className="checkInput"
          type="url"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="https://ihre-website.de"
          required
          aria-label="Website-URL"
          autoComplete="url"
          inputMode="url"
        />
        <button className="checkBtn" type="submit" disabled={loading}>
          {loading ? (
            <><span className="spinner" aria-hidden="true" />Prüfe…</>
          ) : result?.requiresBadge ? (
            'Siegel prüfen & Check starten'
          ) : (
            'Jetzt prüfen'
          )}
        </button>
      </form>

      {apiError && <div className="errorMsg">{apiError}</div>}

      {/* Badge gate */}
      {result?.requiresBadge && (
        <section id="results" className="badgeGate">
          <div className="badgeGateInner">
            <div className="badgeSiegelPreview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/siegel.svg" alt="BFSG-geprüft Siegel" width="140" height="140" />
            </div>
            <h2 className="badgeGateTitle">Erst Siegel einbinden — dann kostenlos prüfen</h2>
            <p className="badgeGateDesc">
              Das Siegel zeigt Ihren Besuchern aktive Barrierefreiheits-Compliance —
              und dokumentiert Ihre Bemühungen nach dem BFSG.
            </p>

            <ol className="badgeSteps">
              <li>
                <strong>Kopieren Sie diesen HTML-Code</strong> und fügen Sie das Siegel in den Footer oder die Barrierefreiheitsseite Ihrer Website ein:
              </li>
            </ol>

            <div className="badgeCodeWrap">
              <pre className="badgeCode">{result.badgeHtml}</pre>
              <button
                className="badgeCopyBtn"
                onClick={() => handleCopy(result.badgeHtml ?? '')}
                type="button"
              >
                {copied ? '✓ Kopiert!' : 'Code kopieren'}
              </button>
            </div>

            <div className="badgePreview">
              <p className="badgePreviewLabel">So sieht das Siegel auf Ihrer Website aus:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/siegel.svg"
                alt="BFSG-geprüft Siegel Vorschau"
                width="120"
                height="120"
                style={{ display: 'block', margin: '0 auto' }}
              />
            </div>

            <ol className="badgeSteps" start={2}>
              <li>
                <strong>Publizieren Sie Ihre Website</strong> mit dem Siegel.
              </li>
              <li>
                <strong>Klicken Sie auf &ldquo;Siegel prüfen & Check starten&rdquo;</strong> oben — wir erkennen das Siegel automatisch und starten den vollständigen BFSG-Check.
              </li>
            </ol>

            <p className="badgeGateNote">
              ♿ Das Siegel dokumentiert Ihre Barrierefreiheitsbemühungen nach BFSG und WCAG. So lange es eingebunden ist, können Sie jederzeit einen neuen Check starten.
            </p>
          </div>
        </section>
      )}

      {/* Results */}
      {result && !result.requiresBadge && (
        <section id="results" className="results">
          <p className="resultsUrl">
            Ergebnis für:{' '}
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              {result.url}
            </a>
            {' '}·{' '}
            <span className="badgeVerifiedChip">♿ BFSG-geprüft</span>
          </p>

          {counts && (
            <div className="summaryBar">
              <span style={{ fontWeight: 600, fontSize: '.9rem' }}>Zusammenfassung</span>
              <div className="summaryBadges">
                {counts.green > 0 && <span className="badge badge-green">✓ {counts.green} OK</span>}
                {counts.yellow > 0 && <span className="badge badge-yellow">⚠ {counts.yellow} Hinweis</span>}
                {counts.red > 0 && <span className="badge badge-red">✕ {counts.red} Problem</span>}
              </div>
            </div>
          )}

          <div className="checkList">
            {result.checks.map((c) => (
              <div key={c.id} className="checkCard">
                <span className={`checkDot dot-${c.status}`} aria-hidden="true" />
                <div>
                  <div className="checkLabel">{c.label}</div>
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
          <h2>Weitere kostenlose Webmaster-Tools</h2>
          <p>Teil des PAN21-Netzwerks — alle Tools von echten Webmastern für echte Webmaster.</p>
          <div className="toolsGrid">
            {TOOLS.map((t) => (
              <a key={t.url} className="toolCard" href={t.url} target="_blank" rel="noopener noreferrer">
                <span className="toolEmoji">{t.emoji}</span>
                <div>
                  <div className="toolName">{t.name}</div>
                  <div className="toolDesc">{t.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

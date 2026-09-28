'use client';
import { useState } from 'react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

const SUBJECTS = [
  'Frage zum BFSG-Check',
  'Siegel einbinden — Hilfe benötigt',
  'Professionelle Barrierefreiheits-Beratung',
  'WCAG-Umsetzung',
  'Technisches Problem',
  'Sonstiges',
];

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // honeypot — hidden
    privacy: false,
  });

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.privacy) {
      setErrorMsg('Bitte bestätigen Sie die Datenschutzerklärung.');
      return;
    }
    setState('loading');
    setErrorMsg('');
    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          website: form.website, // honeypot
        }),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        setErrorMsg(data.error ?? 'Unbekannter Fehler.');
        setState('error');
      } else {
        setState('success');
      }
    } catch {
      setErrorMsg('Verbindungsfehler. Bitte versuchen Sie es erneut.');
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="contactSuccess">
        <div className="contactSuccessIcon">✓</div>
        <h2>Nachricht gesendet!</h2>
        <p>Vielen Dank, {form.name}. Wir melden uns in der Regel innerhalb von 24 Stunden bei Ihnen.</p>
        <a href="/" className="ctaBtn" style={{ display: 'inline-block', marginTop: '20px' }}>
          Zurück zum BFSG-Check
        </a>
      </div>
    );
  }

  return (
    <form className="contactForm" onSubmit={handleSubmit} noValidate>
      <div className="contactGrid">
        <div className="contactField">
          <label htmlFor="cf-name">Name *</label>
          <input
            id="cf-name"
            type="text"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Max Mustermann"
            required
            autoComplete="name"
          />
        </div>
        <div className="contactField">
          <label htmlFor="cf-email">E-Mail *</label>
          <input
            id="cf-email"
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="max@example.de"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div className="contactField">
        <label htmlFor="cf-subject">Betreff</label>
        <select
          id="cf-subject"
          value={form.subject}
          onChange={(e) => set('subject', e.target.value)}
        >
          <option value="">Bitte wählen…</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="contactField">
        <label htmlFor="cf-message">Nachricht *</label>
        <textarea
          id="cf-message"
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          placeholder="Wie können wir Ihnen helfen?"
          required
          rows={6}
        />
      </div>

      {/* Honeypot — hidden from real users via CSS */}
      <div className="contactHoneypot" aria-hidden="true">
        <label htmlFor="cf-website">Website (nicht ausfüllen)</label>
        <input
          id="cf-website"
          type="text"
          value={form.website}
          onChange={(e) => set('website', e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="contactPrivacy">
        <label className="checkboxLabel">
          <input
            type="checkbox"
            checked={form.privacy}
            onChange={(e) => set('privacy', e.target.checked)}
            required
          />
          <span>
            Ich habe die{' '}
            <a href="/datenschutz" target="_blank" rel="noopener noreferrer">
              Datenschutzerklärung
            </a>{' '}
            gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu. *
          </span>
        </label>
      </div>

      {(state === 'error' || errorMsg) && (
        <div className="errorMsg">{errorMsg}</div>
      )}

      <button
        type="submit"
        className="checkBtn"
        disabled={state === 'loading'}
        style={{ width: '100%', marginTop: '8px', padding: '14px' }}
      >
        {state === 'loading' ? (
          <><span className="spinner" aria-hidden="true" />Wird gesendet…</>
        ) : (
          'Nachricht senden →'
        )}
      </button>

      <p className="contactNote">* Pflichtfelder. Wir geben Ihre Daten nicht an Dritte weiter.</p>
    </form>
  );
}

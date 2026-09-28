import ContactForm from './ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt | bfsg-checken.de',
  description: 'Fragen zu BFSG-Compliance? Schreiben Sie uns — wir helfen Ihnen weiter.',
};

export default function KontaktPage() {
  return (
    <>
      <header className="header">
        <div className="wrap">
          <a className="header-logo" href="/">
            ♿ <span>BFSG</span>-checken.de
          </a>
        </div>
      </header>

      <main>
        <section className="hero" style={{ paddingBottom: '0' }}>
          <div className="wrap">
            <h1>Kontakt</h1>
            <p>
              Fragen zur Barrierefreiheit, zum BFSG-Siegel oder zur professionellen Beratung?
              Schreiben Sie uns — wir antworten in der Regel innerhalb von 24 Stunden.
            </p>
          </div>
        </section>

        <div className="wrap">
          <ContactForm />
        </div>
      </main>

      <div className="wrap">
        <footer className="footer">
          <p>
            Ein Tool von{' '}
            <a href="https://webmaster.plus" target="_blank" rel="noopener noreferrer">webmaster.plus</a>
            {' '}· Teil des{' '}
            <a href="https://www.pan21.info" target="_blank" rel="noopener noreferrer">PAN21-Netzwerks</a>
            {' '}·{' '}
            <a href="https://webmaster.plus" target="_blank" rel="noopener noreferrer">Impressum & Datenschutz</a>
            {' '}·{' '}
            <a href="/">BFSG-Check starten</a>
          </p>
        </footer>
      </div>
    </>
  );
}

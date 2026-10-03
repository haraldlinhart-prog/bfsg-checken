import ImpressumWidget from '../../components/ImpressumWidget';
import SiteHeader from '../../components/SiteHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | bfsg-checken.de',
  description: 'Datenschutzerklärung von bfsg-checken.de — Informationen zur Verarbeitung personenbezogener Daten.',
};

export default function Datenschutz() {
  return (
    <>
      <SiteHeader lang="de" deHref="/datenschutz" enHref="/en" />

      <main>
        <div className="wrap" style={{ maxWidth: '720px', padding: '48px 24px' }}>
          <h1>Datenschutzerklärung</h1>

          <h2>1. Verantwortlicher</h2>
          <p>
            PAN21.com International LLC<br />
            7533 South Center View CT, STE R<br />
            84084 West Jordan, Utah, USA<br />
            E-Mail: <a href="mailto:impressum@pan21.com">impressum@pan21.com</a><br />
            Telefon: 030-568 4450-0
          </p>

          <h2>2. Allgemeines zur Datenverarbeitung</h2>
          <p>
            Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung
            einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist.
            Eine Verarbeitung personenbezogener Daten erfolgt regelmäßig nur nach Einwilligung
            des Nutzers, es sei denn, die Verarbeitung ist durch gesetzliche Vorschriften gestattet.
          </p>

          <h2>3. Server-Logfiles</h2>
          <p>
            Der Hosting-Anbieter dieser Website (Vercel Inc., 340 Pine Street, Suite 701,
            San Francisco, CA 94104, USA) erhebt und speichert automatisch Informationen in
            sogenannten Server-Logfiles, die Ihr Browser automatisch übermittelt. Dies sind:
          </p>
          <ul>
            <li>Browsertyp und Browserversion</li>
            <li>Verwendetes Betriebssystem</li>
            <li>Referrer-URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse</li>
          </ul>
          <p>
            Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren
            und stabilen Betrieb der Website). Die Daten werden nach spätestens 30 Tagen gelöscht.
            Vercel verarbeitet Daten gemäß seiner{' '}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
              Datenschutzerklärung
            </a>.
          </p>

          <h2>4. Website-Check (Kerndienst)</h2>
          <p>
            Wenn Sie eine URL in den BFSG-Checker eingeben, wird diese URL an unsere
            Server-API übermittelt und dort analysiert. Die eingegebene URL wird dabei
            nicht dauerhaft gespeichert und nicht mit Ihrer IP-Adresse verknüpft.
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung / vorvertragliche
            Maßnahmen) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
            Erbringung des kostenlosen Dienstes).
          </p>

          <h2>5. Kontaktformular</h2>
          <p>
            Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben
            aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten
            zwecks Bearbeitung der Anfrage bei uns gespeichert. Diese Daten geben wir nicht
            ohne Ihre Einwilligung weiter. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
            Die Daten werden gelöscht, sobald sie für die Erreichung des Zwecks ihrer Erhebung
            nicht mehr erforderlich sind, spätestens jedoch nach 6 Monaten.
          </p>

          <h2>6. Keine Cookies, kein Tracking</h2>
          <p>
            Diese Website setzt keine Tracking-Cookies und verwendet keine Analyse- oder
            Werbedienste (kein Google Analytics, kein Facebook Pixel, keine ähnlichen Tools).
            Es werden ausschließlich technisch notwendige Funktionen genutzt.
          </p>

          <h2>7. Externe Dienste</h2>
          <p>
            <strong>Impressum-Free.de (Widget):</strong> Im Footer dieser Seite wird ein
            Widget des Dienstes impressum-free.de eingebunden. Dabei wird eine Anfrage an
            die Server von impressum-free.de (ebenfalls gehostet bei Vercel) gesendet,
            um die Impressumsdaten abzurufen. Dabei wird Ihre IP-Adresse an Vercel-Server
            übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
          </p>

          <h2>8. Ihre Rechte</h2>
          <p>Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
          <ul>
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
          </ul>
          <p>
            Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über
            die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren.
          </p>

          <h2>9. Aktualität dieser Datenschutzerklärung</h2>
          <p>
            Diese Datenschutzerklärung ist aktuell gültig und hat den Stand September 2026.
            Durch die Weiterentwicklung unserer Website können Änderungen notwendig werden.
          </p>

          <p style={{ marginTop: '32px' }}>
            <a href="/">← Zurück zum BFSG-Checker</a>
          </p>
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
            <ImpressumWidget />
            {' '}·{' '}
            <a href="/datenschutz">Datenschutz</a>
            {' '}·{' '}
            <a href="/kontakt">Kontakt</a>
          </p>
        </footer>
      </div>
    </>
  );
}

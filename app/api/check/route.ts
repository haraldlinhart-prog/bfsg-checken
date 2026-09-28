import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const SUPABASE_URL = 'https://frbvsdumltlzisddrlbi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYnZzZHVtbHRsemlzZGRybGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTk4NDQsImV4cCI6MjA5NzgzNTg0NH0.8Vrrs8tIyjdGrD3xGoQ3lkpv4G3LBvy4bpeXpaQ8OGY';

interface CheckResult {
  id: string;
  label: string;
  status: 'green' | 'yellow' | 'red';
  message: string;
  fix: { label: string; url: string } | null;
}

async function supabaseUpsert(domain: string, badgeVerified: boolean, checks: CheckResult[]) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/bfsg_checks`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        domain,
        badge_verified: badgeVerified,
        last_checked_at: new Date().toISOString(),
        check_results: checks,
      }),
    });
  } catch {
    // non-fatal
  }
}

export async function POST(req: NextRequest) {
  let url: string;
  try {
    const body = await req.json();
    url = (body.url ?? '').trim();
    if (!url) return NextResponse.json({ error: 'URL fehlt' }, { status: 400 });
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    new URL(url); // validate
  } catch {
    return NextResponse.json({ error: 'Ungültige URL' }, { status: 400 });
  }

  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname.replace(/^www\./, '');
  const checks: CheckResult[] = [];

  // 1. SSL
  const isHttps = parsedUrl.protocol === 'https:';
  checks.push({
    id: 'ssl',
    label: 'SSL / HTTPS',
    status: isHttps ? 'green' : 'yellow',
    message: isHttps
      ? 'Die Seite läuft über HTTPS — Verbindung ist verschlüsselt.'
      : 'Die URL verwendet kein HTTPS. Für barrierefreie, vertrauenswürdige Websites empfohlen.',
    fix: isHttps ? null : { label: 'SSL-Zertifikat einrichten', url: 'https://pagespeed-plus.de' },
  });

  // Fetch the page
  let html = '';
  let fetchError = false;
  let finalUrl = url;
  try {
    const resp = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BFSG-Checken/1.0; +https://bfsg-checken.de)',
        Accept: 'text/html',
        'Accept-Language': 'de-DE,de;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    });
    finalUrl = resp.url;
    html = await resp.text();
  } catch {
    fetchError = true;
  }

  if (fetchError) {
    checks.push({
      id: 'erreichbar',
      label: 'Website erreichbar',
      status: 'red',
      message: 'Die Website konnte nicht geladen werden.',
      fix: { label: 'Verfügbarkeit prüfen', url: 'https://site-ok.de' },
    });
    return NextResponse.json({ url: finalUrl, checks });
  }

  checks.push({
    id: 'erreichbar',
    label: 'Website erreichbar',
    status: 'green',
    message: 'Die Website ist erreichbar und hat geantwortet.',
    fix: null,
  });

  const lc = html.toLowerCase();

  // --- Badge / Siegel check ---
  const hasBadge =
    lc.includes('bfsg-checken.de/siegel.svg') ||
    lc.includes(`bfsg-checken.de/badge/${domain}`) ||
    lc.includes(`bfsg-checken.de/badge/www.${domain}`);

  const siegelHtml = `<a href="https://bfsg-checken.de" target="_blank" rel="noopener noreferrer" title="BFSG-geprüft von bfsg-checken.de">\n  <img src="https://bfsg-checken.de/siegel.svg" alt="BFSG-geprüft" width="120" height="120">\n</a>`;

  if (!hasBadge) {
    await supabaseUpsert(domain, false, []);
    return NextResponse.json({
      requiresBadge: true,
      domain,
      badgeUrl: `https://bfsg-checken.de/badge/${domain}.svg`,
      badgeHtml: siegelHtml,
    });
  }

  // 2. Sprach-Attribut (lang)
  const hasLang = /\<html[^>]+lang\s*=\s*["'][a-z]/i.test(html);
  checks.push({
    id: 'lang',
    label: 'Sprachattribut (lang)',
    status: hasLang ? 'green' : 'red',
    message: hasLang
      ? 'Das <html>-Element hat ein lang-Attribut — Screenreader können die Sprache korrekt erkennen.'
      : 'Kein lang-Attribut am <html>-Element. Screenreader können die Sprache nicht erkennen. (WCAG 3.1.1)',
    fix: hasLang ? null : { label: 'Webmaster-Hilfe anfragen', url: 'https://webmaster.plus' },
  });

  // 3. Alt-Texte bei Bildern
  const imgTags = html.match(/<img[^>]*>/gi) || [];
  const imgCount = imgTags.length;
  const imgsWithoutAlt = imgTags.filter(tag => !/\balt\s*=/i.test(tag)).length;
  const imgsWithEmptyAlt = imgTags.filter(tag => /\balt\s*=\s*["']\s*["']/i.test(tag)).length;
  const imgsWithProperAlt = imgCount - imgsWithoutAlt - imgsWithEmptyAlt;

  let altStatus: 'green' | 'yellow' | 'red';
  let altMessage: string;
  if (imgCount === 0) {
    altStatus = 'green';
    altMessage = 'Keine Bilder gefunden — kein Handlungsbedarf.';
  } else if (imgsWithoutAlt === 0) {
    altStatus = 'green';
    altMessage = `${imgCount} Bild(er) gefunden — alle haben ein alt-Attribut. ${imgsWithEmptyAlt > 0 ? `(${imgsWithEmptyAlt} dekorativ mit leerem alt="")` : ''}`;
  } else {
    altStatus = imgsWithoutAlt > 2 ? 'red' : 'yellow';
    altMessage = `${imgsWithoutAlt} von ${imgCount} Bild(ern) fehlt das alt-Attribut. Alt-Texte sind für Screenreader-Nutzer essenziell. (WCAG 1.1.1)`;
  }
  checks.push({
    id: 'alt',
    label: 'Alt-Texte für Bilder',
    status: altStatus,
    message: altMessage,
    fix: altStatus === 'green' ? null : { label: 'Webmaster-Hilfe anfragen', url: 'https://webmaster.plus' },
  });

  // 4. Überschriften-Struktur
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const h2Count = (html.match(/<h2[\s>]/gi) || []).length;
  const hasHeadings = h1Count > 0 || h2Count > 0;
  let headingStatus: 'green' | 'yellow' | 'red';
  let headingMessage: string;
  if (!hasHeadings) {
    headingStatus = 'red';
    headingMessage = 'Keine H1- oder H2-Überschriften gefunden. Eine logische Überschriftenstruktur ist für Screenreader und Navigation essenziell. (WCAG 1.3.1)';
  } else if (h1Count === 0) {
    headingStatus = 'yellow';
    headingMessage = 'Keine H1-Überschrift gefunden. Jede Seite sollte eine H1 als Hauptüberschrift haben.';
  } else if (h1Count > 1) {
    headingStatus = 'yellow';
    headingMessage = `${h1Count} H1-Überschriften gefunden. Pro Seite sollte es genau eine H1 geben.`;
  } else {
    headingStatus = 'green';
    headingMessage = `Überschriftenstruktur vorhanden: 1× H1, ${h2Count}× H2.`;
  }
  checks.push({
    id: 'headings',
    label: 'Überschriften-Struktur',
    status: headingStatus,
    message: headingMessage,
    fix: headingStatus === 'green' ? null : { label: 'Webmaster-Hilfe anfragen', url: 'https://webmaster.plus' },
  });

  // 5. Formular-Labels
  const inputCount = (html.match(/<input[^>]+type\s*=\s*["'](text|email|tel|number|search|url|password)[^>]*>/gi) || []).length;
  const labelCount = (html.match(/<label[\s>]/gi) || []).length;
  const hasAriaLabel = /aria-label\s*=/i.test(html);
  let formStatus: 'green' | 'yellow' | 'red';
  let formMessage: string;
  if (inputCount === 0) {
    formStatus = 'green';
    formMessage = 'Keine Texteingabefelder gefunden — kein Handlungsbedarf.';
  } else if (labelCount >= inputCount || hasAriaLabel) {
    formStatus = 'green';
    formMessage = `${inputCount} Eingabefeld(er) gefunden, Labels oder ARIA-Labels erkannt.`;
  } else if (labelCount > 0) {
    formStatus = 'yellow';
    formMessage = `${inputCount} Eingabefeld(er), aber nur ${labelCount} Label(s) gefunden. Nicht alle Felder könnten ausreichend beschriftet sein. (WCAG 1.3.1)`;
  } else {
    formStatus = 'red';
    formMessage = `${inputCount} Eingabefeld(er) ohne sichtbare Labels gefunden. Screenreader können die Felder nicht beschreiben. (WCAG 1.3.1)`;
  }
  checks.push({
    id: 'forms',
    label: 'Formular-Labels',
    status: formStatus,
    message: formMessage,
    fix: formStatus === 'green' ? null : { label: 'Webmaster-Hilfe anfragen', url: 'https://webmaster.plus' },
  });

  // 6. Skip-Links / Sprungnavigation
  const hasSkipLink =
    lc.includes('skip') ||
    lc.includes('zum inhalt') ||
    lc.includes('zum hauptinhalt') ||
    lc.includes('#main') ||
    lc.includes('#content') ||
    lc.includes('#inhalt');
  checks.push({
    id: 'skiplink',
    label: 'Skip-Link / Sprungnavigation',
    status: hasSkipLink ? 'green' : 'yellow',
    message: hasSkipLink
      ? 'Ein Skip-Link zur Hauptnavigation oder zum Inhalt wurde gefunden.'
      : 'Kein Skip-Link gefunden. Tastatur- und Screenreader-Nutzer müssen die gesamte Navigation durchlaufen. (WCAG 2.4.1)',
    fix: hasSkipLink ? null : { label: 'Webmaster-Hilfe anfragen', url: 'https://webmaster.plus' },
  });

  // 7. ARIA-Landmarks
  const hasMain = lc.includes('<main') || lc.includes('role="main"') || lc.includes("role='main'");
  const hasNav = lc.includes('<nav') || lc.includes('role="navigation"') || lc.includes("role='navigation'");
  const hasAriaLandmarks = hasMain && hasNav;
  let ariaStatus: 'green' | 'yellow' | 'red';
  let ariaMessage: string;
  if (hasAriaLandmarks) {
    ariaStatus = 'green';
    ariaMessage = 'ARIA-Landmarks (<main>, <nav>) wurden erkannt — Seitenstruktur ist für Screenreader navigierbar.';
  } else if (hasMain || hasNav) {
    ariaStatus = 'yellow';
    ariaMessage = `Teilweise Landmark-Struktur erkannt (${hasMain ? '<main>' : ''} ${hasNav ? '<nav>' : ''}). Vollständige Strukturierung empfohlen. (WCAG 1.3.6)`;
  } else {
    ariaStatus = 'yellow';
    ariaMessage = 'Keine ARIA-Landmarks (<main>, <nav>) erkannt. Screenreader-Nutzer können nicht direkt zur Navigation oder zum Inhalt springen. (WCAG 1.3.6)';
  }
  checks.push({
    id: 'aria',
    label: 'ARIA-Landmarks',
    status: ariaStatus,
    message: ariaMessage,
    fix: ariaStatus === 'green' ? null : { label: 'Webmaster-Hilfe anfragen', url: 'https://webmaster.plus' },
  });

  // 8. Fokus-Indikatoren (Heuristik)
  const hasFocusVisible =
    lc.includes(':focus') ||
    lc.includes('focus-visible') ||
    lc.includes('outline');
  const hasFocusNone =
    lc.includes('outline: none') ||
    lc.includes('outline:none') ||
    lc.includes('outline: 0') ||
    lc.includes('outline:0');
  let focusStatus: 'green' | 'yellow' | 'red';
  let focusMessage: string;
  if (hasFocusVisible && !hasFocusNone) {
    focusStatus = 'green';
    focusMessage = 'Fokus-Styles erkannt, kein outline:none gefunden — Tastaturnavigation sollte sichtbar sein.';
  } else if (hasFocusNone && hasFocusVisible) {
    focusStatus = 'yellow';
    focusMessage = 'Fokus-Outline wird für einige Elemente unterdrückt. Bitte sicherstellen, dass alle interaktiven Elemente sichtbare Fokus-Indikatoren haben. (WCAG 2.4.7)';
  } else if (hasFocusNone) {
    focusStatus = 'red';
    focusMessage = 'outline:none ohne Ersatz-Fokus-Styling gefunden. Tastaturnutzer sehen nicht, welches Element fokussiert ist. (WCAG 2.4.7)';
  } else {
    focusStatus = 'yellow';
    focusMessage = 'Kein :focus-CSS gefunden. Bitte sicherstellen, dass interaktive Elemente sichtbare Fokus-Indikatoren haben. (WCAG 2.4.7)';
  }
  checks.push({
    id: 'focus',
    label: 'Fokus-Indikatoren',
    status: focusStatus,
    message: focusMessage,
    fix: focusStatus === 'green' ? null : { label: 'Webmaster-Hilfe anfragen', url: 'https://webmaster.plus' },
  });

  // 9. Links mit aussagekräftigem Text (Heuristik)
  const genericLinks = (html.match(/<a[^>]*>\s*(hier|click here|mehr|more|weiter|details|lesen|read more|here)\s*<\/a>/gi) || []).length;
  checks.push({
    id: 'linktext',
    label: 'Aussagekräftige Link-Texte',
    status: genericLinks === 0 ? 'green' : 'yellow',
    message: genericLinks === 0
      ? 'Keine typischen generischen Link-Texte ("hier", "mehr", "weiter") gefunden.'
      : `${genericLinks} generische(r) Link-Text(e) erkannt ("hier", "mehr", "weiter"). Screenreader-Nutzer können Links ohne Kontext nicht unterscheiden. (WCAG 2.4.4)`,
    fix: genericLinks === 0 ? null : { label: 'Webmaster-Hilfe anfragen', url: 'https://webmaster.plus' },
  });

  // 10. Defekte Links (cross-sell)
  checks.push({
    id: 'links',
    label: 'Defekte Links',
    status: 'yellow',
    message: 'Defekte Links können nur durch einen vollständigen Crawl erkannt werden.',
    fix: { label: 'Defekte Links prüfen', url: 'https://kaputte-links.de' },
  });

  // Save to Supabase
  await supabaseUpsert(domain, true, checks);

  return NextResponse.json({ url: finalUrl, checks });
}

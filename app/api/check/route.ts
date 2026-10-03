import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const SUPABASE_URL = 'https://frbvsdumltlzisddrlbi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYnZzZHVtbHRsemlzZGRybGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTk4NDQsImV4cCI6MjA5NzgzNTg0NH0.8Vrrs8tIyjdGrD3xGoQ3lkpv4G3LBvy4bpeXpaQ8OGY';

type Lang = 'de' | 'en';
type Status = 'green' | 'yellow' | 'red';

interface CheckResult {
  id: string;
  label: string;
  status: Status;
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

const HELP = {
  de: { label: 'Webmaster-Hilfe anfragen', url: 'https://webmaster.plus' },
  en: { label: 'Get help from a webmaster', url: 'https://webmaster.plus/en' },
};

/** Singular/plural helper: n === 1 ? one : many */
const pl = (n: number, one: string, many: string) => (n === 1 ? one : many);

/** Raw findings of a page, independent of the UI language. */
interface Facts {
  isHttps: boolean;
  httpStatus: number;
  hasLang: boolean;
  imgCount: number;
  imgsWithoutAlt: number;
  imgsWithEmptyAlt: number;
  h1Count: number;
  h2Count: number;
  inputCount: number;
  labelCount: number;
  hasAriaLabel: boolean;
  hasSkipLink: boolean;
  hasMain: boolean;
  hasNav: boolean;
  hasFocusVisible: boolean;
  hasFocusNone: boolean;
  genericLinks: number;
}

function sslCheck(isHttps: boolean, lang: Lang): CheckResult {
  const en = lang === 'en';
  return {
    id: 'ssl',
    label: 'SSL / HTTPS',
    status: isHttps ? 'green' : 'yellow',
    message: isHttps
      ? (en ? 'The page is served over HTTPS — the connection is encrypted.' : 'Die Seite läuft über HTTPS — Verbindung ist verschlüsselt.')
      : (en ? 'The page is not served over HTTPS — the connection is not encrypted. HTTPS is standard for trustworthy websites.' : 'Die Seite läuft nicht über HTTPS — die Verbindung ist unverschlüsselt. HTTPS ist Standard für vertrauenswürdige Websites.'),
    fix: isHttps ? null : { label: en ? 'Get help setting up SSL' : 'SSL-Zertifikat einrichten lassen', url: HELP[lang].url },
  };
}

function reachableCheck(ok: boolean, lang: Lang, httpStatus?: number): CheckResult {
  const en = lang === 'en';
  if (ok && httpStatus && httpStatus >= 400) {
    return {
      id: 'erreichbar',
      label: en ? 'Website reachable' : 'Website erreichbar',
      status: 'red',
      message: en
        ? `The server responded with HTTP status ${httpStatus} instead of the page.`
        : `Der Server hat mit HTTP-Status ${httpStatus} statt mit der Seite geantwortet.`,
      fix: { label: en ? 'Check availability' : 'Verfügbarkeit prüfen', url: en ? 'https://site-ok.de/en' : 'https://site-ok.de' },
    };
  }
  return ok
    ? {
        id: 'erreichbar',
        label: en ? 'Website reachable' : 'Website erreichbar',
        status: 'green',
        message: en ? 'The website is reachable and responded.' : 'Die Website ist erreichbar und hat geantwortet.',
        fix: null,
      }
    : {
        id: 'erreichbar',
        label: en ? 'Website reachable' : 'Website erreichbar',
        status: 'red',
        message: en ? 'The website could not be loaded.' : 'Die Website konnte nicht geladen werden.',
        fix: { label: en ? 'Check availability' : 'Verfügbarkeit prüfen', url: en ? 'https://site-ok.de/en' : 'https://site-ok.de' },
      };
}

/** Builds the full list of check results for a page in the given language. */
function buildChecks(f: Facts, lang: Lang): CheckResult[] {
  const en = lang === 'en';
  const help = HELP[lang];
  const checks: CheckResult[] = [sslCheck(f.isHttps, lang), reachableCheck(true, lang, f.httpStatus)];

  // 2. Sprach-Attribut (lang)
  checks.push({
    id: 'lang',
    label: en ? 'Language attribute (lang)' : 'Sprachattribut (lang)',
    status: f.hasLang ? 'green' : 'red',
    message: f.hasLang
      ? (en
          ? 'The <html> element has a lang attribute — screen readers can detect the page language correctly.'
          : 'Das <html>-Element hat ein lang-Attribut — Screenreader können die Sprache korrekt erkennen.')
      : (en
          ? 'The <html> element has no lang attribute, so screen readers cannot detect the page language. (WCAG 3.1.1)'
          : 'Kein lang-Attribut am <html>-Element. Screenreader können die Sprache nicht erkennen. (WCAG 3.1.1)'),
    fix: f.hasLang ? null : help,
  });

  // 3. Alt-Texte bei Bildern
  const { imgCount, imgsWithoutAlt, imgsWithEmptyAlt } = f;
  let altStatus: Status;
  let altMessage: string;
  if (imgCount === 0) {
    altStatus = 'green';
    altMessage = en ? 'No images found — nothing to do.' : 'Keine Bilder gefunden — kein Handlungsbedarf.';
  } else if (imgsWithoutAlt === 0) {
    altStatus = 'green';
    altMessage = en
      ? `${imgCount} ${pl(imgCount, 'image', 'images')} found — ${imgCount === 1 ? 'it has' : 'all of them have'} an alt attribute.${imgsWithEmptyAlt > 0 ? ` (${imgsWithEmptyAlt} marked as decorative with an empty alt="")` : ''}`
      : `${imgCount} ${pl(imgCount, 'Bild', 'Bilder')} gefunden — ${pl(imgCount, 'es hat', 'alle haben')} ein alt-Attribut.${imgsWithEmptyAlt > 0 ? ` (${imgsWithEmptyAlt} als dekorativ markiert mit leerem alt="")` : ''}`;
  } else {
    altStatus = imgsWithoutAlt > 2 ? 'red' : 'yellow';
    altMessage = en
      ? `${imgsWithoutAlt} of ${imgCount} ${imgCount === 1 ? 'image' : 'images'} ${imgsWithoutAlt === 1 ? 'is' : 'are'} missing the alt attribute. Alt texts are essential for screen reader users. (WCAG 1.1.1)`
      : `Bei ${imgsWithoutAlt} von ${imgCount} ${pl(imgCount, 'Bild', 'Bildern')} fehlt das alt-Attribut. Alt-Texte sind für Screenreader-Nutzer essenziell. (WCAG 1.1.1)`;
  }
  checks.push({
    id: 'alt',
    label: en ? 'Alt text for images' : 'Alt-Texte für Bilder',
    status: altStatus,
    message: altMessage,
    fix: altStatus === 'green' ? null : help,
  });

  // 4. Überschriften-Struktur
  const { h1Count, h2Count } = f;
  const hasHeadings = h1Count > 0 || h2Count > 0;
  let headingStatus: Status;
  let headingMessage: string;
  if (!hasHeadings) {
    headingStatus = 'red';
    headingMessage = en
      ? 'No H1 or H2 headings found. A logical heading structure is essential for screen readers and navigation. (WCAG 1.3.1)'
      : 'Keine H1- oder H2-Überschriften gefunden. Eine logische Überschriftenstruktur ist für Screenreader und Navigation essenziell. (WCAG 1.3.1)';
  } else if (h1Count === 0) {
    headingStatus = 'yellow';
    headingMessage = en
      ? 'No H1 heading found. Every page should have one H1 as its main heading.'
      : 'Keine H1-Überschrift gefunden. Jede Seite sollte eine H1 als Hauptüberschrift haben.';
  } else if (h1Count > 1) {
    headingStatus = 'yellow';
    headingMessage = en
      ? `${h1Count} H1 headings found. Each page should have exactly one H1.`
      : `${h1Count} H1-Überschriften gefunden. Pro Seite sollte es genau eine H1 geben.`;
  } else {
    headingStatus = 'green';
    headingMessage = en
      ? `Heading structure in place: 1× H1, ${h2Count}× H2.`
      : `Überschriftenstruktur vorhanden: 1× H1, ${h2Count}× H2.`;
  }
  checks.push({
    id: 'headings',
    label: en ? 'Heading structure' : 'Überschriften-Struktur',
    status: headingStatus,
    message: headingMessage,
    fix: headingStatus === 'green' ? null : help,
  });

  // 5. Formular-Labels
  const { inputCount, labelCount, hasAriaLabel } = f;
  const fields = (n: number) => `${n} ${n === 1 ? 'input field' : 'input fields'}`;
  const felder = (n: number) => `${n} ${pl(n, 'Eingabefeld', 'Eingabefelder')}`;
  let formStatus: Status;
  let formMessage: string;
  if (inputCount === 0) {
    formStatus = 'green';
    formMessage = en ? 'No text input fields found — nothing to do.' : 'Keine Texteingabefelder gefunden — kein Handlungsbedarf.';
  } else if (labelCount >= inputCount || hasAriaLabel) {
    formStatus = 'green';
    formMessage = en
      ? `${fields(inputCount)} found; labels or ARIA labels detected.`
      : `${felder(inputCount)} gefunden; Labels oder ARIA-Labels erkannt.`;
  } else if (labelCount > 0) {
    formStatus = 'yellow';
    formMessage = en
      ? `${fields(inputCount)} but only ${labelCount} ${labelCount === 1 ? 'label' : 'labels'} found. Some fields may not be labelled properly. (WCAG 1.3.1)`
      : `${felder(inputCount)}, aber nur ${labelCount} ${pl(labelCount, 'Label', 'Labels')} gefunden. Möglicherweise sind nicht alle Felder ausreichend beschriftet. (WCAG 1.3.1)`;
  } else {
    formStatus = 'red';
    formMessage = en
      ? `${fields(inputCount)} without visible labels found. Screen readers cannot describe these fields. (WCAG 1.3.1)`
      : `${felder(inputCount)} ohne Labels gefunden. Screenreader können ${pl(inputCount, 'das Feld', 'die Felder')} nicht beschreiben. (WCAG 1.3.1)`;
  }
  checks.push({
    id: 'forms',
    label: en ? 'Form labels' : 'Formular-Labels',
    status: formStatus,
    message: formMessage,
    fix: formStatus === 'green' ? null : help,
  });

  // 6. Skip-Links / Sprungnavigation
  checks.push({
    id: 'skiplink',
    label: en ? 'Skip link' : 'Skip-Link / Sprungnavigation',
    status: f.hasSkipLink ? 'green' : 'yellow',
    message: f.hasSkipLink
      ? (en
          ? 'A skip link to the main navigation or content was found.'
          : 'Ein Skip-Link zur Hauptnavigation oder zum Inhalt wurde gefunden.')
      : (en
          ? 'No skip link found. Keyboard and screen reader users have to tab through the entire navigation. (WCAG 2.4.1)'
          : 'Kein Skip-Link gefunden. Tastatur- und Screenreader-Nutzer müssen die gesamte Navigation durchlaufen. (WCAG 2.4.1)'),
    fix: f.hasSkipLink ? null : help,
  });

  // 7. ARIA-Landmarks
  const { hasMain, hasNav } = f;
  let ariaStatus: Status;
  let ariaMessage: string;
  if (hasMain && hasNav) {
    ariaStatus = 'green';
    ariaMessage = en
      ? 'ARIA landmarks (<main>, <nav>) detected — screen reader users can navigate the page structure.'
      : 'ARIA-Landmarks (<main>, <nav>) wurden erkannt — Seitenstruktur ist für Screenreader navigierbar.';
  } else if (hasMain || hasNav) {
    ariaStatus = 'yellow';
    ariaMessage = en
      ? `Partial landmark structure detected (only ${hasMain ? '<main>' : '<nav>'}, no ${hasMain ? '<nav>' : '<main>'}). A complete structure is recommended. (WCAG 1.3.6)`
      : `Teilweise Landmark-Struktur erkannt (nur ${hasMain ? '<main>' : '<nav>'}, kein ${hasMain ? '<nav>' : '<main>'}). Eine vollständige Strukturierung wird empfohlen. (WCAG 1.3.6)`;
  } else {
    ariaStatus = 'yellow';
    ariaMessage = en
      ? 'No ARIA landmarks (<main>, <nav>) detected. Screen reader users cannot jump directly to the navigation or content. (WCAG 1.3.6)'
      : 'Keine ARIA-Landmarks (<main>, <nav>) erkannt. Screenreader-Nutzer können nicht direkt zur Navigation oder zum Inhalt springen. (WCAG 1.3.6)';
  }
  checks.push({
    id: 'aria',
    label: en ? 'ARIA landmarks' : 'ARIA-Landmarks',
    status: ariaStatus,
    message: ariaMessage,
    fix: ariaStatus === 'green' ? null : help,
  });

  // 8. Fokus-Indikatoren (Heuristik)
  const { hasFocusVisible, hasFocusNone } = f;
  let focusStatus: Status;
  let focusMessage: string;
  if (hasFocusVisible && !hasFocusNone) {
    focusStatus = 'green';
    focusMessage = en
      ? 'Focus styles detected and no outline:none found — keyboard focus should be visible.'
      : 'Fokus-Styles erkannt, kein outline:none gefunden — Tastaturnavigation sollte sichtbar sein.';
  } else if (hasFocusNone && hasFocusVisible) {
    focusStatus = 'yellow';
    focusMessage = en
      ? 'The focus outline is suppressed for some elements. Make sure every interactive element has a visible focus indicator. (WCAG 2.4.7)'
      : 'Fokus-Outline wird für einige Elemente unterdrückt. Bitte sicherstellen, dass alle interaktiven Elemente sichtbare Fokus-Indikatoren haben. (WCAG 2.4.7)';
  } else if (hasFocusNone) {
    focusStatus = 'red';
    focusMessage = en
      ? 'outline:none found without replacement focus styling. Keyboard users cannot see which element has focus. (WCAG 2.4.7)'
      : 'outline:none ohne Ersatz-Fokus-Styling gefunden. Tastaturnutzer sehen nicht, welches Element fokussiert ist. (WCAG 2.4.7)';
  } else {
    focusStatus = 'yellow';
    focusMessage = en
      ? 'No :focus CSS found. Make sure interactive elements have visible focus indicators. (WCAG 2.4.7)'
      : 'Kein :focus-CSS gefunden. Bitte sicherstellen, dass interaktive Elemente sichtbare Fokus-Indikatoren haben. (WCAG 2.4.7)';
  }
  checks.push({
    id: 'focus',
    label: en ? 'Focus indicators' : 'Fokus-Indikatoren',
    status: focusStatus,
    message: focusMessage,
    fix: focusStatus === 'green' ? null : help,
  });

  // 9. Links mit aussagekräftigem Text (Heuristik)
  const { genericLinks } = f;
  checks.push({
    id: 'linktext',
    label: en ? 'Descriptive link text' : 'Aussagekräftige Link-Texte',
    status: genericLinks === 0 ? 'green' : 'yellow',
    message: genericLinks === 0
      ? (en
          ? 'No typical generic link texts ("click here", "more", "read more") found.'
          : 'Keine typischen generischen Link-Texte ("hier", "mehr", "weiter") gefunden.')
      : (en
          ? `${genericLinks} generic link ${genericLinks === 1 ? 'text' : 'texts'} detected ("click here", "more", "read more"). Screen reader users cannot tell such links apart without context. (WCAG 2.4.4)`
          : `${genericLinks} ${pl(genericLinks, 'generischer Link-Text', 'generische Link-Texte')} erkannt ("hier", "mehr", "weiter"). Screenreader-Nutzer können Links ohne Kontext nicht unterscheiden. (WCAG 2.4.4)`),
    fix: genericLinks === 0 ? null : help,
  });

  // 10. Defekte Links (cross-sell)
  checks.push({
    id: 'links',
    label: en ? 'Broken links' : 'Defekte Links',
    status: 'yellow',
    message: en
      ? 'Broken links can only be detected with a full crawl of your website.'
      : 'Defekte Links können nur durch einen vollständigen Crawl erkannt werden.',
    fix: { label: en ? 'Check for broken links' : 'Defekte Links prüfen', url: en ? 'https://kaputte-links.de/en' : 'https://kaputte-links.de' },
  });

  return checks;
}

export async function POST(req: NextRequest) {
  let url: string;
  // UI language: German by default, English when the English page sends lang: 'en'
  let lang: Lang = req.nextUrl.searchParams.get('lang') === 'en' ? 'en' : 'de';
  try {
    const body = await req.json();
    if (body.lang === 'en') lang = 'en';
    url = (body.url ?? '').trim();
    if (!url) return NextResponse.json({ error: lang === 'en' ? 'Please enter a URL.' : 'URL fehlt' }, { status: 400 });
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    new URL(url); // validate
  } catch {
    return NextResponse.json({ error: lang === 'en' ? 'Invalid URL' : 'Ungültige URL' }, { status: 400 });
  }

  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname.replace(/^www\./, '');

  // Fetch the page
  let html = '';
  let fetchError = false;
  let finalUrl = url;
  let httpStatus = 0;
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
    finalUrl = resp.url || url;
    httpStatus = resp.status;
    html = await resp.text();
  } catch {
    fetchError = true;
  }

  // 1. SSL — judged by the URL actually served (after redirects), so http → https redirects count as HTTPS
  const isHttps = new URL(finalUrl).protocol === 'https:';

  if (fetchError) {
    return NextResponse.json({ url: finalUrl, checks: [sslCheck(isHttps, lang), reachableCheck(false, lang)] });
  }

  const lc = html.toLowerCase();

  // --- Badge / Siegel check ---
  const hasBadge =
    lc.includes('bfsg-checken.de/siegel.svg') ||
    lc.includes(`bfsg-checken.de/badge/${domain}`) ||
    lc.includes(`bfsg-checken.de/badge/www.${domain}`);

  const siegelHtml = lang === 'en'
    ? `<a href="https://www.bfsg-checken.de/en" target="_blank" rel="noopener noreferrer" title="Accessibility checked (BFSG) by bfsg-checken.de">\n  <img src="https://www.bfsg-checken.de/siegel.svg" alt="Accessibility checked (BFSG) – bfsg-checken.de" width="120" height="120">\n</a>`
    : `<a href="https://www.bfsg-checken.de" target="_blank" rel="noopener noreferrer" title="BFSG-geprüft von bfsg-checken.de">\n  <img src="https://www.bfsg-checken.de/siegel.svg" alt="BFSG-geprüft – bfsg-checken.de" width="120" height="120">\n</a>`;

  if (!hasBadge) {
    await supabaseUpsert(domain, false, []);
    return NextResponse.json({
      requiresBadge: true,
      domain,
      badgeUrl: `https://www.bfsg-checken.de/badge/${domain}.svg`,
      badgeHtml: siegelHtml,
    });
  }

  const imgTags = html.match(/<img[^>]*>/gi) || [];

  // Focus styles usually live in external stylesheets — load up to 5 of them for the focus heuristic
  const cssHrefs = (html.match(/<link\b[^>]*>/gi) || [])
    .filter((tag) => /\brel\s*=\s*["']?stylesheet/i.test(tag))
    .map((tag) => tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1])
    .filter((href): href is string => !!href)
    .slice(0, 5);
  const cssTexts = await Promise.all(
    cssHrefs.map(async (href) => {
      try {
        const cssUrl = new URL(href.replace(/&amp;/g, '&'), finalUrl);
        if (!/^https?:$/.test(cssUrl.protocol)) return '';
        const r = await fetch(cssUrl.toString(), {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BFSG-Checken/1.0; +https://www.bfsg-checken.de)' },
          signal: AbortSignal.timeout(5000),
        });
        return r.ok ? (await r.text()).slice(0, 2_000_000) : '';
      } catch {
        return '';
      }
    })
  );
  // Inline <style> blocks are part of the HTML already; add the external CSS
  const styles = (lc + '\n' + cssTexts.join('\n').toLowerCase());

  const facts: Facts = {
    isHttps,
    httpStatus,
    // 2. lang
    hasLang: /\<html[^>]+lang\s*=\s*["'][a-z]/i.test(html),
    // 3. alt
    imgCount: imgTags.length,
    imgsWithoutAlt: imgTags.filter(tag => !/\balt\s*=/i.test(tag)).length,
    imgsWithEmptyAlt: imgTags.filter(tag => /\balt\s*=\s*["']\s*["']/i.test(tag)).length,
    // 4. headings
    h1Count: (html.match(/<h1[\s>]/gi) || []).length,
    h2Count: (html.match(/<h2[\s>]/gi) || []).length,
    // 5. forms
    inputCount: (html.match(/<input[^>]+type\s*=\s*["'](text|email|tel|number|search|url|password)[^>]*>/gi) || []).length,
    labelCount: (html.match(/<label[\s>]/gi) || []).length,
    hasAriaLabel: /aria-label\s*=/i.test(html),
    // 6. skip link
    hasSkipLink:
      lc.includes('skip') ||
      lc.includes('zum inhalt') ||
      lc.includes('zum hauptinhalt') ||
      lc.includes('#main') ||
      lc.includes('#content') ||
      lc.includes('#inhalt'),
    // 7. landmarks
    hasMain: lc.includes('<main') || lc.includes('role="main"') || lc.includes("role='main'"),
    hasNav: lc.includes('<nav') || lc.includes('role="navigation"') || lc.includes("role='navigation'"),
    // 8. focus (heuristic)
    hasFocusVisible:
      styles.includes(':focus') ||
      styles.includes('focus-visible') ||
      styles.includes('outline'),
    hasFocusNone: /outline\s*:\s*(none|0)(?![.\d])/.test(styles),
    // 9. generic link texts (heuristic)
    genericLinks: (html.match(/<a[^>]*>\s*(hier|click here|mehr|more|weiter|details|lesen|read more|here)\s*<\/a>/gi) || []).length,
  };

  // Stored results stay German (as before) regardless of the UI language
  await supabaseUpsert(domain, true, buildChecks(facts, 'de'));

  return NextResponse.json({ url: finalUrl, checks: buildChecks(facts, lang) });
}

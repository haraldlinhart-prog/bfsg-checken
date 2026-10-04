import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
// Always read the current status — Next 14 would otherwise cache the Supabase fetch indefinitely
export const dynamic = 'force-dynamic';

const SUPABASE_URL = 'https://frbvsdumltlzisddrlbi.supabase.co';
// Serverseitig mit dem Service-Key (Vercel-Env SUPABASE_SERVICE_KEY). Der öffentliche
// Anon-Key ist nur Übergangslösung, bis RLS auf der Tabelle aktiv ist; danach darf er nichts mehr.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYnZzZHVtbHRsemlzZGRybGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTk4NDQsImV4cCI6MjA5NzgzNTg0NH0.8Vrrs8tIyjdGrD3xGoQ3lkpv4G3LBvy4bpeXpaQ8OGY';

export async function GET(
  _req: NextRequest,
  { params }: { params: { domain: string } }
) {
  const rawDomain = params.domain.replace(/\.svg$/, '');
  const domain = rawDomain.replace(/^www\./, '').toLowerCase();

  // Only plain host names — the value is written into the SVG, so nothing else may get through
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain) || domain.length > 253) {
    return new NextResponse('Invalid domain', { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  // Look up badge_verified status
  let verified = false;
  let lastChecked = '';
  try {
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/bfsg_checks?domain=eq.${encodeURIComponent(domain)}&select=badge_verified,last_checked_at&limit=1`,
      {
        cache: 'no-store',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const rows = await resp.json();
    if (rows && rows.length > 0) {
      verified = rows[0].badge_verified === true;
      if (rows[0].last_checked_at) {
        const d = new Date(rows[0].last_checked_at);
        // Fixed MM/YYYY format — independent of the runtime's locale data
        if (!isNaN(d.getTime())) {
          lastChecked = `${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
        }
      }
    }
  } catch {
    // serve unverified badge
  }

  const color = verified ? '#15803d' : '#6b7280'; // white status text needs >= 4.5:1
  const accentColor = verified ? '#22c55e' : '#9ca3af';
  const statusText = verified ? 'GEPRÜFT' : 'NICHT GEPRÜFT';
  const dateText = lastChecked ? lastChecked : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240" role="img" aria-labelledby="title desc">
<title id="title">BFSG ${verified ? 'geprüft' : 'nicht geprüft'}: ${domain}</title>
<desc id="desc">Rundes Prüfsiegel für Barrierefreiheit nach BFSG.</desc>
<circle cx="120" cy="120" r="117" fill="#ffffff" stroke="#1a1a2e" stroke-width="4"/>
<circle cx="120" cy="120" r="109" fill="none" stroke="#1a1a2e" stroke-width="1"/>
<circle cx="120" cy="120" r="80" fill="#f0f4f8" stroke="#1a1a2e" stroke-width="2"/>
<g fill="#1a1a2e" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-anchor="middle">
<text transform="translate(30.962 89.862) rotate(-71.3)" font-size="11.5" font-weight="bold">B</text>
<text transform="translate(34.738 80.423) rotate(-65.1)" font-size="11.5" font-weight="bold">A</text>
<text transform="translate(39.511 71.446) rotate(-58.9)" font-size="11.5" font-weight="bold">R</text>
<text transform="translate(45.225 63.037) rotate(-52.7)" font-size="11.5" font-weight="bold">R</text>
<text transform="translate(51.815 55.295) rotate(-46.5)" font-size="11.5" font-weight="bold">I</text>
<text transform="translate(59.202 48.309) rotate(-40.3)" font-size="11.5" font-weight="bold">E</text>
<text transform="translate(67.300 42.162) rotate(-34.1)" font-size="11.5" font-weight="bold">R</text>
<text transform="translate(76.015 36.926) rotate(-27.9)" font-size="11.5" font-weight="bold">E</text>
<text transform="translate(85.244 32.662) rotate(-21.7)" font-size="11.5" font-weight="bold">F</text>
<text transform="translate(94.880 29.419) rotate(-15.5)" font-size="11.5" font-weight="bold">R</text>
<text transform="translate(104.809 27.236) rotate(-9.3)" font-size="11.5" font-weight="bold">E</text>
<text transform="translate(114.917 26.138) rotate(-3.1)" font-size="11.5" font-weight="bold">I</text>
<text transform="translate(125.083 26.138) rotate(3.1)" font-size="11.5" font-weight="bold">H</text>
<text transform="translate(135.191 27.236) rotate(9.3)" font-size="11.5" font-weight="bold">E</text>
<text transform="translate(145.120 29.419) rotate(15.5)" font-size="11.5" font-weight="bold">I</text>
<text transform="translate(154.756 32.662) rotate(21.7)" font-size="11.5" font-weight="bold">T</text>
<text transform="translate(163.985 36.926) rotate(27.9)" font-size="11.5" font-weight="bold"> </text>
<text transform="translate(172.700 42.162) rotate(34.1)" font-size="11.5" font-weight="bold">G</text>
<text transform="translate(180.798 48.309) rotate(40.3)" font-size="11.5" font-weight="bold">E</text>
<text transform="translate(188.185 55.295) rotate(46.5)" font-size="11.5" font-weight="bold">P</text>
<text transform="translate(194.775 63.037) rotate(52.7)" font-size="11.5" font-weight="bold">R</text>
<text transform="translate(200.489 71.446) rotate(58.9)" font-size="11.5" font-weight="bold">Ü</text>
<text transform="translate(205.262 80.423) rotate(65.1)" font-size="11.5" font-weight="bold">F</text>
<text transform="translate(209.038 89.862) rotate(71.3)" font-size="11.5" font-weight="bold">T</text>
<text transform="translate(64.107 204.125) rotate(33.6)" font-size="10" font-weight="bold">B</text>
<text transform="translate(71.343 208.507) rotate(28.8)" font-size="10" font-weight="bold">F</text>
<text transform="translate(78.920 212.268) rotate(24)" font-size="10" font-weight="bold">S</text>
<text transform="translate(86.784 215.382) rotate(19.2)" font-size="10" font-weight="bold">G</text>
<text transform="translate(94.882 217.827) rotate(14.4)" font-size="10" font-weight="bold">-</text>
<text transform="translate(103.156 219.586) rotate(9.6)" font-size="10" font-weight="bold">C</text>
<text transform="translate(111.549 220.646) rotate(4.8)" font-size="10" font-weight="bold">H</text>
<text transform="translate(120.000 221.000) rotate(0)" font-size="10" font-weight="bold">E</text>
<text transform="translate(128.451 220.646) rotate(-4.8)" font-size="10" font-weight="bold">C</text>
<text transform="translate(136.844 219.586) rotate(-9.6)" font-size="10" font-weight="bold">K</text>
<text transform="translate(145.118 217.827) rotate(-14.4)" font-size="10" font-weight="bold">E</text>
<text transform="translate(153.216 215.382) rotate(-19.2)" font-size="10" font-weight="bold">N</text>
<text transform="translate(161.080 212.268) rotate(-24)" font-size="10" font-weight="bold">.</text>
<text transform="translate(168.657 208.507) rotate(-28.8)" font-size="10" font-weight="bold">D</text>
<text transform="translate(175.893 204.125) rotate(-33.6)" font-size="10" font-weight="bold">E</text>
</g>
<circle cx="23" cy="126" r="3" fill="${accentColor}"/>
<circle cx="217" cy="126" r="3" fill="${accentColor}"/>
<!-- Rollstuhlfahrer-Icon -->
<circle cx="120" cy="62" r="8" fill="${color}"/>
<path d="M120 72 L120 95 L108 110" stroke="${color}" stroke-width="5" stroke-linecap="round" fill="none"/>
<path d="M120 82 L136 88" stroke="${color}" stroke-width="5" stroke-linecap="round" fill="none"/>
<path d="M108 95 L132 95" stroke="${color}" stroke-width="4" stroke-linecap="round" fill="none"/>
<circle cx="108" cy="115" r="8" stroke="${color}" stroke-width="3.5" fill="none"/>
<circle cx="132" cy="115" r="8" stroke="${color}" stroke-width="3.5" fill="none"/>
<text x="120" y="144" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="13" font-weight="bold" letter-spacing="0.5" fill="#1a1a2e">BFSG</text>
<rect x="42" y="152" width="156" height="27" rx="4" fill="${color}"/>
<text x="120" y="170" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="10" font-weight="bold" letter-spacing="0.5" fill="#ffffff">${statusText}${dateText ? ' · ' + dateText : ''}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

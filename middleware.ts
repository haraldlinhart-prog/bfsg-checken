import { NextRequest, NextResponse } from 'next/server';

// App-Seiten ohne abschließenden Slash; auch Blogartikel unter /blog/ (kanonisch ohne Slash, seit 12.11.2026).
// req.nextUrl normalisiert den Slash weg, daher den rohen Pfad prüfen und die Ziel-URL selbst bauen.
export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '') || '/';
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

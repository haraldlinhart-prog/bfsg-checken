import { NextRequest, NextResponse } from 'next/server';

// App-Seiten ohne abschließenden Slash; Blog-Dateien unter /blog/ behalten ihn (siehe next.config.js).
// req.nextUrl normalisiert den Slash weg, daher den rohen Pfad prüfen und die Ziel-URL selbst bauen.
export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname.length > 1 && url.pathname.endsWith('/') && !url.pathname.startsWith('/blog/')) {
    url.pathname = url.pathname.replace(/\/+$/, '') || '/';
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

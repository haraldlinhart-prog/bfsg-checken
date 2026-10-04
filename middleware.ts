import { NextRequest, NextResponse } from 'next/server';

// App-Seiten ohne abschließenden Slash; Blog-Dateien unter /blog/ behalten ihn (siehe next.config.js)
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.length > 1 && pathname.endsWith('/') && !pathname.startsWith('/blog/')) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/\/+$/, '') || '/';
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\..*).*)'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for Privy's authentication token
  // Privy typically uses 'privy-token' for its session cookie in web applications.
  const privyToken = request.cookies.get('privy-token')?.value || request.cookies.get('privy-session')?.value;

  const { pathname } = request.nextUrl;

  // Protect the /trade route and any sub-routes (e.g. /trade/[tokenAddress])
  if (pathname.startsWith('/trade')) {
    if (!privyToken) {
      // User is not authenticated, redirect to home page with login query parameter
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('login', 'true');
      
      // Preserve the intended destination so we could potentially redirect them back later
      // if we wanted to (optional, but good practice)
      loginUrl.searchParams.set('returnTo', pathname);

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Strictly scope the middleware to avoid running on static assets, API routes, or Next.js internals
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder assets like .png, .jpg, .svg
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
};

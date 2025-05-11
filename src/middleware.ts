import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Handle CORS for all routes, not just API routes
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4000',
    'https://vishal.biyani.xyz',
    'https://my-oauth-proxy.vercel.app'
  ];
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflight requests for all routes
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });

    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
      response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, Cache-Control, Pragma');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Max-Age', '86400');
      response.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
      response.headers.set('Vary', 'Origin');
    }

    return response;
  }

  // Handle authentication for protected routes
  if (pathname.startsWith('/protected') || pathname.startsWith('/profile')) {
    const session = await auth();
    const isAuthenticated = !!session?.user;

    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue with the request
  const response = NextResponse.next();

  // Add CORS headers to all responses, not just API routes
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, Cache-Control, Pragma');
    response.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    response.headers.set('Vary', 'Origin');
  }

  return response;
}

// Configure the middleware to run on all routes except static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

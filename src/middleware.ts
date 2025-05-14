import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Handle CORS for all routes, not just API routes
  const origin = request.headers.get('origin') || '';
  
  // For debugging: Allow any origin (not recommended for production)
  // Handle preflight requests for all routes
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });

    // For debugging: Set permissive CORS headers (not recommended for production)
    // When using wildcard '*' for origin, credentials cannot be true
    // So we'll use the actual origin if it's provided, or '*' if not
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, Cache-Control, Pragma');
    response.headers.set('Access-Control-Max-Age', '86400');
    response.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    response.headers.set('Vary', 'Origin');

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
  // For debugging: Set permissive CORS headers (not recommended for production)
  // When using wildcard '*' for origin, credentials cannot be true
  // So we'll use the actual origin if it's provided, or '*' if not
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  } else {
    response.headers.set('Access-Control-Allow-Origin', '*');
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, Cache-Control, Pragma');
  response.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
  response.headers.set('Vary', 'Origin');

  return response;
}

// Configure the middleware to run on all routes except static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

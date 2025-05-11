import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Handle CORS for API routes
  if (pathname.startsWith('/api')) {
    // Get the origin from the request headers
    const origin = request.headers.get('origin') || '';

    // Define allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:4000',
      'https://vishal.biyani.xyz',
      'https://my-oauth-proxy.vercel.app'
    ];

    // Check if the origin is allowed
    const isAllowedOrigin = allowedOrigins.includes(origin);

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });

      if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Max-Age', '86400');
      }

      return response;
    }
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

  // Add CORS headers to API responses
  if (pathname.startsWith('/api')) {
    const origin = request.headers.get('origin') || '';
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:4000',
      'https://vishal.biyani.xyz',
      'https://my-oauth-proxy.vercel.app'
    ];

    if (allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
  }

  return response;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/api/:path*',
    '/protected/:path*',
    '/profile/:path*'
  ],
};

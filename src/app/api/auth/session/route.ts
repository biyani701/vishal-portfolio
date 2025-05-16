import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// API route to get the current session
export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || '';
    const clientOrigin = request.headers.get('x-client-origin') || origin;

    console.log('[api/auth/session] Request from origin:', origin);
    console.log('[api/auth/session] Client origin:', clientOrigin);

    // Log request headers for debugging
    console.log('[api/auth/session] Request headers:', Object.fromEntries(request.headers.entries()));

    // Get the current session
    const session = await auth();

    // Log the session for debugging
    console.log('[api/auth/session] Session:', session);

    // Create a response with the session data and additional debug info
    const response = NextResponse.json({
      ...session || { user: null },
      _debug: {
        timestamp: new Date().toISOString(),
        origin: origin,
        clientOrigin: clientOrigin,
        hasSession: !!session,
        cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value.substring(0, 10) + '...']))
      }
    });

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    // Add CORS headers
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, Cache-Control, Pragma, X-Client-Origin');
    response.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    response.headers.set('Vary', 'Origin');

    return response;
  } catch (error) {
    console.error('Error in session endpoint:', error);

    // Create an error response with detailed information
    const errorResponse = NextResponse.json(
      {
        error: 'Session error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        stack: error instanceof Error ? error.stack : undefined,
        _debug: {
          url: request.url,
          headers: Object.fromEntries(request.headers.entries()),
          cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value.substring(0, 10) + '...']))
        }
      },
      { status: 500 }
    );

    // Add cache control headers to prevent caching
    errorResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    errorResponse.headers.set('Pragma', 'no-cache');
    errorResponse.headers.set('Expires', '0');
    errorResponse.headers.set('Surrogate-Control', 'no-store');

    // Add CORS headers to error response
    const origin = request.headers.get('origin') || '';
    if (origin) {
      errorResponse.headers.set('Access-Control-Allow-Origin', origin);
      errorResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    }
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, Cache-Control, Pragma, X-Client-Origin');
    errorResponse.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    errorResponse.headers.set('Vary', 'Origin');

    return errorResponse;
  }
}

// Handle OPTIONS requests for preflight
export async function OPTIONS(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || '';
    const clientOrigin = request.headers.get('x-client-origin') || origin;

    console.log('[api/auth/session][OPTIONS] Request from origin:', origin);
    console.log('[api/auth/session][OPTIONS] Client origin:', clientOrigin);

    const response = new NextResponse(null, { status: 204 });

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    // Add CORS headers
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, Cache-Control, Pragma, X-Client-Origin');
    response.headers.set('Access-Control-Max-Age', '86400');
    response.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    response.headers.set('Vary', 'Origin');

    return response;
  } catch (error) {
    console.error('Error in OPTIONS handler:', error);
    // Even for errors in OPTIONS, we should return a 204 with CORS headers
    const errorResponse = new NextResponse(null, { status: 204 });

    // Add cache control headers to prevent caching
    errorResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    errorResponse.headers.set('Pragma', 'no-cache');
    errorResponse.headers.set('Expires', '0');
    errorResponse.headers.set('Surrogate-Control', 'no-store');

    // Add CORS headers to error response
    const origin = request.headers.get('origin') || '';
    if (origin) {
      errorResponse.headers.set('Access-Control-Allow-Origin', origin);
      errorResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    }
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, Cache-Control, Pragma, X-Client-Origin');
    errorResponse.headers.set('Access-Control-Max-Age', '86400');
    errorResponse.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    errorResponse.headers.set('Vary', 'Origin');

    return errorResponse;
  }
}

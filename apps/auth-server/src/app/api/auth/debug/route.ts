import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Debug endpoint to check authentication state and environment
export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || '';

    // Get session within the request context
    const session = await auth();

    // Get all environment variables (redact sensitive ones)
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      AUTH_URL: process.env.AUTH_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      CLIENT_URL: process.env.CLIENT_URL,
      // Redact secrets but show if they exist
      AUTH_SECRET: process.env.AUTH_SECRET ? '[REDACTED]' : undefined,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '[REDACTED]' : undefined,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '[REDACTED]' : undefined,
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? '[REDACTED]' : undefined,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? '[REDACTED]' : undefined,
    };

    // Get request information
    const requestInfo = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value])),
    };

    // Create response with debug information
    const response = NextResponse.json({
      timestamp: new Date().toISOString(),
      session,
      environment: envVars,
      request: requestInfo,
      authConfig: {
        pages: {
          signIn: '/login',
          error: '/auth-error',
        },
        providers: ['google', 'github'],
      }
    });

    // Add CORS headers
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, Cache-Control, Pragma');
    response.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    response.headers.set('Vary', 'Origin');

    return response;
  } catch (error) {
    console.error('Error in debug endpoint:', error);

    // Create an error response
    const errorResponse = NextResponse.json(
      {
        error: 'Debug endpoint error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );

    // Add CORS headers to error response
    const origin = request.headers.get('origin') || '';
    if (origin) {
      errorResponse.headers.set('Access-Control-Allow-Origin', origin);
      errorResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    }

    return errorResponse;
  }
}

// Handle OPTIONS requests for preflight
export async function OPTIONS(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || '';
    const response = new NextResponse(null, { status: 204 });

    // Add CORS headers
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, Cache-Control, Pragma');
    response.headers.set('Access-Control-Max-Age', '86400');
    response.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    response.headers.set('Vary', 'Origin');

    return response;
  } catch (error) {
    console.error('Error in OPTIONS handler:', error);
    // Even for errors in OPTIONS, we should return a 204 with CORS headers
    const errorResponse = new NextResponse(null, { status: 204 });

    // Add CORS headers to error response
    const origin = request.headers.get('origin') || '';
    if (origin) {
      errorResponse.headers.set('Access-Control-Allow-Origin', origin);
      errorResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    }
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, Cache-Control, Pragma');

    return errorResponse;
  }
}

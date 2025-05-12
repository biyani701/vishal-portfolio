import { GET as AuthGET, POST as AuthPOST } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';

// Wrap the Auth.js handlers with CORS
export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { params }: { params: Promise<{ nextauth: string[] }> }
) {
  const origin = request.headers.get('origin') || '';

  try {
    // Call the original Auth.js handler
    const authResponse = await AuthGET(request);

    // Create a new response with the same status, body, and headers
    const response = new NextResponse(authResponse.body, {
      status: authResponse.status,
      statusText: authResponse.statusText,
      headers: new Headers(authResponse.headers)
    });

    // Now add CORS headers to our new response
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
  } catch (error) {
    console.error('Auth error in GET handler:', error);
    // Return a proper error response
    const errorResponse = new NextResponse(
      JSON.stringify({ error: 'Authentication error', message: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );

    // Add CORS headers to error response
    if (origin) {
      errorResponse.headers.set('Access-Control-Allow-Origin', origin);
      errorResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    } else {
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    }

    return errorResponse;
  }
}

export async function POST(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { params }: { params: Promise<{ nextauth: string[] }> }
) {
  const origin = request.headers.get('origin') || '';

  try {
    // Call the original Auth.js handler
    const authResponse = await AuthPOST(request);

    // Create a new response with the same status, body, and headers
    const response = new NextResponse(authResponse.body, {
      status: authResponse.status,
      statusText: authResponse.statusText,
      headers: new Headers(authResponse.headers)
    });

    // Now add CORS headers to our new response
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
  } catch (error) {
    console.error('Auth error in POST handler:', error);
    // Return a proper error response
    const errorResponse = new NextResponse(
      JSON.stringify({ error: 'Authentication error', message: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );

    // Add CORS headers to error response
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
export async function OPTIONS(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { params }: { params: Promise<{ nextauth: string[] }> }
) {
  const origin = request.headers.get('origin') || '';

  const response = new NextResponse(null, { status: 204 });

  // Add CORS headers to the response - permissive for debugging
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

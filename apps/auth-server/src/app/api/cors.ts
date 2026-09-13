import { NextRequest, NextResponse } from 'next/server';

// Higher-order function to wrap API handlers with CORS
export function withCors(handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) {
  return async function corsHandler(req: NextRequest) {
    // Get the origin from the request headers
    const origin = req.headers.get('origin') || '';

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
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

    // Call the original handler
    const response = await handler(req);

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
    response.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    response.headers.set('Vary', 'Origin');

    return response;
  };
}

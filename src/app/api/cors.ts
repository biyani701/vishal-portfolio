import { NextRequest, NextResponse } from 'next/server';

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'https://vishal.biyani.xyz',
  'https://my-oauth-proxy.vercel.app'
];

// Higher-order function to wrap API handlers with CORS
export function withCors(handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) {
  return async function corsHandler(req: NextRequest) {
    // Get the origin from the request headers
    const origin = req.headers.get('origin') || '';

    // Check if the origin is allowed
    const isAllowedOrigin = allowedOrigins.includes(origin);

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
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

    // Call the original handler
    const response = await handler(req);

    // Add CORS headers to the response
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
      response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, Cache-Control, Pragma');
      response.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
      response.headers.set('Vary', 'Origin');
    }

    return response;
  };
}

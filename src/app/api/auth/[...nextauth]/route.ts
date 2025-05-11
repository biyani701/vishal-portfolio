import { GET as AuthGET, POST as AuthPOST } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'https://vishal.biyani.xyz',
  'https://my-oauth-proxy.vercel.app'
];

// Wrap the Auth.js handlers with CORS
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Call the original Auth.js handler
  const response = await AuthGET(request);

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
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Call the original Auth.js handler
  const response = await AuthPOST(request);

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
}

// Handle OPTIONS requests for preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

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

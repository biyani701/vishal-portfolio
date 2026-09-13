import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '@/app/api/cors';

async function handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error');

  console.error('[auth][custom-error-handler]', {
    error,
    url: request.url,
    origin: request.headers.get('origin'),
    headers: Object.fromEntries(request.headers.entries()),
    searchParams: Object.fromEntries(searchParams.entries()),
  });

  return NextResponse.json(
    {
      error,
      message: 'Authentication error occurred',
      timestamp: new Date().toISOString(),
      details: {
        url: request.url,
        params: Object.fromEntries(searchParams.entries()),
      }
    },
    { status: 500 }
  );
}

export const GET = withCors(handler);

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// API route to get the current session
export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || '';
    
    // Get the current session
    const session = await auth();
    
    // Create a response with the session data
    const response = NextResponse.json(session || { user: null });
    
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
    console.error('Error in session endpoint:', error);
    
    // Create an error response
    const errorResponse = NextResponse.json(
      { 
        error: 'Session error', 
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

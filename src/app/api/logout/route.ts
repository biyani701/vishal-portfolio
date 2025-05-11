import { NextRequest, NextResponse } from 'next/server';

// Simple logout API that clears all cookies
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    
    console.log(`[api/logout] Clearing cookies and redirecting to ${callbackUrl}`);
    
    // Create a response that redirects to the callback URL
    const response = NextResponse.redirect(new URL(callbackUrl, request.url));
    
    // Clear all auth-related cookies
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.callback-url');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('authjs.session-token');
    response.cookies.delete('authjs.callback-url');
    response.cookies.delete('authjs.csrf-token');
    
    return response;
  } catch (error) {
    console.error('[api/logout] Error during logout:', error);
    
    // Redirect to home page on error
    return NextResponse.redirect(new URL('/', request.url));
  }
}

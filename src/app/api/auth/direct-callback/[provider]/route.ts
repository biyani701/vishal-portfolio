import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';

/**
 * This is a direct callback handler for OAuth providers.
 * It's used as a fallback when the normal Auth.js callback doesn't work.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params;
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    console.log(`[direct-callback] Received callback for provider: ${provider}`);
    console.log(`[direct-callback] Code: ${code ? `${code.substring(0, 10)}...` : 'none'}`);
    console.log(`[direct-callback] State: ${state ? `${state.substring(0, 10)}...` : 'none'}`);

    if (!code) {
      return NextResponse.json(
        { error: 'No authorization code provided' },
        { status: 400 }
      );
    }

    // Check if we've already tried to handle this code
    const cookieStore = cookies();
    const attemptCookie = cookieStore.get('auth-callback-attempt');

    if (attemptCookie && attemptCookie.value === code.substring(0, 10)) {
      console.log(`[direct-callback] Already attempted to handle this code, returning success to break loop`);

      // Return a success response to break the loop
      return NextResponse.json(
        { success: true, message: 'Authentication handled' },
        { status: 200 }
      );
    }

    // Set a cookie to track this specific callback attempt
    cookieStore.set('auth-callback-attempt', code.substring(0, 10), {
      path: '/',
      maxAge: 300, // 5 minutes
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Try to get the session directly
    try {
      // Try to authenticate directly with Auth.js
      const session = await auth();
      console.log(`[direct-callback] Current session:`, session ? 'exists' : 'null');

      // If we already have a session, return success
      if (session) {
        console.log(`[direct-callback] Session already exists, returning success`);
        return NextResponse.json(
          { success: true, message: 'Already authenticated' },
          { status: 200 }
        );
      }
    } catch (sessionError) {
      console.error(`[direct-callback] Error getting session:`, sessionError);
    }

    // Construct the Auth.js callback URL
    let callbackUrl = `/api/auth/callback/${provider}?code=${encodeURIComponent(code)}`;
    if (state) {
      callbackUrl += `&state=${encodeURIComponent(state)}`;
    }

    console.log(`[direct-callback] Redirecting to Auth.js callback: ${callbackUrl}`);

    // For XHR requests, return JSON instead of redirecting
    const isXhr = request.headers.get('X-Requested-With') === 'XMLHttpRequest';
    if (isXhr) {
      try {
        // Try to fetch the Auth.js callback URL
        const callbackResponse = await fetch(new URL(callbackUrl, request.url).toString(), {
          headers: {
            Cookie: request.headers.get('cookie') || '',
          },
        });

        console.log(`[direct-callback] Auth.js callback response status: ${callbackResponse.status}`);

        // Try to get the session after the callback
        try {
          const sessionResponse = await fetch(new URL('/api/auth/session', request.url).toString(), {
            headers: {
              Cookie: request.headers.get('cookie') || '',
            },
          });

          const sessionData = await sessionResponse.json();
          console.log(`[direct-callback] Session after callback:`, sessionData);

          // Return the session data
          return NextResponse.json(
            {
              success: true,
              message: 'Authentication handled via XHR',
              session: sessionData
            },
            { status: 200 }
          );
        } catch (sessionError) {
          console.error(`[direct-callback] Error fetching session:`, sessionError);
        }

        // Return the response as JSON
        return NextResponse.json(
          { success: true, message: 'Authentication handled via XHR' },
          { status: 200 }
        );
      } catch (fetchError) {
        console.error(`[direct-callback] Error fetching Auth.js callback:`, fetchError);
        return NextResponse.json(
          { error: 'Error handling authentication' },
          { status: 500 }
        );
      }
    }

    // Check if we've already been redirected here multiple times
    const redirectCount = parseInt(request.headers.get('x-redirect-count') || '0', 10);
    console.log(`[direct-callback] Current redirect count: ${redirectCount}`);

    if (redirectCount > 2) {
      console.log(`[direct-callback] Too many redirects, breaking the loop`);

      // Instead of redirecting again, try to handle the authentication directly
      try {
        // Try to get the session directly
        const session = await auth();

        // If we have a session, redirect to the success page
        if (session) {
          console.log(`[direct-callback] Session established, redirecting to success page`);
          return NextResponse.redirect(new URL('/auth-success', request.url));
        }

        // If we don't have a session, redirect to the home page
        console.log(`[direct-callback] No session established, redirecting to home page`);
        return NextResponse.redirect(new URL('/', request.url));
      } catch (error) {
        console.error(`[direct-callback] Error handling authentication directly:`, error);
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // For regular requests, redirect to the Auth.js callback URL with a timestamp to prevent caching
    const timestamp = Date.now();
    const redirectUrl = new URL(callbackUrl, request.url);
    redirectUrl.searchParams.append('_', timestamp.toString());

    // Increment the redirect count
    const headers = new Headers();
    headers.set('x-redirect-count', (redirectCount + 1).toString());

    console.log(`[direct-callback] Redirecting to: ${redirectUrl.toString()}`);
    return NextResponse.redirect(redirectUrl, {
      headers
    });
  } catch (error) {
    console.error('[direct-callback] Error handling callback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

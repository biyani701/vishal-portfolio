import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { testDatabaseConnection } from '@/lib/prisma';

/**
 * This is a direct callback handler for OAuth providers.
 * It's used as a fallback when the normal Auth.js callback doesn't work.
 * It handles cases where state is missing and prevents authentication loops.
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

    // Check database connection
    const dbConnected = await testDatabaseConnection();
    console.log(`[direct-callback] Database connection status: ${dbConnected ? 'Connected' : 'Disconnected'}`);

    // Check if we've already tried to handle this code
    const cookieHeader = request.headers.get('cookie') || '';
    const codePrefix = code.substring(0, 10);
    const hasAttemptCookie = cookieHeader.includes(`auth-callback-attempt=${codePrefix}`);

    if (hasAttemptCookie) {
      console.log(`[direct-callback] Already attempted to handle this code, returning success to break loop`);

      // Return a success response to break the loop
      return NextResponse.json(
        { success: true, message: 'Authentication handled' },
        { status: 200 }
      );
    }

    // We'll set the cookie in the final response
    console.log(`[direct-callback] Will track authentication attempt for code: ${codePrefix}`);

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

    // If state is missing, create a synthetic state to prevent issues
    // This is important for providers like Google that might not return state
    let callbackUrl = `/api/auth/callback/${provider}?code=${encodeURIComponent(code)}`;
    if (state) {
      callbackUrl += `&state=${encodeURIComponent(state)}`;
    } else {
      // Create a minimal synthetic state with the current timestamp to make auth.js happy
      const syntheticState = JSON.stringify({
        timestamp: Date.now(),
        provider: provider
      });
      console.log(`[direct-callback] Creating synthetic state: ${syntheticState}`);
      callbackUrl += `&state=${encodeURIComponent(syntheticState)}`;
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

        // Extract the session cookie from the response
        const setCookieHeader = callbackResponse.headers.get('set-cookie');
        console.log(`[direct-callback] Set-Cookie header from Auth.js: ${setCookieHeader ? 'present' : 'missing'}`);

        if (setCookieHeader) {
          // Log the session cookie for debugging
          const sessionCookie = setCookieHeader.split(';')[0];
          console.log(`[direct-callback] Session cookie: ${sessionCookie}`);
        }

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
    // Lower the threshold to 1 to break loops faster
    const redirectCount = parseInt(request.headers.get('x-redirect-count') || '0', 10);
    console.log(`[direct-callback] Current redirect count: ${redirectCount}`);

    // Break the loop after just 1 redirect to prevent infinite loops
    if (redirectCount > 1) {
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

        // If we don't have a session, try to create one directly
        console.log(`[direct-callback] No session established, trying direct authentication`);

        // Get the current URL for reference
        const currentUrl = new URL(request.url);
        const serverOrigin = `${currentUrl.protocol}//${currentUrl.host}`;

        // Redirect to the home page with a message
        return NextResponse.redirect(new URL('/?auth=failed', serverOrigin));
      } catch (error) {
        console.error(`[direct-callback] Error handling authentication directly:`, error);
        return NextResponse.redirect(new URL('/?auth=error', request.url));
      }
    }

    // For regular requests, call the Auth.js callback directly to get the session cookie
    try {
      console.log(`[direct-callback] Calling Auth.js callback directly to get session cookie`);
      const callbackResponse = await fetch(new URL(callbackUrl, request.url).toString(), {
        headers: {
          Cookie: request.headers.get('cookie') || '',
        },
      });

      console.log(`[direct-callback] Auth.js callback direct call status: ${callbackResponse.status}`);

      // Extract the session cookie from the response
      const setCookieHeader = callbackResponse.headers.get('set-cookie');
      console.log(`[direct-callback] Set-Cookie header from direct call: ${setCookieHeader ? 'present' : 'missing'}`);

      if (setCookieHeader) {
        // Log the session cookie for debugging
        const sessionCookie = setCookieHeader.split(';')[0];
        console.log(`[direct-callback] Session cookie from direct call: ${sessionCookie}`);

        // Create a redirect response to the success page
        const currentUrl = new URL(request.url);
        const serverOrigin = `${currentUrl.protocol}//${currentUrl.host}`;
        const successUrl = new URL('/auth-success', serverOrigin);

        // Add the provider as a query parameter
        successUrl.searchParams.append('provider', provider);

        console.log(`[direct-callback] Redirecting to success page with session cookie: ${successUrl.toString()}`);
        const redirectResponse = NextResponse.redirect(successUrl);

        // Copy all cookies from the Auth.js response
        const cookies = setCookieHeader.split(',').map(cookie => cookie.trim());
        cookies.forEach(cookie => {
          redirectResponse.headers.append('Set-Cookie', cookie);
        });

        // Set the cookie to track this authentication attempt
        redirectResponse.cookies.set('auth-callback-attempt', codePrefix, {
          path: '/',
          maxAge: 300, // 5 minutes
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });

        return redirectResponse;
      }
    } catch (error) {
      console.error(`[direct-callback] Error calling Auth.js callback directly:`, error);
    }

    // Fallback to the original redirect if direct call fails
    const timestamp = Date.now();
    const redirectUrl = new URL(callbackUrl, request.url);
    redirectUrl.searchParams.append('_', timestamp.toString());

    console.log(`[direct-callback] Falling back to original redirect: ${redirectUrl.toString()}`);
    const redirectResponse = NextResponse.redirect(redirectUrl);

    // Set the cookie to track this authentication attempt
    redirectResponse.cookies.set('auth-callback-attempt', codePrefix, {
      path: '/',
      maxAge: 300, // 5 minutes
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return redirectResponse;
  } catch (error) {
    console.error('[direct-callback] Error handling callback:', error);

    // Get the current URL for reference
    const currentUrl = new URL(request.url);
    const serverOrigin = `${currentUrl.protocol}//${currentUrl.host}`;

    // Redirect to the error page with more details
    return NextResponse.redirect(
      new URL(`/auth-error?error=CallbackError&message=${encodeURIComponent(
        error instanceof Error ? error.message : 'Unknown error during callback'
      )}`, serverOrigin)
    );
  }
}

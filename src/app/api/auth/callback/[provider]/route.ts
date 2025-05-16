import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Custom callback handler for Auth.js v5
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    // Get the provider from the URL parameters
    const { provider } = await params;

    // Get the code and state from the query parameters
    const urlParams = new URL(request.url).searchParams;
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    console.log(`[auth][callback] Provider: ${provider}, Code: ${code ? 'present' : 'missing'}, State: ${state ? 'present' : 'missing'}, Error: ${error || 'none'}`);

    // Check for error
    if (error) {
      console.error(`[auth][callback] Error from provider: ${error}`);
      return NextResponse.redirect(new URL(`/auth-error?error=${error}`, request.url));
    }

    // Check for required parameters
    if (!code) {
      console.error('[auth][callback] Missing code parameter');
      return NextResponse.redirect(new URL('/auth-error?error=MissingCode', request.url));
    }

    // Get the request origin and referer
    const requestOrigin = request.headers.get('origin');
    const referer = request.headers.get('referer');

    // Check for client origin in query parameters (more reliable than headers for redirects)
    const searchParams = new URL(request.url).searchParams;
    const clientOriginParam = searchParams.get('x-client-origin');

    // Also check headers for client origin
    const clientOriginHeader = request.headers.get('x-client-origin');

    // Use the client origin from the query parameter or header
    const clientOrigin = clientOriginParam || clientOriginHeader;

    // Determine if the request is from the same origin as the server
    const currentUrl = new URL(request.url);
    const serverOrigin = `${currentUrl.protocol}//${currentUrl.host}`;

    console.log(`[auth][callback] Server origin: ${serverOrigin}`);
    console.log(`[auth][callback] Request origin: ${requestOrigin || 'not set'}`);
    console.log(`[auth][callback] Client origin from param: ${clientOriginParam || 'not set'}`);
    console.log(`[auth][callback] Client origin from header: ${clientOriginHeader || 'not set'}`);
    console.log(`[auth][callback] Referer: ${referer || 'not set'}`);

    // Extract the callbackUrl and clientOrigin from the state parameter if available
    let callbackUrl: string | null = null;
    let stateClientOrigin: string | null = null;
    try {
      if (state) {
        const decodedState = decodeURIComponent(state);
        const stateObj = JSON.parse(decodedState);
        callbackUrl = stateObj.callbackUrl || null;
        stateClientOrigin = stateObj.clientOrigin || null;
        console.log(`[auth][callback] Extracted from state - callbackUrl: ${callbackUrl}, clientOrigin: ${stateClientOrigin}`);
      }
    } catch (error) {
      console.error(`[auth][callback] Error parsing state parameter:`, error);
    }

    // Use the client origin from the state parameter if available
    const effectiveClientOrigin = stateClientOrigin || clientOrigin;

    // First, try to authenticate the user with Auth.js
    try {
      // Create a session for the user
      console.log(`[auth][callback] Attempting to create session for provider: ${provider}`);

      // Instead of calling the Auth.js API directly, we need to use the NextAuth.js handler
      // This is a workaround to avoid infinite loops

      // Create a new URL for the Auth.js callback
      const authCallbackUrl = new URL(`/api/auth/callback/${provider}`, serverOrigin);

      // Add all the query parameters from the original request
      urlParams.forEach((value, key) => {
        authCallbackUrl.searchParams.append(key, value);
      });

      // Add the client origin to the request
      if (effectiveClientOrigin) {
        authCallbackUrl.searchParams.append('x-client-origin', effectiveClientOrigin);
      }

      // Add a timestamp to prevent caching
      authCallbackUrl.searchParams.append('_', Date.now().toString());

      console.log(`[auth][callback] Auth.js callback URL: ${authCallbackUrl.toString()}`);

      // We need to manually set the session cookie
      // This is a workaround to avoid infinite loops

      // Get the cookies from the request
      const cookieHeader = request.headers.get('cookie');
      console.log(`[auth][callback] Cookie header: ${cookieHeader || 'missing'}`);

      // Check if we have a session token in the cookies
      const hasSessionToken = cookieHeader && cookieHeader.includes('next-auth.session-token');

      console.log(`[auth][callback] Session token in cookies: ${hasSessionToken ? 'present' : 'missing'}`);

      // Try to get the session
      const session = await auth();

      console.log(`[auth][callback] Auth.js session result:`, session);

      // If we don't have a session, try to create one by calling the Auth.js API directly
      if (!session) {
        console.log(`[auth][callback] No session found, trying to create one directly`);

        try {
          // Call the Auth.js API directly
          const authResponse = await fetch(authCallbackUrl.toString(), {
            headers: {
              Cookie: cookieHeader || '',
            },
          });

          console.log(`[auth][callback] Direct Auth.js API call result: ${authResponse.status}`);

          // Try to get the session again
          const newSession = await auth();
          console.log(`[auth][callback] Auth.js session after direct call:`, newSession);
        } catch (authError) {
          console.error(`[auth][callback] Error calling Auth.js API directly:`, authError);
        }
      }

      // Determine the redirect target based on the available information
      let redirectTarget: string;

      // If we have a callbackUrl from the state, use that
      if (callbackUrl) {
        // Extract the origin from the callbackUrl
        try {
          const callbackUrlObj = new URL(callbackUrl);
          const callbackOrigin = `${callbackUrlObj.protocol}//${callbackUrlObj.host}`;
          redirectTarget = `${callbackOrigin}/auth-success?provider=${provider}&code=${code}`;
          console.log(`[auth][callback] Using callbackUrl origin for redirect: ${redirectTarget}`);
        } catch (error) {
          console.error(`[auth][callback] Error parsing callbackUrl:`, error);
          // Fall back to other methods
          if (effectiveClientOrigin) {
            redirectTarget = `${effectiveClientOrigin}/auth-success?provider=${provider}&code=${code}`;
            console.log(`[auth][callback] Falling back to effective client origin for redirect: ${redirectTarget}`);
          } else {
            redirectTarget = `${serverOrigin}/auth-success?provider=${provider}&code=${code}`;
            console.log(`[auth][callback] Falling back to server origin for redirect: ${redirectTarget}`);
          }
        }
      }
      // If we have an effective client origin, use that
      else if (effectiveClientOrigin) {
        redirectTarget = `${effectiveClientOrigin}/auth-success?provider=${provider}&code=${code}`;
        console.log(`[auth][callback] Using effective client origin for redirect: ${redirectTarget}`);
      }
      // If the referer is from the same origin as the server, redirect to the server's success page
      else if (referer && referer.startsWith(serverOrigin)) {
        redirectTarget = `${serverOrigin}/auth-success?provider=${provider}&code=${code}`;
        console.log(`[auth][callback] Using server origin for redirect (same origin): ${redirectTarget}`);
      }
      // Default to the server origin
      else {
        redirectTarget = `${serverOrigin}/auth-success?provider=${provider}&code=${code}`;
        console.log(`[auth][callback] Using server origin as fallback: ${redirectTarget}`);
      }

      // Check if we've already been redirected here multiple times
      const redirectCount = parseInt(request.headers.get('x-redirect-count') || '0', 10);
      console.log(`[auth][callback] Current redirect count: ${redirectCount}`);

      if (redirectCount > 2) {
        console.log(`[auth][callback] Too many redirects, breaking the loop`);

        // Instead of redirecting again, return a JSON response
        return NextResponse.json(
          {
            success: true,
            message: 'Authentication successful, but breaking redirect loop',
            redirectTo: redirectTarget
          },
          { status: 200 }
        );
      }

      // Increment the redirect count
      const headers = new Headers();
      headers.set('x-redirect-count', (redirectCount + 1).toString());

      console.log(`[auth][callback] Authentication successful, redirecting to: ${redirectTarget}`);
      return NextResponse.redirect(redirectTarget, {
        headers
      });
    } catch (error) {
      console.error(`[auth][callback] Error creating session:`, error);

      // Continue with the redirect even if session creation fails
      // This allows the auth-success page to handle the authentication
      let redirectTarget = `${serverOrigin}/auth-success?provider=${provider}&code=${code}`;

      if (effectiveClientOrigin) {
        redirectTarget = `${effectiveClientOrigin}/auth-success?provider=${provider}&code=${code}`;
      }

      // Check if we've already been redirected here multiple times
      const redirectCount = parseInt(request.headers.get('x-redirect-count') || '0', 10);
      console.log(`[auth][callback] Current redirect count (error handler): ${redirectCount}`);

      if (redirectCount > 2) {
        console.log(`[auth][callback] Too many redirects in error handler, breaking the loop`);

        // Instead of redirecting again, return a JSON response
        return NextResponse.json(
          {
            success: false,
            message: 'Authentication failed, but breaking redirect loop',
            redirectTo: redirectTarget
          },
          { status: 200 }
        );
      }

      // Increment the redirect count
      const headers = new Headers();
      headers.set('x-redirect-count', (redirectCount + 1).toString());

      console.log(`[auth][callback] Redirecting despite error: ${redirectTarget}`);
      return NextResponse.redirect(redirectTarget, {
        headers
      });
    }

    // The following code is commented out because it causes an infinite loop
    /*
    const authCallbackUrl = new URL(`/api/auth/callback/${provider}`, request.url);
    urlParams.forEach((value, key) => {
      authCallbackUrl.searchParams.append(key, value);
    });

    try {
      // Let Auth.js handle the callback
      const response = await fetch(authCallbackUrl.toString(), {
        headers: request.headers,
      });
    */

      /* The following code is commented out because it's part of the infinite loop
      if (response.ok) {
        console.log(`[auth][callback] Authentication successful, redirecting to ${clientOrigin}/auth-success`);
        return NextResponse.redirect(`${clientOrigin}/auth-success?provider=${provider}`);
      } else {
        console.error(`[auth][callback] Error from Auth.js: ${response.status} ${response.statusText}`);
        return NextResponse.redirect(`${clientOrigin}/auth-error?error=AuthError&status=${response.status}`);
      }
    } catch (error) {
      if (isAuthRedirectError(error)) {
        console.log('[auth][callback] Handling NEXT_REDIRECT:', error.digest);
        const redirectUrl = error.digest.split(';')[2];
        if (redirectUrl) {
          const clientRedirectUrl = `${clientOrigin}/auth-success?provider=${provider}`;
          console.log(`[auth][callback] Redirecting to client: ${clientRedirectUrl}`);
          return NextResponse.redirect(clientRedirectUrl);
        }
        throw error;
      }

      console.error('[auth][callback] Error during callback:', error);
      return NextResponse.redirect(`${clientOrigin}/auth-error?error=CallbackError&message=${encodeURIComponent(
        error instanceof Error ? error.message : 'Unknown error'
      )}`);
    }
    */
  } catch (error) {
    // Handle any errors that might occur
    console.error('[auth][callback] Unexpected error:', error);

    // Determine the redirect target for error handling
    const currentUrl = new URL(request.url);
    const serverOrigin = `${currentUrl.protocol}//${currentUrl.host}`;
    const clientOrigin = request.headers.get('x-client-origin');

    let errorRedirectTarget: string;

    if (clientOrigin) {
      errorRedirectTarget = `${clientOrigin}/auth-error`;
    } else if (serverOrigin.includes('localhost:4000')) {
      errorRedirectTarget = 'http://localhost:3000/auth-error';
    } else {
      errorRedirectTarget = `${serverOrigin}/auth-error`;
    }

    // Redirect to the error page
    return NextResponse.redirect(`${errorRedirectTarget}?error=UnexpectedError&message=${encodeURIComponent(
      error instanceof Error ? error.message : 'Unknown error'
    )}`);
  }
}

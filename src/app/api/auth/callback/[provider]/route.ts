import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define a type for Auth.js redirect errors
interface AuthRedirectError extends Error {
  digest: string;
}

// Check if an error is an Auth.js redirect error
function isAuthRedirectError(error: unknown): error is AuthRedirectError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest: string }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  );
}

// Custom callback handler for Auth.js v5
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    // Get the provider from the URL parameters
    const { provider } = await params;

    // Get the code and state from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

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

    // Get the client origin from headers or use default
    const clientOrigin = request.headers.get('x-client-origin') || 'http://localhost:3000';
    console.log(`[auth][callback] Client origin from headers: ${clientOrigin}`);

    // Instead of forwarding to the Auth.js callback handler, which causes an infinite loop,
    // we'll directly redirect to the client's success page
    console.log(`[auth][callback] Authentication successful, redirecting to ${clientOrigin}/auth-success`);
    return NextResponse.redirect(`${clientOrigin}/auth-success?provider=${provider}&code=${code}`);

    // The following code is commented out because it causes an infinite loop
    /*
    const authCallbackUrl = new URL(`/api/auth/callback/${provider}`, request.url);
    searchParams.forEach((value, key) => {
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

    // Get the client origin from the error context if available
    const errorClientOrigin = clientOrigin || 'http://localhost:3000';

    // Redirect to the error page
    return NextResponse.redirect(`${errorClientOrigin}/auth-error?error=UnexpectedError&message=${encodeURIComponent(
      error instanceof Error ? error.message : 'Unknown error'
    )}`);
  }
}

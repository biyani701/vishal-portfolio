import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/auth';

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

// Custom sign-in handler for Auth.js v5
export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    // Get the provider from the URL parameters
    const provider = params.provider;

    // Get the callback URL from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    console.log(`[auth][signin] Provider: ${provider}, CallbackUrl: ${callbackUrl}`);

    // Validate the provider
    if (!provider || !['google', 'github'].includes(provider)) {
      return NextResponse.redirect(new URL(`/auth-error?error=InvalidProvider&provider=${provider}`, request.url));
    }

    try {
      // Get the sign-in URL from Auth.js v5
      const signInUrl = await signIn(provider, { redirectTo: callbackUrl });

      console.log(`[auth][signin] Redirecting to: ${signInUrl}`);

      // Create a redirect response
      return NextResponse.redirect(signInUrl);
    } catch (error: unknown) {
      // If this is a redirect error from Auth.js, handle it
      if (isAuthRedirectError(error)) {
        console.log('[auth][signin] Handling NEXT_REDIRECT:', error.digest);

        // Extract the URL from the digest
        const redirectUrl = error.digest.split(';')[2];
        if (redirectUrl) {
          return NextResponse.redirect(redirectUrl);
        }

        // If we can't extract the URL, throw the error to let Next.js handle it
        throw error;
      }

      console.error('[auth][signin] Error during sign-in:', error);

      // Redirect to the error page for other errors
      return NextResponse.redirect(
        new URL(`/auth-error?error=SignInError&message=${encodeURIComponent(
          error instanceof Error ? error.message : 'Unknown error'
        )}`, request.url)
      );
    }
  } catch (error: unknown) {
    // If this is a redirect error from Auth.js, handle it
    if (isAuthRedirectError(error)) {
      console.log('[auth][signin] Handling NEXT_REDIRECT in outer catch:', error.digest);

      // Extract the URL from the digest
      const redirectUrl = error.digest.split(';')[2];
      if (redirectUrl) {
        return NextResponse.redirect(redirectUrl);
      }

      // If we can't extract the URL, throw the error to let Next.js handle it
      throw error;
    }

    console.error('[auth][signin] Unexpected error:', error);

    // Redirect to the error page
    return NextResponse.redirect(
      new URL(`/auth-error?error=UnexpectedError&message=${encodeURIComponent(
        error instanceof Error ? error.message : 'Unknown error'
      )}`, request.url)
    );
  }
}

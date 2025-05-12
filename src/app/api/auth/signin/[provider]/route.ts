import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/auth';

// Custom sign-in handler for Auth.js v5
export async function GET(
  request: NextRequest,
  context: { params: { provider: string } }
) {
  try {
    // Get the provider from the URL parameters - properly await the context
    const { provider } = context.params;

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
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
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
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
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

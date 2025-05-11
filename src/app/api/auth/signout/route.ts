import { NextRequest, NextResponse } from 'next/server';
import { signOut } from '@/auth';

// Custom sign-out handler for Auth.js v5
export async function GET(request: NextRequest) {
  try {
    // Get the callback URL from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    console.log(`[auth][signout] CallbackUrl: ${callbackUrl}`);

    try {
      // Get the sign-out URL from Auth.js v5
      const signOutUrl = await signOut({ redirectTo: callbackUrl });

      console.log(`[auth][signout] Redirecting to: ${signOutUrl}`);

      // Create a redirect response
      return NextResponse.redirect(signOutUrl);
    } catch (error: any) {
      // If this is a redirect error from Auth.js, let it propagate
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
        console.log('[auth][signout] Handling NEXT_REDIRECT:', error.digest);

        // Extract the URL from the digest
        const redirectUrl = error.digest.split(';')[2];
        if (redirectUrl) {
          return NextResponse.redirect(redirectUrl);
        }

        // If we can't extract the URL, throw the error to let Next.js handle it
        throw error;
      }

      console.error('[auth][signout] Error during sign-out:', error);

      // Redirect to the error page for other errors
      return NextResponse.redirect(
        new URL(`/auth-error?error=SignOutError&message=${encodeURIComponent(
          error instanceof Error ? error.message : 'Unknown error'
        )}`, request.url)
      );
    }
  } catch (error: any) {
    // If this is a redirect error from Auth.js, let it propagate
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      console.log('[auth][signout] Handling NEXT_REDIRECT in outer catch:', error.digest);

      // Extract the URL from the digest
      const redirectUrl = error.digest.split(';')[2];
      if (redirectUrl) {
        return NextResponse.redirect(redirectUrl);
      }

      // If we can't extract the URL, throw the error to let Next.js handle it
      throw error;
    }

    console.error('[auth][signout] Unexpected error:', error);

    // Redirect to the error page
    return NextResponse.redirect(
      new URL(`/auth-error?error=UnexpectedError&message=${encodeURIComponent(
        error instanceof Error ? error.message : 'Unknown error'
      )}`, request.url)
    );
  }
}

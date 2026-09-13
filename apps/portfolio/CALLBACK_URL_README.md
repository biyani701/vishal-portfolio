# Auth.js Callback URL Configuration

This document explains how to configure the callback URL in Auth.js to ensure proper redirection after authentication.

## The Problem

When signing in with GitHub, the Auth.js server is redirecting to its own domain (localhost:4000) instead of redirecting back to your portfolio application (localhost:3000).

## Solution

### 1. Check the Auth.js Configuration in my-auth-backend

In your my-auth-backend server, make sure the Auth.js configuration is correctly handling the callback URL:

```typescript
// In src/auth.ts
const createDynamicHandler = async (req: Request | NextRequest) => {
  // Get origin from query parameters or headers
  const origin = await getOriginFromRequest(req);

  console.log("[auth] Request from origin:", origin);

  // Create dynamic config based on origin
  const dynamicAuthConfig = createAuthConfig(origin || undefined);

  // Create the Auth.js handler with dynamic config
  const handler = NextAuth({
    ...dynamicAuthConfig,
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
          domain: undefined
        }
      },
      callbackUrl: {
        name: `next-auth.callback-url`,
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
          domain: undefined
        }
      },
      csrfToken: {
        name: `next-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
          domain: undefined
        }
      }
    },
    // Add a callback to handle the callbackUrl
    callbacks: {
      ...dynamicAuthConfig.callbacks,
      async redirect({ url, baseUrl }) {
        // If the URL is relative, prepend the base URL
        if (url.startsWith('/')) {
          return `${baseUrl}${url}`;
        }
        // If the URL is absolute but on the same origin as the site, allow it
        else if (new URL(url).origin === baseUrl) {
          return url;
        }
        // If the URL is for the callback URL specified in the sign-in request, allow it
        else if (req.url.includes('callbackUrl=') && decodeURIComponent(req.url).includes(url)) {
          console.log(`[auth] Allowing redirect to external URL: ${url}`);
          return url;
        }
        // Otherwise, redirect to the base URL
        return baseUrl;
      }
    }
  });

  return handler;
};
```

### 2. Update the getOriginFromRequest Function

Make sure the `getOriginFromRequest` function is correctly extracting the origin from the request:

```typescript
const getOriginFromRequest = async (req?: Request | NextRequest) => {
  try {
    // If we have a request object, check for query parameters first
    if (req) {
      const url = new URL(req.url);
      
      // Check for origin parameter
      const originParam = url.searchParams.get('origin');
      if (originParam) {
        console.log('[auth] Using origin from query parameter:', originParam);
        return originParam;
      }
      
      // Check for callbackUrl parameter
      const callbackUrl = url.searchParams.get('callbackUrl');
      if (callbackUrl) {
        try {
          const callbackOrigin = new URL(decodeURIComponent(callbackUrl)).origin;
          console.log('[auth] Extracted origin from callbackUrl:', callbackOrigin);
          return callbackOrigin;
        } catch (e) {
          console.error('[auth] Failed to extract origin from callbackUrl:', e);
        }
      }
    }

    // Otherwise, check headers
    const headersList = req ? req.headers : await headers();
    return headersList.get("origin") ||
           headersList.get("x-client-origin") ||
           headersList.get("referer");
  } catch (error) {
    console.error("Failed to get origin:", error);
    return null;
  }
};
```

### 3. Update the signin Route Handler

Make sure the signin route handler is correctly handling the callbackUrl parameter:

```typescript
// In src/app/api/auth/signin/[provider]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    // Get the provider from the URL parameters
    const { provider } = await params;

    // Get the callback URL from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    console.log(`[auth][signin] Provider: ${provider}, CallbackUrl: ${callbackUrl}`);

    // Validate the provider
    if (!provider || !['google', 'github', 'facebook', 'linkedin', 'auth0'].includes(provider)) {
      return NextResponse.redirect(new URL(`/auth-error?error=InvalidProvider&provider=${provider}`, request.url));
    }

    try {
      // Ensure we have a valid callback URL
      const validCallbackUrl = callbackUrl || '/';

      // Get the sign-in URL from Auth.js
      const signInUrl = await signIn(provider, {
        redirectTo: validCallbackUrl,
        redirect: false,
      });

      console.log(`[auth][signin] Redirecting to: ${signInUrl}`);

      // Create a redirect response
      return NextResponse.redirect(signInUrl);
    } catch (error: unknown) {
      // Handle redirect errors
      if (isAuthRedirectError(error)) {
        console.log('[auth][signin] Handling NEXT_REDIRECT:', error.digest);
        const redirectUrl = error.digest.split(';')[2];
        if (redirectUrl) {
          return NextResponse.redirect(redirectUrl);
        }
        throw error;
      }
      
      // Handle other errors
      console.error('[auth][signin] Error during sign-in:', error);
      return NextResponse.redirect(new URL(`/auth-error?error=SignInError&message=${encodeURIComponent(String(error))}`, request.url));
    }
  } catch (error) {
    console.error('[auth][signin] Unexpected error:', error);
    return NextResponse.redirect(new URL(`/auth-error?error=UnexpectedError&message=${encodeURIComponent(String(error))}`, request.url));
  }
}
```

## Testing

After making these changes, test the authentication flow:

1. Start both servers:
   - Start the my-auth-backend server on port 4000
   - Start the portfolio application on port 3000

2. Navigate to `/auth-debug-tool` in the portfolio application

3. Click on "Open Sign-In URL" for GitHub

4. After authenticating with GitHub, you should be redirected back to your portfolio application

If you're still having issues, check the browser console and the server logs for error messages.

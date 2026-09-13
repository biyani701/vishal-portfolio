# Auth.js Integration Guide

This guide explains how to integrate the portfolio application with the my-auth-backend server.

## CORS Issues and Solutions

When integrating the portfolio application with the my-auth-backend server, you may encounter CORS (Cross-Origin Resource Sharing) issues. This is because the portfolio application is running on a different origin (e.g., `http://localhost:3000`) than the my-auth-backend server (e.g., `http://localhost:4000`).

### Required Changes to my-auth-backend

To fix the CORS issues, you need to make the following changes to the my-auth-backend server:

1. **Update the identifyClient function**

   In `src/auth.config.ts`, update the `identifyClient` function to include `localhost:3000`:

   ```typescript
   export const identifyClient = (origin?: string): ClientId => {
     if (!origin) return ClientId.DEFAULT;

     // Map origins to client IDs
     if (origin.includes('client1.com') || origin.includes('localhost:3001')) {
       return ClientId.CLIENT1;
     } else if (origin.includes('client2.com') || origin.includes('localhost:3002')) {
       return ClientId.CLIENT2;
     } else if (origin.includes('vishal.biyani.xyz') || origin.includes('github.io') || origin.includes('localhost:3000')) {
       return ClientId.PORTFOLIO;
     }

     // Default fallback
     return ClientId.DEFAULT;
   };
   ```

2. **Update the getOriginFromRequest function**

   In `src/auth.ts`, update the `getOriginFromRequest` function to check for the `origin` query parameter:

   ```typescript
   const getOriginFromRequest = async (req?: Request | NextRequest) => {
     try {
       // If we have a request object, check for query parameters first
       if (req) {
         const url = new URL(req.url);
         const originParam = url.searchParams.get('origin');
         if (originParam) {
           console.log('[auth] Using origin from query parameter:', originParam);
           return originParam;
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

3. **Update the createDynamicHandler function**

   In `src/auth.ts`, update the `createDynamicHandler` function to use the `getOriginFromRequest` function:

   ```typescript
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
         // ... existing cookie configuration
       },
       // Store the client origin in the account during sign in
       events: {
         signIn: ({ account }) => {
           if (account && origin) {
             account.clientOrigin = origin;
           }
         }
       }
     });

     return handler;
   };
   ```

4. **Configure CORS in next.config.js**

   Make sure your `next.config.js` file includes the necessary CORS configuration:

   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     async headers() {
       return [
         {
           // Apply these headers to all routes
           source: '/:path*',
           headers: [
             {
               key: 'Access-Control-Allow-Origin',
               value: '*', // In production, you should restrict this to your client domains
             },
             {
               key: 'Access-Control-Allow-Methods',
               value: 'GET, POST, PUT, DELETE, OPTIONS',
             },
             {
               key: 'Access-Control-Allow-Headers',
               value: 'X-Requested-With, Content-Type, Accept, Origin, Authorization',
             },
             {
               key: 'Access-Control-Allow-Credentials',
               value: 'true',
             },
           ],
         },
       ];
     },
   };

   module.exports = nextConfig;
   ```

5. **Set up environment variables**

   Make sure your `.env.local` file includes the correct GitHub OAuth app credentials for the portfolio client:

   ```
   # GitHub OAuth credentials for portfolio (localhost:3000)
   GITHUB_CLIENT_ID_PORTFOLIO=your_github_client_id_for_portfolio
   GITHUB_CLIENT_SECRET_PORTFOLIO=your_github_client_secret_for_portfolio
   ```

## GitHub OAuth App Configuration

Make sure your GitHub OAuth app is configured correctly:

1. **Homepage URL**: Set to `http://localhost:3000` for local development
2. **Authorization callback URL**: Set to `http://localhost:4000/api/auth/callback/github`
3. **Client ID and Client Secret**: Set in the my-auth-backend server's `.env.local` file

## Fixing "handler.auth is not a function" Error

If you encounter the error `"handler.auth is not a function"`, it's likely due to a mismatch between the Auth.js version and the way it's being used. Here's how to fix it:

1. **Check Auth.js Version**

   Make sure you're using Auth.js v5 in your my-auth-backend server:

   ```bash
   npm list next-auth
   ```

   If you're using Auth.js v5, the output should show something like `next-auth@5.x.x`.

2. **Update the auth.ts File**

   In `src/auth.ts`, update the auth function to use the correct Auth.js v5 syntax:

   ```typescript
   export async function auth() {
     // For server components, we need to use the headers() API
     const origin = await getOriginFromRequest();

     // Create the Auth.js handler with dynamic config
     const handler = NextAuth({
       ...createAuthConfig(origin || undefined),
       session: { strategy: "jwt" },
       secret: process.env.AUTH_SECRET,
       debug: process.env.NODE_ENV === 'development'
     });

     // In Auth.js v5, we use the auth() function directly from the handler
     return await handler.auth();
   }
   ```

3. **Update the GET and POST Handlers**

   Make sure your GET and POST handlers are using the correct Auth.js v5 syntax:

   ```typescript
   export async function GET(req: NextRequest) {
     const handler = await createDynamicHandler(req);
     return handler.handlers.GET(req);
   }

   export async function POST(req: NextRequest) {
     const handler = await createDynamicHandler(req);
     return handler.handlers.POST(req);
   }
   ```

4. **Check for Circular Dependencies**

   Make sure there are no circular dependencies in your code. For example, if `auth.ts` imports from `auth.config.ts` and `auth.config.ts` imports from `auth.ts`, this can cause issues.

## Testing the Integration

After making these changes, you can test the integration using the AuthDebugTool:

1. Navigate to `/auth-debug-tool` in the portfolio application
2. Click on "Test Auth Server Connection" to check if the connection is working
3. Click on "Open Auth Server Directly" to check if the auth server is accessible
4. Use the "Generate Sign-In URLs" section to test the authentication flow

If you're still having issues, check the browser console for error messages.

## Production Deployment

For production deployment, make sure to:

1. Update the GitHub OAuth app to include the production URLs
2. Set the correct environment variables in both the portfolio and my-auth-backend servers
3. Update the CORS configuration to only allow requests from trusted domains

---
sidebar_position: 6
---

# Auth0 Setup Guide

This guide explains how to set up Auth0 for use with the Auth.js Multi-Client system.

## Creating an Auth0 Application

1. Sign up for an [Auth0 account](https://auth0.com/signup) if you don't have one
2. Log in to your Auth0 dashboard
3. Navigate to "Applications" in the left sidebar
4. Click "Create Application"
5. Give your application a name (e.g., "My OAuth Proxy")
6. Select "Regular Web Applications" as the application type
7. Click "Create"

## Configuring Your Auth0 Application

After creating your application, you need to configure it:

1. In your Auth0 application settings, scroll down to "Application URIs"
2. Set the following URLs:
   - **Allowed Callback URLs**: `https://my-oauth-proxy.vercel.app/api/auth/callback/auth0,http://localhost:4002/api/auth/callback/auth0`
   - **Allowed Logout URLs**: `https://my-oauth-proxy.vercel.app,http://localhost:4002`
   - **Allowed Web Origins**: `https://my-oauth-proxy.vercel.app,http://localhost:4002`
3. Scroll down and click "Save Changes"

## Getting Your Auth0 Credentials

You'll need three pieces of information from Auth0:

1. **Client ID**: Found on your Auth0 application settings page
2. **Client Secret**: Found on your Auth0 application settings page
3. **Issuer URL**: This is your Auth0 domain with `https://` prefix

### Finding Your Auth0 Domain (Issuer URL)

Your Auth0 domain is displayed in the top-right corner of your Auth0 dashboard. It typically looks like:

```
dev-example.us.auth0.com
```

Your full issuer URL would be:

```
https://dev-example.us.auth0.com
```

## Setting Environment Variables

Add the following environment variables to your `.env.local` file for local development:

```bash
# Auth0 credentials
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_ISSUER=https://your-auth0-domain.auth0.com
```

For Vercel deployment, add these same environment variables in your Vercel project settings.

## Common Auth0 Issues and Solutions

### Invalid Issuer URL

The most common issue with Auth0 integration is an incorrectly formatted issuer URL. Make sure:

1. The URL starts with `https://`
2. The URL does not have a trailing slash
3. The domain is your complete Auth0 domain (e.g., `dev-example.us.auth0.com`)

Example of a correct Auth0 issuer URL:
```
https://dev-example.us.auth0.com
```

### Response is not a conform Authorization Server Metadata response

This error occurs when Auth.js cannot discover the OpenID Connect configuration from Auth0. To fix:

1. Make sure your Auth0 issuer URL is correct
2. Check that your Auth0 application is properly configured
3. Verify that your Auth0 account is active and not in a trial that has expired

### Callback URL Mismatch

If you see an error about the callback URL not being allowed:

1. Go to your Auth0 application settings
2. Add both your production and development callback URLs:
   ```
   https://my-oauth-proxy.vercel.app/api/auth/callback/auth0,http://localhost:4000/api/auth/callback/auth0
   ```

## Testing Auth0 Integration

To test your Auth0 integration:

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:4002/auth-test`
3. Click "Sign in with Auth0"
4. You should be redirected to the Auth0 login page
5. After logging in, you should be redirected back to your application

If you encounter any issues, check the console logs for detailed error messages.

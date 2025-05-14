---
sidebar_position: 4
---

# GitHub OAuth Setup

This guide explains how to set up GitHub OAuth for use with the Auth.js Multi-Client system.

## Creating a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on "OAuth Apps" in the left sidebar
3. Click "New OAuth App"
4. Fill in the application details:
   - **Application name**: A descriptive name for your application
   - **Homepage URL**: Your application's homepage URL (e.g., `https://my-oauth-proxy.vercel.app`)
   - **Application description**: A brief description of your application
   - **Authorization callback URL**: Your Auth.js callback URL (e.g., `https://my-oauth-proxy.vercel.app/api/auth/callback/github`)
5. Click "Register application"
6. Note your Client ID
7. Click "Generate a new client secret" and note the generated secret

## Setting Up Multiple GitHub OAuth Apps for Different Clients

If you have multiple clients that need to use GitHub authentication, you'll need to create a separate GitHub OAuth App for each client.

### For Client 1

1. Create a new GitHub OAuth App as described above
2. Set the **Homepage URL** to Client 1's domain (e.g., `https://client1.com`)
3. Set the **Authorization callback URL** to your Auth.js server's callback URL (e.g., `https://my-oauth-proxy.vercel.app/api/auth/callback/github`)
4. Note the Client ID and Client Secret
5. Add them to your environment variables as `GITHUB_CLIENT_ID_CLIENT1` and `GITHUB_CLIENT_SECRET_CLIENT1`

### For Client 2

1. Create another GitHub OAuth App
2. Set the **Homepage URL** to Client 2's domain (e.g., `https://client2.com`)
3. Set the **Authorization callback URL** to your Auth.js server's callback URL (e.g., `https://my-oauth-proxy.vercel.app/api/auth/callback/github`)
4. Note the Client ID and Client Secret
5. Add them to your environment variables as `GITHUB_CLIENT_ID_CLIENT2` and `GITHUB_CLIENT_SECRET_CLIENT2`

### For Portfolio

1. Create another GitHub OAuth App
2. Set the **Homepage URL** to your portfolio domain (e.g., `https://vishal.biyani.xyz`)
3. Set the **Authorization callback URL** to your Auth.js server's callback URL (e.g., `https://my-oauth-proxy.vercel.app/api/auth/callback/github`)
4. Note the Client ID and Client Secret
5. Add them to your environment variables as `GITHUB_CLIENT_ID_PORTFOLIO` and `GITHUB_CLIENT_SECRET_PORTFOLIO`

### Default Fallback

1. Create a final GitHub OAuth App to use as a fallback
2. Set the **Homepage URL** to your Auth.js server's URL (e.g., `https://my-oauth-proxy.vercel.app`)
3. Set the **Authorization callback URL** to your Auth.js server's callback URL (e.g., `https://my-oauth-proxy.vercel.app/api/auth/callback/github`)
4. Note the Client ID and Client Secret
5. Add them to your environment variables as `GITHUB_CLIENT_ID_DEFAULT` and `GITHUB_CLIENT_SECRET_DEFAULT`

## Environment Variables

Add the GitHub OAuth credentials to your environment variables:

```bash
# Default GitHub credentials (fallback)
GITHUB_CLIENT_ID_DEFAULT="default-github-client-id"
GITHUB_CLIENT_SECRET_DEFAULT="default-github-client-secret"

# Client 1 specific GitHub credentials
GITHUB_CLIENT_ID_CLIENT1="client1-github-client-id"
GITHUB_CLIENT_SECRET_CLIENT1="client1-github-client-secret"

# Client 2 specific GitHub credentials
GITHUB_CLIENT_ID_CLIENT2="client2-github-client-id"
GITHUB_CLIENT_SECRET_CLIENT2="client2-github-client-secret"

# Portfolio specific GitHub credentials
GITHUB_CLIENT_ID_PORTFOLIO="portfolio-github-client-id"
GITHUB_CLIENT_SECRET_PORTFOLIO="portfolio-github-client-secret"
```

## Testing GitHub OAuth

To test GitHub OAuth authentication:

1. Start your Auth.js server
2. Navigate to your login page
3. Click the "Sign in with GitHub" button
4. You should be redirected to GitHub's authorization page
5. After authorizing, you should be redirected back to your application

## Troubleshooting

### Invalid Redirect URI

If you see an error about an invalid redirect URI, make sure the Authorization callback URL in your GitHub OAuth App settings exactly matches the callback URL used by Auth.js.

### Authorization Error

If you see an authorization error, check that your Client ID and Client Secret are correctly set in your environment variables.

### Cross-Origin Issues

If you're experiencing cross-origin issues, make sure your Auth.js server is properly configured for CORS and that cookies are set with `sameSite: 'none'` and `secure: true`.

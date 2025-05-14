---
sidebar_position: 5
---

# Vercel Deployment

This guide explains how to deploy the Auth.js Multi-Client system to Vercel.

## Prerequisites

Before deploying to Vercel, make sure you have:

1. A [Vercel account](https://vercel.com/signup)
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. OAuth credentials for all providers you want to use

## Deployment Steps

### 1. Import Your Repository

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Import your Git repository
4. Select the repository containing your Auth.js Multi-Client system

### 2. Configure Project Settings

1. Keep the default framework preset (Next.js)
2. Set the root directory if your project is not in the repository root
3. Set the build command if you need to customize it (usually not necessary)
4. Click "Deploy"

### 3. Set Environment Variables

After the initial deployment, you need to set up your environment variables:

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" tab
3. Add the following environment variables:

```
AUTH_SECRET=your_auth_secret_here
NEXTAUTH_URL=https://your-vercel-deployment-url.vercel.app

# Google OAuth credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth credentials
GITHUB_CLIENT_ID_DEFAULT=default_github_client_id
GITHUB_CLIENT_SECRET_DEFAULT=default_github_client_secret
GITHUB_CLIENT_ID_CLIENT1=client1_github_client_id
GITHUB_CLIENT_SECRET_CLIENT1=client1_github_client_secret
GITHUB_CLIENT_ID_CLIENT2=client2_github_client_id
GITHUB_CLIENT_SECRET_CLIENT2=client2_github_client_secret
GITHUB_CLIENT_ID_PORTFOLIO=portfolio_github_client_id
GITHUB_CLIENT_SECRET_PORTFOLIO=portfolio_github_client_secret

# Facebook OAuth credentials
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

# LinkedIn OAuth credentials
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Auth0 credentials
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_ISSUER=https://your-auth0-domain.auth0.com

# Debug configuration
AUTHORIZED_DEBUG_EMAILS=your-email@example.com,another-email@example.com
```

4. Click "Save"
5. Trigger a new deployment for the changes to take effect

### 4. Configure vercel.json

Create a `vercel.json` file in your project root to configure CORS and other Vercel-specific settings:

```json
{
  "env": {
    "NEXTAUTH_URL": "https://your-vercel-deployment-url.vercel.app"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Credentials",
          "value": "true"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Client-Origin"
        }
      ]
    }
  ]
}
```

### 5. Update OAuth Provider Settings

Make sure to update the redirect URIs in your OAuth provider settings to use your Vercel deployment URL:

- Google: `https://your-vercel-deployment-url.vercel.app/api/auth/callback/google`
- GitHub: `https://your-vercel-deployment-url.vercel.app/api/auth/callback/github`
- Facebook: `https://your-vercel-deployment-url.vercel.app/api/auth/callback/facebook`
- LinkedIn: `https://your-vercel-deployment-url.vercel.app/api/auth/callback/linkedin`
- Auth0: `https://your-vercel-deployment-url.vercel.app/api/auth/callback/auth0`

## Testing Your Deployment

After deploying, test your authentication flow:

1. Navigate to your Vercel deployment URL
2. Go to the auth test page: `https://your-vercel-deployment-url.vercel.app/auth-test`
3. Try signing in with different providers
4. Check that you can access protected routes after signing in

## Troubleshooting

### CORS Issues

If you're experiencing CORS issues, check:

1. Your `vercel.json` file has the correct CORS headers
2. Your client application is making requests with the correct credentials mode
3. Your Auth.js cookies are configured with `sameSite: 'none'` and `secure: true`

### Redirect Issues

If you're experiencing redirect issues:

1. Make sure `NEXTAUTH_URL` is set correctly in your environment variables
2. Check that your OAuth provider redirect URIs are correctly configured
3. Verify that your client is sending the correct `callbackUrl` parameter

### Environment Variable Issues

If your environment variables don't seem to be working:

1. Check that they're set correctly in the Vercel dashboard
2. Make sure you've redeployed after setting them
3. Check the Vercel logs for any errors related to missing environment variables

# OAuth Provider for Google and GitHub

A customized OAuth provider built with Next.js and Auth.js v5 that supports Google and GitHub authentication. This server can be deployed on Vercel and used for authentication in GitHub Pages or other static sites.

## Features

- Google OAuth authentication
- GitHub OAuth authentication
- Cross-origin authentication support
- JWT-based session management
- Protected routes
- User profile access
- Comprehensive CORS handling
- Development proxy for local testing

## Prerequisites

- Node.js 18.x or later
- A Google OAuth client ID and secret
- A GitHub OAuth client ID and secret

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd my-auth-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
# Auth.js Secret - generate a random string (e.g., openssl rand -base64 32)
AUTH_SECRET=your_auth_secret_here

# Google OAuth credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth credentials
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# URLs
NEXTAUTH_URL=http://localhost:4000
CLIENT_URL=http://localhost:3000
```

### Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add "http://localhost:4000" to the Authorized JavaScript origins
7. Add "http://localhost:4000/api/auth/callback/google" to the Authorized redirect URIs
8. Click "Create" and note your Client ID and Client Secret

### Setting up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: Your app name
   - Homepage URL: http://localhost:4000
   - Authorization callback URL: http://localhost:4000/api/auth/callback/github
4. Click "Register application"
5. Note your Client ID and generate a Client Secret

## Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the application.

## Deployment on Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and create a new project
3. Import your GitHub repository
4. Add the environment variables from your `.env.local` file
5. Deploy the application

## Client Integration

### Endpoints

For a client running on a different origin (e.g., localhost:3000 or GitHub Pages):

1. **Sign In Endpoints**:
   ```
   https://my-oauth-proxy.vercel.app/api/auth/signin/google
   https://my-oauth-proxy.vercel.app/api/auth/signin/github
   ```

2. **Session Endpoint** (to check if user is authenticated):
   ```
   https://my-oauth-proxy.vercel.app/api/auth/session
   ```

3. **Sign Out Endpoint**:
   ```
   https://my-oauth-proxy.vercel.app/api/auth/signout
   ```

### Example Integration

```javascript
// Example sign-in function for a React client
function handleSignIn(provider) {
  const callbackUrl = encodeURIComponent(window.location.origin);
  const signInUrl = `https://my-oauth-proxy.vercel.app/api/auth/signin/${provider}?callbackUrl=${callbackUrl}`;
  window.location.href = signInUrl;
}

// Example session check
async function checkSession() {
  try {
    const response = await fetch('https://my-oauth-proxy.vercel.app/api/auth/session', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const session = await response.json();
      return session;
    }

    return null;
  } catch (error) {
    console.error('Error checking session:', error);
    return null;
  }
}
```

## Project Structure

- `src/app/api/auth/` - Auth.js API routes
- `src/auth.ts` - Auth.js configuration
- `src/auth.config.ts` - Auth provider configuration
- `src/middleware.ts` - CORS and authentication middleware
- `src/lib/auth-client.ts` - Client-side authentication utilities
- `src/components/` - Reusable components
- `src/app/` - Next.js app router pages

## Local Development with Multiple Clients

When developing locally, the server uses a proxy to handle requests from clients on different origins:

1. OAuth server runs on `http://localhost:4000`
2. Client app runs on `http://localhost:3000`

The proxy middleware handles CORS and cookie issues during development.

## License

This project is licensed under a custom license. Usage requires permission from the author.

© 2023 Vishal Biyani. All rights reserved.

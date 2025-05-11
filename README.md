# OAuth Provider for Google and GitHub

This is an OAuth provider for Google and GitHub authentication built with Next.js and Auth.js (NextAuth). It can be used for authentication in GitHub Pages or any other static site.

## Features

- Google OAuth authentication
- GitHub OAuth authentication
- Protected routes
- User profile page
- JWT-based session management
- Responsive design

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
# Auth
AUTH_SECRET=your-secret-key-at-least-32-chars-long
AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add "http://localhost:3000" to the Authorized JavaScript origins
7. Add "http://localhost:3000/api/auth/callback/google" to the Authorized redirect URIs
8. Click "Create" and note your Client ID and Client Secret

### Setting up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: Your app name
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
4. Click "Register application"
5. Note your Client ID and generate a Client Secret

## Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment on Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and create a new project
3. Import your GitHub repository
4. Add the environment variables from your `.env.local` file
5. Deploy the application

## Using with GitHub Pages

To use this OAuth provider with GitHub Pages:

1. Deploy this application to Vercel
2. In your GitHub Pages site, redirect users to your Vercel deployment for authentication
3. After successful authentication, redirect back to your GitHub Pages site with the authenticated user information

## License

This project is licensed under the MIT License.

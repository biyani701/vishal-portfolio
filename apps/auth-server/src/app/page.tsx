import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
        OAuth Provider for Google, GitHub, Faacebook, X, Auth0
      </h1>

      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6', textAlign: 'left' }}>
        This is a simple OAuth provider that allows you to authenticate with Google, GitHub, Faacebook, X and Auth0.
        It can be used for authentication in GitHub Pages or any other static site.
      </p>

      <div style={{ marginBottom: '2rem' }}>
        {session?.user ? (
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'var(--secondary)',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Welcome, {session.user.name || 'User'}!</h2>
            <p>You are currently signed in.</p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              marginTop: '1.5rem'
            }}>
              <Link href="/profile" className="btn btn-primary">
                View Profile
              </Link>
              <Link href="/protected" className="btn btn-secondary">
                Protected Page
              </Link>
            </div>
          </div>
        ) : (
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'var(--secondary)',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Get Started</h2>
            <p style={{ marginBottom: '1.5rem' }}>Sign in to access protected content and view your profile.</p>

            <Link href="/login" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        )}
      </div>

      <div style={{
        padding: '1.5rem',
        backgroundColor: 'var(--secondary)',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>How to Use</h2>
        <ol style={{
          textAlign: 'left',
          paddingLeft: '1.5rem',
          lineHeight: '1.6'
        }}>
          <li>Sign in with your Google or GitHub account</li>
          <li>Access protected content</li>
          <li>View your profile information</li>
          <li>Sign out when you&apos;re done</li>
        </ol>
      </div>

      <div style={{
        padding: '1.5rem',
        backgroundColor: 'var(--secondary)',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Test Pages</h2>
        <ul style={{
          textAlign: 'left',
          paddingLeft: '1.5rem',
          lineHeight: '1.6'
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <Link href="/auth-test" style={{ fontWeight: 'bold' }}>
              Auth Test
            </Link>
            {' '}- Test authentication status and session information
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <Link href="/auth-flow-test" style={{ fontWeight: 'bold' }}>
              Auth Flow Test
            </Link>
            {' '}- Test the authentication flow with direct links
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <Link href="/auth-v5-test" style={{ fontWeight: 'bold' }}>
              Auth.js v5 Test
            </Link>
            {' '}- Test Auth.js v5 specific features
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <Link href="/mui-auth" style={{ fontWeight: 'bold' }}>
              MUI Toolpad Auth
            </Link>
            {' '}- Test MUI Toolpad Core authentication components
          </li>
        </ul>
      </div>
    </div>
  );
}

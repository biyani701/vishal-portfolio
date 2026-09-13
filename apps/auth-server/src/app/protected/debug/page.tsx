import { auth } from '@/auth';
import { redirect } from 'next/navigation';

// Helper function to check if a user is authorized for debug access
const isAuthorizedForDebug = (email?: string | null): boolean => {
  if (!email) return false;
  
  const authorizedEmails = process.env.AUTHORIZED_DEBUG_EMAILS?.split(',') || [];
  return authorizedEmails.includes(email);
};

// Function to get all environment variables (excluding sensitive values)
const getEnvironmentVariables = () => {
  const envVars: Record<string, string | undefined> = {
    // Auth configuration
    NODE_ENV: process.env.NODE_ENV,
    AUTH_URL: process.env.AUTH_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    
    // Redact secrets but show if they exist
    AUTH_SECRET: process.env.AUTH_SECRET ? '[REDACTED]' : undefined,
    
    // OAuth providers - show if configured
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '[CONFIGURED]' : undefined,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '[CONFIGURED]' : undefined,
    
    GITHUB_CLIENT_ID_DEFAULT: process.env.GITHUB_CLIENT_ID_DEFAULT ? '[CONFIGURED]' : undefined,
    GITHUB_CLIENT_SECRET_DEFAULT: process.env.GITHUB_CLIENT_SECRET_DEFAULT ? '[CONFIGURED]' : undefined,
    
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID ? '[CONFIGURED]' : undefined,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET ? '[CONFIGURED]' : undefined,
    
    LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID ? '[CONFIGURED]' : undefined,
    LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET ? '[CONFIGURED]' : undefined,
    
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID ? '[CONFIGURED]' : undefined,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET ? '[CONFIGURED]' : undefined,
    AUTH0_ISSUER: process.env.AUTH0_ISSUER,
    
    // Debug configuration
    AUTHORIZED_DEBUG_EMAILS: process.env.AUTHORIZED_DEBUG_EMAILS,
  };

  return envVars;
};

export default async function DebugPage() {
  const session = await auth();
  
  // Check if user is logged in
  if (!session?.user) {
    redirect('/login?callbackUrl=/protected/debug');
  }
  
  // Check if user is authorized for debug access
  if (!isAuthorizedForDebug(session.user.email)) {
    return (
      <div className="auth-container">
        <h1 className="auth-heading">Access Denied</h1>
        <p style={{ marginBottom: '1rem', textAlign: 'center', color: 'red' }}>
          You are not authorized to view this page. Only specific email addresses have access.
        </p>
        <div style={{ padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: '0.5rem' }}>
          <p>You are signed in as:</p>
          <pre style={{ 
            marginTop: '0.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--background)', 
            borderRadius: '0.25rem',
            overflow: 'auto'
          }}>
            {JSON.stringify({ email: session.user.email }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
  
  // Get environment variables
  const envVars = getEnvironmentVariables();
  
  return (
    <div className="auth-container">
      <h1 className="auth-heading">Debug Information</h1>
      <p style={{ marginBottom: '1rem', textAlign: 'center' }}>
        This page shows environment variables and configuration for debugging purposes.
      </p>
      
      <div style={{ padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Session Information</h2>
        <pre style={{ 
          padding: '1rem', 
          backgroundColor: 'var(--background)', 
          borderRadius: '0.25rem',
          overflow: 'auto'
        }}>
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
      
      <div style={{ padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: '0.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Environment Variables</h2>
        <pre style={{ 
          padding: '1rem', 
          backgroundColor: 'var(--background)', 
          borderRadius: '0.25rem',
          overflow: 'auto'
        }}>
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>
    </div>
  );
}

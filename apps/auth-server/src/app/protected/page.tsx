import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// Helper function to check if a user is authorized for debug access
const isAuthorizedForDebug = (email?: string | null): boolean => {
  if (!email) return false;

  const authorizedEmails = process.env.AUTHORIZED_DEBUG_EMAILS?.split(',') || [];
  return authorizedEmails.includes(email);
};

export default async function ProtectedPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/protected');
  }

  // Check if user is authorized for debug access
  const canAccessDebug = isAuthorizedForDebug(session.user.email);

  return (
    <div className="auth-container">
      <h1 className="auth-heading">Protected Page</h1>
      <p style={{ marginBottom: '1rem', textAlign: 'center' }}>
        This page is protected and only visible to authenticated users.
      </p>

      <div style={{ padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
        <p>You are signed in as:</p>
        <pre style={{
          marginTop: '0.5rem',
          padding: '1rem',
          backgroundColor: 'var(--background)',
          borderRadius: '0.25rem',
          overflow: 'auto'
        }}>
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      {canAccessDebug && (
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/protected/debug"
            className="btn btn-primary"
            style={{ display: 'inline-block', marginTop: '1rem' }}
          >
            View Debug Information
          </Link>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--foreground)', opacity: 0.7 }}>
            You have access to view environment variables and debug information.
          </p>
        </div>
      )}
    </div>
  );
}

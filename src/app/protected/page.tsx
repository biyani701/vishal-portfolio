import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/protected');
  }
  
  return (
    <div className="auth-container">
      <h1 className="auth-heading">Protected Page</h1>
      <p style={{ marginBottom: '1rem', textAlign: 'center' }}>
        This page is protected and only visible to authenticated users.
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
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}

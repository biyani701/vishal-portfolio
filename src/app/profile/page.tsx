import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/profile');
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        {session.user.image && (
          <Image 
            src={session.user.image} 
            alt={session.user.name || 'User'} 
            width={80} 
            height={80} 
            className="profile-avatar"
          />
        )}
        <div className="profile-info">
          <h1 className="profile-name">{session.user.name || 'User'}</h1>
          {session.user.email && (
            <p className="profile-email">{session.user.email}</p>
          )}
        </div>
      </div>
      
      <div style={{ padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: '0.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Account Details</h2>
        <p><strong>Provider:</strong> {session.user.provider || 'Unknown'}</p>
        <p><strong>User ID:</strong> {session.user.id}</p>
      </div>
    </div>
  );
}

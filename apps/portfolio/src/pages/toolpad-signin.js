import React from 'react';
import ToolpadSignInPage from '../components/auth/toolpad/ToolpadSignInPage';

/**
 * Toolpad SignIn Page
 * This page uses the ToolpadSignInPage component to provide a sign-in page
 * that connects to the my-auth-backend server
 */
const ToolpadSignInPageWrapper = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <ToolpadSignInPage />
    </div>
  );
};

export default ToolpadSignInPageWrapper;

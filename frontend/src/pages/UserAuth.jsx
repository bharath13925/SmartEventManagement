import React, { useEffect, useState } from 'react';
import UserLoginForm from '../components/UserLoginForm';
import UserSignupForm from '../components/UserSignupForm';
import { useSearchParams } from 'react-router-dom';
import '../pages/styles/UserAuth.css'; // Make sure CSS is imported

const UserAuth = () => {
  const [mode, setMode] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const queryMode = searchParams.get('mode');
    if (queryMode === 'login' || queryMode === 'signup') {
      setMode(queryMode);
    }
  }, [searchParams]);

  return (
    <div className="user-auth-wrapper">
      {!mode && (
        <>
          <h2>Welcome Back!</h2>
          <p>Please choose an option to continue. Whether you're already a user or just joining, we’re glad to have you!</p>
          <button onClick={() => setMode('login')}>Login as User</button>
          <button onClick={() => setMode('signup')}>Signup as User</button>
        </>
      )}
      {mode === 'login' && <UserLoginForm />}
      {mode === 'signup' && <UserSignupForm />}
    </div>
  );
};

export default UserAuth;

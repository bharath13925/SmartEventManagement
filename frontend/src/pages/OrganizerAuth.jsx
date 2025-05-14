import React, { useEffect, useState } from 'react';
import OrganizerLoginForm from '../components/OrganizerLoginForm';
import OrganizerSignupForm from '../components/OrganizerSignupForm';
import { useSearchParams } from 'react-router-dom';
import '../pages/styles/OrganizerAuth.css'; // Ensure your CSS file exists

const OrganizerAuth = () => {
  const [mode, setMode] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const queryMode = searchParams.get('mode');
    if (queryMode === 'login' || queryMode === 'signup') {
      setMode(queryMode);
    }
  }, [searchParams]);

  return (
    <div className="organizer-auth-wrapper">
      {!mode && (
        <>
          <h2>Welcome Organizer!</h2>
          <p>Manage your events effortlessly. Please login or signup to get started.</p>
          <button onClick={() => setMode('login')}>Login as Organizer</button>
          <button onClick={() => setMode('signup')}>Signup as Organizer</button>
        </>
      )}
      {mode === 'login' && <OrganizerLoginForm />}
      {mode === 'signup' && <OrganizerSignupForm />}
    </div>
  );
};

export default OrganizerAuth;

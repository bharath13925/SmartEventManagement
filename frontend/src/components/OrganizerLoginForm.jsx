import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import '../pages/styles/OrganizerLoginForm.css';
import { setOrganizerData } from '../utils/auth';

const OrganizerLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get organizer data from our backend
      const response = await fetch('http://localhost:5000/api/organizers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid })
      });
      
      if (!response.ok) {
        throw new Error('Login failed. Please try again.');
      }
      
      const organizerData = await response.json();
      
      // Save organizer data in localStorage
      setOrganizerData(organizerData);
      
      navigate('/organizer-dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Get or create organizer in our backend
      const response = await fetch('http://localhost:5000/api/organizers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          uid: user.uid,
          username: user.displayName,
          email: user.email
        })
      });
      
      if (!response.ok) {
        // If organizer doesn't exist, try to create a new organizer
        if (response.status === 404) {
          const signupResponse = await fetch('http://localhost:5000/api/organizers/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.uid,
              username: user.displayName,
              email: user.email
            })
          });
          
          if (signupResponse.ok) {
            const organizerData = await signupResponse.json();
            setOrganizerData(organizerData);
            navigate('/organizer-dashboard');
            return;
          }
        }
        throw new Error('Google login failed. Please try again.');
      }
      
      const organizerData = await response.json();
      setOrganizerData(organizerData);
      navigate('/organizer-dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Organizer Login</h2>
      <p className="subheading">Access your Smart Event Management account</p>
      
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
      </form>
      
      <div className="separator">or</div>
      
      <button onClick={handleGoogleLogin} className="google-signin-btn">
        Log In with Google
      </button>
    </div>
  );
};

export default OrganizerLoginForm;
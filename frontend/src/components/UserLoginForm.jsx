import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import '../pages/styles/UserSignupForm.css';
import { setUserData } from '../utils/auth';

const UserLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from our backend
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid })
      });
      
      if (!response.ok) {
        throw new Error('Login failed. Please try again.');
      }
      
      const userData = await response.json();
      
      // Save user data in localStorage
      setUserData(userData);
      
      navigate('/user-dashboard');
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
      
      // Get or create user in our backend
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          uid: user.uid,
          username: user.displayName,
          email: user.email
        })
      });
      
      if (!response.ok) {
        // If user doesn't exist, try to create a new user
        if (response.status === 404) {
          const signupResponse = await fetch('http://localhost:5000/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.uid,
              username: user.displayName,
              email: user.email
            })
          });
          
          if (signupResponse.ok) {
            const userData = await signupResponse.json();
            setUserData(userData);
            navigate('/user-dashboard');
            return;
          }
        }
        throw new Error('Google login failed. Please try again.');
      }
      
      const userData = await response.json();
      setUserData(userData);
      navigate('/user-dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Welcome Back!</h2>
      <p className="subheading">Log in to your Smart Event Management account</p>
      
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      
      <div className="separator">or</div>
      
      <button onClick={handleGoogleLogin} className="google-signin-btn">
        Sign in with Google
      </button>
    </div>
  );
};

export default UserLoginForm;
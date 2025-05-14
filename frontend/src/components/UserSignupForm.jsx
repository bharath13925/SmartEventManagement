import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth } from '../firebase';
import '../pages/styles/UserSignupForm.css';
import { setUserData } from '../utils/auth';

const UserSignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    rePassword: '',
    location: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { username, email, password, rePassword, location, phoneNumber } = formData;

    if (password !== rePassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setError('This email is already registered. Try logging in instead.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });

      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          username,
          email,
          location,
          phoneNumber
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user data');
      }

      const userData = await response.json();
      setUserData(userData);
      alert('User signup successful! Redirecting to login...');
      navigate('/user?mode=login');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Try logging in.');
      } else {
        setError(err.message);
      }
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await fetch('http://localhost:5000/api/users/google-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          username: user.displayName,
          email: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user data');
      }

      const userData = await response.json();
      setUserData(userData);
      alert('Google sign-up successful! Redirecting...');
      navigate('/user-dashboard');
    } catch (err) {
      console.error('Google signup error:', err);
      alert('Google signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-form-container">
      <form onSubmit={handleSubmit}>
        <h2>User Signup</h2>
        {error && <p className="error">{error}</p>}
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="password" name="rePassword" placeholder="Re-enter Password" value={formData.rePassword} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
        <button type="submit">Sign Up</button>
        <p>Or</p>
        <button type="button" onClick={handleGoogleSignup}>Sign up with Google</button>
      </form>
    </div>
  );
};

export default UserSignupForm;

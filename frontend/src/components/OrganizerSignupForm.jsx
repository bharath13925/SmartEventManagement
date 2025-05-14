import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import '../pages/styles/OrganizerSignupForm.css';
import { setOrganizerData } from '../utils/auth';

const OrganizerSignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    rePassword: '',
    organizationName: '',
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

    const { username, email, password, rePassword, organizationName, phoneNumber } = formData;

    if (password !== rePassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });

      // Save organizer to MongoDB
      const response = await fetch('http://localhost:5000/api/organizers/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          username:username,
          email:email,
          organizationName:organizationName,
          phoneNumber:phoneNumber
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save organizer data');
      }
      
      alert('Organizer signup successful! Redirecting to login...');
      navigate('/organizer?mode=login');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Save Google user to MongoDB
      const response = await fetch('http://localhost:5000/api/organizers/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          username: user.displayName,
          email: user.email,
          // No organization name or phone for Google signup initially
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save organizer data');
      }

      const organizerData = await response.json();
      
      // Save organizer data in localStorage
      setOrganizerData(organizerData);
      
      alert('Google signup successful! Redirecting...');
      navigate('/organizer-dashboard');
    } catch (err) {
      console.error('Google signup error:', err);
      alert('Google signup failed. Try again.');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Become an Organizer</h2>
      <p className="subheading">Create your Smart Event Management account</p>

      <h3>Organizer Signup</h3>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Enter valid username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="rePassword"
          placeholder="Re-enter password"
          value={formData.rePassword}
          onChange={handleChange}
          required
        />
        
        {/* New fields for organization and phone */}
        <input
          type="text"
          name="organizationName"
          placeholder="Organization Name (optional)"
          value={formData.organizationName}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone number (optional)"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        
        <button type="submit">Sign Up</button>
      </form>

      <div className="separator">or</div>

      <button onClick={handleGoogleSignup} className="google-signin-btn">
        Sign Up with Google
      </button>
    </div>
  );
};

export default OrganizerSignupForm;
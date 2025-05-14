import React, { useEffect, useState } from 'react';
import UserSidebar from '../components/UserSidebar';
import '../pages/styles/Sidebar.css';
import '../pages/styles/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('User');
        let userData;

        if (storedUser) {
          userData = JSON.parse(storedUser);

          if (userData.uid) {
            try {
              const response = await fetch(`http://localhost:5000/api/users/${userData.uid}`);
              if (response.ok) {
                const freshData = await response.json();
                userData = freshData;
                localStorage.setItem('User', JSON.stringify(freshData));
              }
            } catch (err) {
              console.log('Could not refresh user data, using stored data');
            }
          }
        } else {
          const uid = localStorage.getItem('uid');
          if (!uid) {
            throw new Error('Not authenticated');
          }

          const response = await fetch(`http://localhost:5000/api/users/${uid}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          userData = await response.json();
          localStorage.setItem('User', JSON.stringify(userData));
        }

        setUser(userData);
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
        <UserSidebar />
        <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
        <UserSidebar />
        <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Error: {error}. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
        <UserSidebar />
        <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>No user data found. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      <UserSidebar />
      <div style={{ flex: 1, padding: '40px' }}>
        <h2 style={{ color: '#4169e1', marginBottom: '20px' }}>👤 User Profile</h2>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

// pages/OrganizerProfile.jsx
import React, { useEffect, useState } from 'react';
import OrganizerSidebar from '../components/OrganizerSidebar'; // ✅ Fixed
import '../pages/styles/Sidebar.css';

const OrganizerProfile = () => {
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrganizerData = async () => {
      try {
        const storedOrganizer = localStorage.getItem('Organizer');
        let organizerData;
        
        if (storedOrganizer) {
          organizerData = JSON.parse(storedOrganizer);
          
          // If we have an organizer ID, try to get fresh data from the server
          if (organizerData.uid) {
            try {
              const response = await fetch(`http://localhost:5000/api/organizers/${organizerData.uid}`);
              if (response.ok) {
                const freshData = await response.json();
                organizerData = freshData;
                localStorage.setItem('Organizer', JSON.stringify(freshData));
              }
            } catch (err) {
              console.log('Could not refresh organizer data, using stored data');
            }
          }
        } else {
          const organizerId = localStorage.getItem('uid');
          if (!organizerId) {
            throw new Error('Not authenticated');
          }
          
          const response = await fetch(`http://localhost:5000/api/organizers/${organizerId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch organizer data');
          }
          
          organizerData = await response.json();
          localStorage.setItem('Organizer', JSON.stringify(organizerData));
        }
        
        setOrganizer(organizerData);
      } catch (err) {
        console.error('Error loading organizer profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerData();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', backgroundColor: '#fffaf0', minHeight: '100vh' }}>
      <OrganizerSidebar />
      <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Loading organizer profile...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', backgroundColor: '#fffaf0', minHeight: '100vh' }}>
      <OrganizerSidebar />
      <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Error: {error}. Please try logging in again.</p>
      </div>
    </div>
  );

  if (!organizer) return (
    <div style={{ display: 'flex', backgroundColor: '#fffaf0', minHeight: '100vh' }}>
      <OrganizerSidebar />
      <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>No organizer data found. Please try logging in again.</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', backgroundColor: '#fffaf0', minHeight: '100vh' }}>
      <OrganizerSidebar />
      <div style={{ flex: 1, padding: '40px' }}>
        <h2 style={{ color: '#d2691e' }}>🎤 Organizer Profile</h2>
        <p><strong>Username:</strong> {organizer.username || 'Not provided'}</p>
        <p><strong>Email:</strong> {organizer.email || 'Not provided'}</p>
        <p><strong>Organization Name:</strong> {organizer.organizationName || 'N/A'}</p>
        <p><strong>Phone Number:</strong> {organizer.phoneNumber || 'Not provided'}</p>
        {organizer.createdAt && (
          <p><strong>Member since:</strong> {new Date(organizer.createdAt).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

export default OrganizerProfile;

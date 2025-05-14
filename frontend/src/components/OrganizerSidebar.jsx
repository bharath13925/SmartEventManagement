// components/OrganizerSidebar.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import '../pages/styles/Sidebar.css';

const OrganizerSidebar = ({ username }) => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedOrganizer = JSON.parse(localStorage.getItem('organizer'));
    if (storedOrganizer?.email) {
      setEmail(storedOrganizer.email);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('organizer');
      navigate('/organizer-auth');
    }
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">🎤 Organizer Page</h2>
      <p className="sidebar-email"></p>
      <ul className="sidebar-menu">
        <li onClick={() => navigate('/organizer-dashboard')}>📊 Dashboard</li>
        <li onClick={() => navigate('/org-profile')}>🧾 Profile</li>
        <li onClick={toggleTheme}>
          {darkMode ? '☀️ Light Theme' : '🌙 Dark Theme'}
        </li>
        <li onClick={() => navigate('/event-management')}>🗓 Manage Events</li>
        <li onClick={handleLogout}>🚪 Logout</li>
      </ul>
    </div>
  );
};

export default OrganizerSidebar;

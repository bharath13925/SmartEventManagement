// components/UserSidebar.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import '../pages/styles/Sidebar.css';

const UserSidebar = ({ username }) => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.email) {
      setEmail(storedUser.email);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('user');
      navigate('/user-auth');
    }
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">👤User Page</h2>
      <p className="sidebar-email"></p>
      <ul className="sidebar-menu">
        <li onClick={() => navigate('/user-dashboard')}>🏠 Dashboard</li>
        <li onClick={() => navigate('/user-profile')}>🧾 Profile</li>
        <li onClick={toggleTheme}>
          {darkMode ? '☀️ Light Theme' : '🌙 Dark Theme'}
        </li>
        <li onClick={() => navigate('/settings')}>⚙️ Settings</li>
        <li onClick={() => navigate('/bookmarks')}>🔖 Bookmarks</li>
        <li onClick={handleLogout}>🚪 Logout</li>
      </ul>
    </div>
  );
};

export default UserSidebar;

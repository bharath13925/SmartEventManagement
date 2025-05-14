// src/pages/Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.clear();
      navigate('/user-auth');
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  return null;
};

export default Logout;

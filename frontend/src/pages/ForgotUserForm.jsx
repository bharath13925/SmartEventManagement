import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/AuthForm.css';

const ForgotUserForm = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleReset = async () => {
    if (newPassword !== confirm) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reset-password/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Password updated!');
        navigate('/user-auth');
      } else {
        alert(data.message || 'Failed to update password');
      }
    } catch (error) {
      alert('Server error. Try again later.');
    }
  };

  return (
    <div className="auth-form-container">
      <h3>Reset User Password</h3>
      <input
        type="email"
        placeholder="Enter registered email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
      />
      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
};

export default ForgotUserForm;

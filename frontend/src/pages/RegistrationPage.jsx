import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../pages/styles/registrationPage.css';
import { useNavigate } from 'react-router-dom';
const RegistrationPage = () => {
  const { id } = useParams(); // eventId from URL
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    phone: '',
    email: '',
    specialization: '',
  });

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    const res = await fetch(`http://localhost:5000/api/events/${id}`);
    const data = await res.json();
    setEvent(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = localStorage.getItem('uid');
    if (!uid) {
      alert('Please login to complete registration');
      return;
    }

    // Submit the registration form
    try {
      const res = await fetch('http://localhost:5000/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: uid, eventId: id }),
      });

      if (res.ok) {
        alert('Registration Successful!');
        // Optionally, navigate back to event details or another page
        navigate('/user-dashboard');
      } else {
        const errorData = await res.json();
        alert(`Registration failed: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error during registration:', err);
      alert('Registration error. Please try again.');
    }
  };

  if (!event) return <p>Loading event...</p>;

  return (
    <div className="registration-page">
      <h2>Register for {event.name}</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="college" placeholder="College" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="specialization" placeholder="Specialization" onChange={handleChange} required />
        <button type="submit">Submit Registration</button>
      </form>
    </div>
  );
};

export default RegistrationPage;

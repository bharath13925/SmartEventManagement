// CreateEvent.jsx
import '../pages/styles/CreateEvent.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CreateEvent = ({ fetchEvents }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: '',
    startTime: '',
    endTime: '',
    ticketPrice: '',
    date: '',
    organizerUid: ''
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUID = localStorage.getItem('uid');
    if (storedUID) {
      setFormData(prev => ({ ...prev, organizerUid: storedUID }));
    } else if (location.state && location.state.organizerUID) {
      setFormData(prev => ({ ...prev, organizerUid: location.state.organizerUID }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.organizerUid) {
      alert("Please enter a valid Organizer UID.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/organizers/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Event created successfully!');
        setFormData({
          name: '',
          description: '',
          venue: '',
          startTime: '',
          endTime: '',
          ticketPrice: '',
          date: '',
          organizerUid: formData.organizerUid
        });

        if (fetchEvents) await fetchEvents(); // safer with await
        navigate('/organizer-dashboard');
      } else {
        alert(result.message || 'Event creation failed.');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('An error occurred while creating the event.');
    }
  };

  return (
    <div className="create-event">
      <h2>Create Event</h2>
      
      {formData.organizerUid ? (
        <p>Organizer ID: {formData.organizerUid}</p>
      ) : (
        <p style={{ color: 'red' }}>No organizer ID found!</p>
      )}

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input name="name" type="text" required value={formData.name} onChange={handleChange} />

        <label>Description:</label>
        <input name="description" type="text" required value={formData.description} onChange={handleChange} />

        <label>Venue:</label>
        <input name="venue" type="text" required value={formData.venue} onChange={handleChange} />

        <label>Start Time:</label>
        <input name="startTime" type="time" required value={formData.startTime} onChange={handleChange} />

        <label>End Time:</label>
        <input name="endTime" type="time" required value={formData.endTime} onChange={handleChange} />

        <label>Date:</label>
        <input name="date" type="date" required value={formData.date} onChange={handleChange} />

        <label>Ticket Price:</label>
        <input name="ticketPrice" type="number" required value={formData.ticketPrice} onChange={handleChange} />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;

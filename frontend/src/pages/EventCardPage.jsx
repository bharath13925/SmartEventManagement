import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EventCard from '../pages/EventCard';

const EventCardPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        if (!response.ok) {
          throw new Error('Event not found');
        }
        const data = await response.json();
        console.log('Fetched event data:', data); // Debug log
        setEvent(data);
        
        // Check if user is registered for this event
        const uid = localStorage.getItem('uid');
        if (uid) {
          const regResponse = await fetch(`http://localhost:5000/api/registrations/${uid}`);
          if (regResponse.ok) {
            const registrations = await regResponse.json();
            setIsRegistered(registrations.some(reg => reg._id === id));
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <div className="loading">Loading event details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!event) return <div className="not-found">Event not found.</div>;

  return (
    <div className="event-card-page">
      <EventCard 
        event={event} 
        isRegistered={isRegistered} 
      />
    </div>
  );
};

export default EventCardPage;
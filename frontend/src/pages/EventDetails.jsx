import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../pages/styles/eventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        // Fetch event details
        const eventResponse = await fetch(`http://localhost:5000/api/events/${id}`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event details');
        }
        const eventData = await eventResponse.json();
        setEvent(eventData);
        
        // Fetch organizer details if available
        if (eventData.organizerUid) {
          const organizerResponse = await fetch(`http://localhost:5000/api/organizers/${eventData.organizerUid}`);
          if (organizerResponse.ok) {
            const organizerData = await organizerResponse.json();
            setOrganizer(organizerData);
          }
        }
        
        // Check if user is registered for this event
        const uid = localStorage.getItem('uid');
        if (uid) {
          const registrationsResponse = await fetch(`http://localhost:5000/api/registrations/${uid}`);
          if (registrationsResponse.ok) {
            const registrations = await registrationsResponse.json();
            
            // Improved registration check logic
            const isUserRegistered = registrations.some(reg => {
              // Check if registration contains the event ID directly
              if (reg._id === id || reg.eventId === id) {
                return true;
              }
              
              // If registration contains a complete event object, check its ID
              if (reg.event && (reg.event._id === id)) {
                return true;
              }
              
              return false;
            });
            
            setIsRegistered(isUserRegistered);
            console.log(`User registration status for event ${id}:`, isUserRegistered);
          }
        }
        
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleRegister = () => {
    const uid = localStorage.getItem('uid');
    if (!uid) {
      alert('Please log in to register for this event');
      navigate('/user-auth');
      return;
    }
    
    navigate(`/register/${id}`);
  };

  if (loading) return <div className="loading">Loading event details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!event) return <div className="not-found">Event not found</div>;

  const formattedDate = event.date ? new Date(event.date).toLocaleDateString() : 'Date not available';

  return (
    <div className="event-details-container">
      <div className="event-details-card">
        <h1 className="event-title">{event.name}</h1>
        
        <div className="event-info">
          <div className="event-info-item">
            <span className="info-label">Date:</span>
            <span className="info-value">{formattedDate}</span>
          </div>
          
          <div className="event-info-item">
            <span className="info-label">Time:</span>
            <span className="info-value">
              {event.startTime || 'Not specified'}
              {event.endTime ? ` - ${event.endTime}` : ''}
            </span>
          </div>
          
          <div className="event-info-item">
            <span className="info-label">Venue:</span>
            <span className="info-value">{event.venue || 'Venue not specified'}</span>
          </div>
          
          <div className="event-info-item">
            <span className="info-label">Ticket Price:</span>
            <span className="info-value">
              {typeof event.ticketPrice === 'number' ? `${event.ticketPrice.toFixed(2)}` : 'Free'}
            </span>
          </div>
          
          {organizer && (
            <div className="event-info-item">
              <span className="info-label">Organizer:</span>
              <span className="info-value">{organizer.organizationName || organizer.username}</span>
            </div>
          )}
        </div>
        
        {event.description && (
          <div className="event-description">
            <h3>About This Event</h3>
            <p>{event.description}</p>
          </div>
        )}
        
        <div className="event-actions">
          {isRegistered ? (
            <div className="registered-badge">
              You're registered for this event
            </div>
          ) : (
            <button className="register-button" onClick={handleRegister}>
              Register for this Event
            </button>
          )}
          
          <button className="back-button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
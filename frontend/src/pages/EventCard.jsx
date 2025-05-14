import React from 'react';
import '../pages/styles/EventCard.css'; // Assuming you have this CSS file

const EventCard = ({ event, isRegistered, onClick }) => {
  // Ensure that event is defined before attempting to access its properties
  if (!event) {
    return <div>Error: Event not found</div>;
  }

  // Format the date nicely, with fallback if `event.date` is not available
  const formattedDate = event.date && !isNaN(new Date(event.date)) 
  ? new Date(event.date).toLocaleDateString() 
  : 'Date not available';

  // Handle edge cases for missing or undefined event properties
  const eventTime = event.startTime || 'Not specified';
  const eventEndTime = event.endTime ? ` - ${event.endTime}` : '';
  const eventVenue = event.venue || 'Venue not specified';
  const eventTicketPrice = typeof event.ticketPrice === 'number' ? `$${event.ticketPrice}` : 'Free';
  const eventDescription = event.description ? (
    <p className="event-description"><strong>Description:</strong> {event.description}</p>
  ) : null;

  return (
    <div className="event-card" onClick={onClick}>
      <h3 className="event-name">{event.name || 'Event Name Unavailable'}</h3>
      
      <div className="event-details">
        <p className="event-date"><strong>Date:</strong> {formattedDate}</p>
        <p className="event-time">
          <strong>Time:</strong> {eventTime}{eventEndTime}
        </p>
        <p className="event-venue"><strong>Venue:</strong> {eventVenue}</p>
        <p className="event-price"><strong>Ticket Price:</strong> {eventTicketPrice}</p>
        {eventDescription}
      </div>
      
      {isRegistered && (
        <div className="registration-badge">Registered</div>
      )}
    </div>
  );
};

export default EventCard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../pages/EventCard';
import Sidebar from '../components/UserSidebar';
import './userDashboard.css';

const UserDashboard = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [organizerEvents, setOrganizerEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ username: '', location: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('User'));
    if (storedUser) setUser(storedUser);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    const uid = localStorage.getItem('uid');
    
    if (!uid) {
      setLoading(false);
      return; // Exit early if no user ID is found
    }
    
    try {
      // Fetch upcoming events for organizers first
      const eventsRes = await fetch('http://localhost:5000/api/events/upcoming');
      if (!eventsRes.ok) {
        throw new Error('Failed to fetch upcoming events');
      }
      
      const eventsData = await eventsRes.json();
      console.log('Fetched upcoming events:', eventsData);
      
      // Process events to include organizer information
      const processedEvents = [];
      for (const event of eventsData) {
        if (event.organizerUid) {
          try {
            const organizerRes = await fetch(`http://localhost:5000/api/organizers/${event.organizerUid}`);
            if (organizerRes.ok) {
              const organizer = await organizerRes.json();
              processedEvents.push({
                ...event,
                organizerName: organizer.organizationName || organizer.username
              });
            } else {
              processedEvents.push({
                ...event,
                organizerName: "Unknown Organizer"
              });
            }
          } catch (orgError) {
            console.error('Error fetching organizer:', orgError);
            processedEvents.push({
              ...event,
              organizerName: "Unknown Organizer"
            });
          }
        } else {
          processedEvents.push({
            ...event,
            organizerName: "Unknown Organizer"
          });
        }
      }
      
      // Store all upcoming events
      setOrganizerEvents(processedEvents);
      
      // Fetch the user's registered events
      const registeredRes = await fetch(`http://localhost:5000/api/registrations/${uid}`);
      if (!registeredRes.ok) {
        // If there's an error fetching registrations, we'll just show an empty list
        console.error('Failed to fetch registered events');
        setRegisteredEvents([]);
      } else {
        const registeredData = await registeredRes.json();
        console.log('Registered events data:', registeredData);
        
        // If there are registered events, fetch their full details
        if (registeredData && registeredData.length > 0) {
          const completeRegisteredEvents = await Promise.all(
            registeredData.map(async (regEvent) => {
              try {
                const eventId = regEvent.eventId || regEvent._id;
                const eventRes = await fetch(`http://localhost:5000/api/events/${eventId}`);
                if (eventRes.ok) {
                  return await eventRes.json();
                } else {
                  console.error('Event details fetch failed for ID:', eventId);
                  return regEvent; // Return what we have
                }
              } catch (err) {
                console.error('Error fetching event details:', err);
                return regEvent; // Return what we have
              }
            })
          );
          
          // Filter out any null or undefined values
          const validEvents = completeRegisteredEvents.filter(event => event);
          setRegisteredEvents(validEvents);
          console.log('Complete Registered Events:', validEvents);
          
          // Alert about upcoming registered events
          const today = new Date();
          const upcomingRegisteredEvents = validEvents.filter(event => {
            if (!event.date) return false;
            const eventDate = new Date(event.date);
            return !isNaN(eventDate) && eventDate >= today;
          });
          
          if (upcomingRegisteredEvents.length > 0) {
            const upcomingEventDates = upcomingRegisteredEvents.map(event => {
              const date = new Date(event.date);
              return isNaN(date) ? 'Unknown date' : date.toLocaleDateString();
            });
            
            alert(`You have upcoming events on: ${upcomingEventDates.join(', ')}`);
          }
        } else {
          setRegisteredEvents([]); // No events registered
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (eventId) => {
    const uid = localStorage.getItem('uid');
    if (!uid) {
      alert('Please log in to register for events');
      navigate('/user-auth');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid, eventId })
      });

      if (response.ok) {
        fetchEvents(); // Refresh data
        alert('Registration successful!');
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register. Try again.');
    }
  };

  const isRegistered = (eventId) => {
    return registeredEvents.some(event => {
      // Check both _id and eventId properties since the data structure might vary
      return (event._id === eventId) || (event.eventId === eventId);
    });
  };

  // Group organizer events by organizer name
  const organizerEventsByName = organizerEvents.reduce((acc, event) => {
    const organizerName = event.organizerName || "Unknown Organizer";
    if (!acc[organizerName]) {
      acc[organizerName] = [];
    }
    acc[organizerName].push(event);
    return acc;
  }, {});

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-sidebar">
        <Sidebar username={user.username} />
      </div>
      <div className="dashboard-content">
        <div className="user-dashboard">
          <div className="main-content">
            <section className="dashboard-section">
              <h2 className="section-title">🎟 My Registered Events</h2>
              {loading ? (
                <p>Loading events...</p>
              ) : registeredEvents.length > 0 ? (
                <div className="registered-events">
                  {registeredEvents.map(event => (
                    <EventCard
                      key={event._id || event.eventId}
                      event={event}
                      isRegistered={true}
                      onClick={() => navigate(`/event/${event._id || event.eventId}`)}
                    />
                  ))}
                </div>
              ) : (
                <p className="no-events">You haven't registered for any events yet.</p>
              )}
            </section>

            <section className="dashboard-section">
              <h2 className="section-title">🗓 Upcoming Events</h2>
              {loading ? (
                <p>Loading events...</p>
              ) : error ? (
                <p className="error-message">{error}</p>
              ) : Object.keys(organizerEventsByName).length > 0 ? (
                <div className="organizer-events-list">
                  {Object.entries(organizerEventsByName).map(([organizerName, events]) => (
                    <div key={organizerName} className="organizer-events-group">
                      <h3>{organizerName}</h3>
                      <div className="events-list">
                        {events.map(event => {
                          const isAlreadyRegistered = isRegistered(event._id);
                          return (
                            <div key={event._id} className="event-list-item">
                              <div 
                                className="event-name" 
                                onClick={() => navigate(`/event/${event._id}`)}
                              >
                                {event.name}
                              </div>
                              {!isAlreadyRegistered ? (
                                <button 
                                  className="register-button"
                                  onClick={() => handleRegister(event._id)}
                                >
                                  Register
                                </button>
                              ) : (
                                <span className="registered-badge">Registered</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-events">No upcoming events available.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
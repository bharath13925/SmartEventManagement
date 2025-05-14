import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/OrganizerSidebar';
import './organizerDashboard.css';
const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [organizer, setOrganizer] = useState({ username: 'Organizer' });
  const [registrationStats, setRegistrationStats] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    const uid = localStorage.getItem('uid');
    if (!uid) {
      setLoading(false);
      setError('User not authenticated. Please log in.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/organizers/${uid}/events`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    
    // Get organizer info if available
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setOrganizer(storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const uid = localStorage.getItem('uid');
      if (!uid) return;
  
      try {
        const res = await fetch(`http://localhost:5000/api/stats/${uid}/registration-stats`);
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setRegistrationStats(data);
      } catch (err) {
        console.error('Error fetching registration stats:', err);
      }
    };
  
    fetchStats();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        
        setEvents(events.filter((event) => event._id !== id));
      } catch (err) {
        console.error('Error deleting event:', err);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  const getEventStatusClass = (eventDate) => {
    const now = new Date();
    const eventDateTime = new Date(eventDate);
    
    if (eventDateTime < now) {
      return 'past';
    } else if (eventDateTime.setDate(eventDateTime.getDate() - 7) <= now) {
      return 'upcoming';
    }
    return '';
  };

  
  return (
    <div className="organizer-dashboard">
      <Sidebar username={organizer.username} />
      <div className="main-content">
        <div className="dashboard-header">
          <h2 className="title">📅 My Organized Events</h2>
          <button 
            className="create-button"
            onClick={() => {
              const organizerUID = localStorage.getItem('uid');
              navigate("/organizer/create", {
                state: { organizerUID }
              });
            }}
          >
            + Create New Event
          </button>
        </div>
        {registrationStats && (
          <div className="stats-container">
            <div className="stat-card">
              <h4>Today's Registrations</h4>
              <p>{registrationStats.today}</p>
            </div>
            <div className="stat-card">
              <h4>Last 3 Days</h4>
              <p>{registrationStats.last3Days}</p>
            </div>
            <div className="stat-card">
              <h4>Last 7 Days</h4>
              <p>{registrationStats.last7Days}</p>
            </div>
          </div>
        )}
        {loading ? (
          <div className="loading-container">
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
          </div>
        ) : (
          <div className="events-container">
            {events.length > 0 ? (
              <div className="card-wrapper">
                {events.map((event) => (
                  <div
                    className={`event-card ${getEventStatusClass(event.date)}`}
                    key={event._id}
                    onClick={() => navigate(`/event/${event._id}`)}
                  >
                    <div className="event-content">
                      <h3 className="event-title">{event.name}</h3>
                      <p className="event-description">{event.description}</p>
                      <div className="event-details">
                        <span className="event-venue">📍 {event.venue}</span>
                        <span className="event-date">🗓️ {new Date(event.date).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
                      })}</span>
                      </div>
                      {event.category && (
                        <span className="event-category">{event.category}</span>
                      )}
                    </div>
                    <div className="event-actions">
                      <button
                        className="edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/organizer/edit/${event._id}`);
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(event._id);
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-events">
                <p>You haven't created any events yet.</p>
                <p>Click the "Create New Event" button to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
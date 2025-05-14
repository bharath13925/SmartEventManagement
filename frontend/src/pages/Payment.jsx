import React from 'react';
import { useParams } from 'react-router-dom';
import events from '../data/events';

const PaymentPage = () => {
  const { id } = useParams();
  const event = events.find(e => e.id === id);

  return (
    <div style={{ padding: '40px', backgroundColor: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <h2 style={{ color: '#0a66c2' }}>💳 Welcome to the Payment Page</h2>
      {event ? (
        <>
          <h3 style={{ marginTop: '20px' }}>{event.title}</h3>
          <p>Registration Fee: ₹{event.fee}</p>
          <button
            style={{
              marginTop: '30px',
              padding: '12px 24px',
              backgroundColor: '#0a66c2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: '0.3s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#084a96'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#0a66c2'}
          >
            Pay Now
          </button>
        </>
      ) : (
        <p>Event not found</p>
      )}
    </div>
  );
};

export default PaymentPage;

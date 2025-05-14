import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import FAQ from '../components/FAQ'; 
import Contact from '../components/ContactForm';
import logo from '../assets/logo.png';
import carousel1 from '../assets/image1.png';
import carousel2 from '../assets/image2.png';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <div className="intro-section">
        <img src={logo} alt="logo" className="logo" />
        <h1>Welcome to Smart Event Booking & Entry Management</h1>
        <p>
          Easily book and manage your events. Organizers can track attendance and revenue in real-time.
        </p>
      </div>

      <div className="carousel-container">
        <div className="carousel-track">
          <img src={carousel1} alt="slide1" />
          <img src={carousel2} alt="slide2" />
        </div>
      </div>

      <div className="login-boxes">
        <div className="box" onClick={() => navigate('/user-auth')}>
          <h2>User Login</h2>
          <p>Book your event tickets and manage upcoming events.</p>
        </div>
        <div className="box" onClick={() => navigate('/organizer-auth')}>
          <h2>Organizer Login</h2>
          <p>Create events, track participation and check-ins.</p>
        </div>
      </div>

      <div id="features" className="features-section">
        <h2>Features</h2>
        <ul>
          <li>Secure event ticket booking</li>
          <li>Real-time attendance tracking</li>
          <li>QR-based entry management</li>
          <li>Detailed analytics for organizers</li>
        </ul>
      </div>

      <div id="blog" className="blog-section">
        <h2>Latest Blog</h2>
        <p><strong>5 Tips for Hosting a Successful Event</strong></p>
        <p>Discover the best practices and tools for seamless event planning and audience engagement.</p>
      </div>

      {/* FAQ Section */}
      <FAQ />
      <Contact/>
    </div>
  );
};

export default MainPage;

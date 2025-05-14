// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Global Styles
import './App.css';

// Shared Components
import Navbar from './components/NavBar';
import Footer from './components/Footer';

// Pages
import MainPage from './pages/MainPage';
import UserDashboard from './pages/UserDashboard';
import BookingPage from './pages/BookingPage';
import OrganizerDashboard from './pages/OrganizerDashboard';
import Payment from './pages/Payment';
import CreateEvent from './pages/CreateEvent';
import UserAuth from './pages/UserAuth';
import OrganizerAuth from './pages/OrganizerAuth';
import ForgotUserForm from './pages/ForgotUserForm';
import ForgotOrganizerForm from './pages/ForgotOrganizerForm';
import UserProfile from './pages/UserProfile';
import OrganizerProfile from './pages/OrganizerProfile';   // ✅ Added
import Bookmarks from './pages/Bookmarks';        // ✅ Added
import EventCard from './pages/EventCard';
import EventCardPage from './pages/EventCardPage'; 
import EventDetails from './pages/EventDetails';
import RegistrationPage from './pages/RegistrationPage';
// ✅ Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = '1011281112600-mt471j228thhsfj0vfhhuqg13i97t7og.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div className="App">
          {/* Navbar is always visible */}
          <Navbar />

          {/* Page routing */}
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/user-auth" element={<UserAuth />} />
            <Route path="/organizer-auth" element={<OrganizerAuth />} />
            <Route path="/user" element={<UserAuth />} />
            <Route path="/organizer" element={<OrganizerAuth />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
            <Route path="/booking/:eventId" element={<BookingPage />} />
            <Route path="/organizer/create" element={<CreateEvent />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/forgot-user" element={<ForgotUserForm />} />
            <Route path="/forgot-organizer" element={<ForgotOrganizerForm />} />
            <Route path="/event-card/:id" element={<EventCardPage />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/org-profile" element={<OrganizerProfile />} />
            <Route path="/bookmarks" element={<Bookmarks />} /> 
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/register/:id" element={<RegistrationPage />} />
          </Routes>

          {/* Footer is always visible */}
          <Footer />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

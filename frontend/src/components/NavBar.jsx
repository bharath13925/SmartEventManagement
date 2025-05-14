import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={logo} alt="logo" className="navbar-logo" />
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#blog">Blog</a></li>
        <li><a href="#faq">FAQs</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;

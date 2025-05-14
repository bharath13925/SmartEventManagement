// routes/users.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const router = express.Router();
const User = require('../models/User');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

const CLIENT_ID = process.env.GOOGLE_CONTACT_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CONTACT_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Retrieves all user documents
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/signup', async (req, res) => {
  const { uid, username, email, location, phoneNumber } = req.body;

  try {
    const newUser = new User({ uid, username, email, location, phoneNumber });
  await newUser.save();
  res.status(201).json({ message: 'User saved to MongoDB', user: newUser });
  } catch (err) {
    console.error('User MongoDB error:', err);
    res.status(500).json({ message: 'User could not be saved' });
  }
});
router.get('/:uid', async (req, res) => {
  const uid = req.params.uid;

  try {
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user by UID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// google signup
// Google signup route
router.post('/google-signup', async (req, res) => {
  const { uid, username, email } = req.body;

  try {
    // Check if a user with the same email already exists
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).json({
        message: 'User already exists with this email',
        user: existingUser,
      });
    }

    // If not exists, create new user
    const newUser = new User({
      uid,
      username,
      email,
      location: '',
      phoneNumber: '',
    });

    await newUser.save();
    res.status(201).json({
      message: 'Google user saved to MongoDB',
      user: newUser,
    });
  } catch (err) {
    console.error('Google signup error:', err);
    res.status(500).json({ message: 'Google user could not be saved' });
  }
});


router.post('/login', async (req, res) => {
  const { uid } = req.body;

  try {
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // Send back user data
  } catch (err) {
    console.error('Login fetch error:', err);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Get all events a user has registered for
router.get('/registrations/:userId', async (req, res) => {
  try {
    // Find all registrations for this user
    const registrations = await Registration.find({ userId: req.params.userId });
    
    // Get the event IDs
    const eventIds = registrations.map(reg => reg.eventId);
    
    // Fetch the events
    const events = await Event.find({ _id: { $in: eventIds } });
    
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Check if a user is registered for a specific event
router.get('/isRegistered', async (req, res) => {
  try {
    const registration = await Registration.findOne({
      userId: req.query.userId,
      eventId: req.query.eventId
    });
    
    res.json({ isRegistered: !!registration });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST endpoint for sending emails
// POST endpoint for sending emails
// Updated send-email route
router.post('/send-email', async (req, res) => {
  const { from, subject, text } = req.body;
  const to = process.env.EMAIL_USER ;

  try {
    // Create a transporter with application-specific password
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER ,
        pass: process.env.EMAIL_PASSWORD  // Using the correct password from your .env
      }
    });

    // Send email
    let info = await transporter.sendMail({
      from: from, // Use the sender's email provided in the form
      to: to,     // Always send to your fixed email address
      subject: `Contact Form: ${subject}`,
      text: `Message from: ${from}\n\n${text}`,
      replyTo: from // This ensures replies go back to the form submitter
    });
    
    console.log('Email sent successfully:', info);
    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});
module.exports = router;

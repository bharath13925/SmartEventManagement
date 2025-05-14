// routes/organizers.js
const express = require('express');
const router = express.Router();
const Organizer = require('../models/Organizer');
const Event = require('../models/Event'); // ✅ Make sure this exists (from the model provided earlier)
const User = require('../models/User');
// Get all organizers (optional: for admin)
router.get('/', async (req, res) => {
  try {
    const organizers = await Organizer.find();
    res.status(200).json(organizers);
  } catch (err) {
    console.error('Error fetching organizers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// get organizer by uid
router.get('/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const organizer = await Organizer.findOne({ uid });

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    res.status(200).json(organizer);
  } catch (error) {
    console.error('Error fetching organizer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// test file
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Organizer routes are working' });
});
// delete the organizer by the uid
router.delete('/delete/:uid', async (req, res) => {
  try {
    const { uid } = req.params; // Fetch UID from URL params
    const organizer = await Organizer.deleteOne({ uid });
    if (organizer.deletedCount === 0) {
      return res.status(404).send('Organizer not found');
    }
    res.status(200).send('Organizer deleted successfully');
  } catch (err) {
    res.status(500).send('Error deleting organizer');
  }
});
// Organizer signup
router.post('/signup', async (req, res) => {
  const { uid, username, email, organizationName, phoneNumber } = req.body;

  // Fallback for missing username (only for Google signup)
  const finalUsername = username || `user_${uid.slice(0, 6)}`;

  // Check if organizer already exists
  const existing = await Organizer.findOne({ uid });
  if (existing) {
    return res.status(409).json({ error: 'Organizer already exists' });
  }

  try {
    const newOrganizer = new Organizer({
      uid,
      username: finalUsername,
      email,
      organizationName,
      phoneNumber
    });

    const savedOrganizer = await newOrganizer.save();
    res.status(201).json(savedOrganizer);
  } catch (error) {
    console.error('Error saving organizer:', error);
    res.status(500).json({ error: 'Failed to save organizer data' });
  }
});
// organizer login
router.post('/login', async (req, res) => {
  const { uid, email } = req.body;  // Or you could check for email/password if needed

  if (!uid && !email) {
    return res.status(400).json({ message: 'UID or Email is required' });
  }

  try {
    // Find the organizer by UID or email
    const organizer = await Organizer.findOne({ uid }) || await User.findOne({ email });

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    // If found, return the organizer data
    res.status(200).json(organizer);
  } catch (error) {
    console.error('Error logging in organizer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Create an event tied to a specific organizer (by UID)
// routes/organizers.js - Fix event creation
router.post('/events', async (req, res) => {
  const { organizerUid, name, description, venue, startTime, endTime, date, ticketPrice } = req.body;

  if (!organizerUid) {
    return res.status(400).json({ message: 'Organizer UID required' });
  }

  try {
    // Convert date string to Date object if it's not already
    const eventDate = new Date(date);
    
    console.log('Creating event with date:', eventDate);
    
    const event = new Event({
      organizerUid,
      name,
      description,
      venue,
      startTime,
      endTime,
      date: eventDate,  // Make sure this is a Date object
      ticketPrice: Number(ticketPrice) || 0,
    });

    const savedEvent = await event.save();
    console.log('Event saved:', savedEvent);
    
    res.status(201).json({ message: 'Event created successfully', event: savedEvent });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Event creation failed', error: err.message });
  }
});

// Fetch all events for a specific organizer
// Assuming this is part of your express router setup for organizers

// Fetch all events for a specific organizer by UID
router.get('/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    // First, find the organizer by UID
    const organizer = await Organizer.findOne({ uid });

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    // Then find events where organizer matches the organizer's _id
    const events = await Event.find({ organizer: organizer._id });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events for organizer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:uid/events', async (req, res) => {
  try {
    const organizerId = req.params.uid; // Grab the UID from the request params

    // Find the organizer by their UID to verify if the organizer exists
    const organizer = await Organizer.findOne({ uid: organizerId });

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found.' });
    }

    // Find all events where the organizerUid matches the given UID
    const events = await Event.find({ organizerUid: organizerId });

    if (events.length === 0) {
      return res.status(404).json({ message: 'No events found for this organizer.' });
    }

    // Return the list of events as JSON
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events. Please try again later.' });
  }
});



module.exports = router;

const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Register a user for an event
router.post('/', async (req, res) => {
  try {
    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      userId: req.body.userId,
      eventId: req.body.eventId
    });
    
    if (existingRegistration) {
      return res.status(400).json({ message: 'User already registered for this event' });
    }
    
    // Check if event exists and has available space
    const event = await Event.findById(req.body.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Count current registrations for this event
    const registrationCount = await Registration.countDocuments({ eventId: req.body.eventId });
    
    if (event.capacity && registrationCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }
    
    // Create new registration
    const registration = new Registration({
      userId: req.body.userId,
      eventId: req.body.eventId,
      registrationDate: new Date()
    });
    
    const newRegistration = await registration.save();
    res.status(201).json(newRegistration);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Fetch registered events for the user
router.get('/:uid', async (req, res) => {
  try {
    // Fetching registrations by userId and populating the event details
    const registrations = await Registration.find({ userId: req.params.uid })
      .populate('eventId', 'name date location capacity _id')  // Populating event details (including _id)
      .exec();

    if (!registrations || registrations.length === 0) {
      return res.status(404).json({ message: 'No registered events found for this user' });
    }

    // Returning both the registration and event details
    res.json(
      registrations.map(registration => ({
        _id: registration._id,       // Return the registration _id
        userId: registration.userId, // Return the userId of the registration
        eventId: registration.eventId, // Return the populated event details (name, date, location, capacity, _id)
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Fetch upcoming events
router.get('/upcoming', async (req, res) => {
  try {
    const currentDate = new Date();
    const upcomingEvents = await Event.find({ date: { $gte: currentDate } })  // Fetch events with date >= current date
      .sort({ date: 1 })  // Sort by date in ascending order
      .exec();

    if (!upcomingEvents || upcomingEvents.length === 0) {
      return res.status(404).json({ message: 'No upcoming events found' });
    }

    res.json(upcomingEvents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel a registration
router.delete('/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    await Registration.findByIdAndDelete(req.params.id); // Use this instead of remove()
    res.json({ message: 'Registration cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

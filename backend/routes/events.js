const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const mongoose = require('mongoose');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get upcoming events
// Modified /upcoming route to work with string dates
router.get('/upcoming', async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    console.log('Fetching upcoming events, today is:', today);
    
    // Filter events where the date string is >= today's string
    const upcomingEvents = await Event.find({ 
      date: { $gte: today } 
    }).sort({ date: 1 });
    
    console.log('Upcoming events found:', upcomingEvents.length);
    
    res.json(upcomingEvents);
  } catch (err) {
    console.error('Error fetching upcoming events:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/:eventId', async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching event details' });
  }
});


// Create a new event
router.post('/', async (req, res) => {
  const event = new Event({
    organizerUid: req.body.organizerUid,
    name: req.body.name,
    description: req.body.description,
    venue: req.body.venue,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    date: new Date(req.body.date),
    ticketPrice: req.body.ticketPrice
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an event
router.patch('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Only allow the organizer to update their own events
    if (event.organizerUid !== req.body.organizerUid) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }
    
    // Update fields that are sent
    if (req.body.name) event.name = req.body.name;
    if (req.body.description) event.description = req.body.description;
    if (req.body.venue) event.venue = req.body.venue;
    if (req.body.startTime) event.startTime = req.body.startTime;
    if (req.body.endTime) event.endTime = req.body.endTime;
    if (req.body.date) event.date = new Date(req.body.date);
    if (req.body.ticketPrice !== undefined) event.ticketPrice = req.body.ticketPrice;
    
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Only allow the organizer to delete their own events
    if (event.organizerUid !== req.body.organizerUid) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }
    
    await event.remove();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
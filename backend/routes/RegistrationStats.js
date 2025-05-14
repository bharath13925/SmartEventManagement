// routes/registrationStats.js
const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const router = express.Router();

// Helper function to count registrations in a given time range
const countRegistrationsInRange = (registrations, startDate, endDate) => {
  return registrations.filter(reg => {
    const registrationDate = new Date(reg.registrationDate);
    return registrationDate >= startDate && registrationDate <= endDate;
  }).length;
};

// API Route to fetch registration stats for a specific organizer
router.get('/:uid/registration-stats', async (req, res) => {
  const { uid } = req.params;

  try {
    // Get today's date and define date ranges
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const threeDaysAgo = new Date(startOfToday);
    threeDaysAgo.setDate(startOfToday.getDate() - 3);
    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(startOfToday.getDate() - 7);

    // Find all events for the organizer
    const events = await Event.find({ organizerUid: uid });

    // Collect all registrations for those events
    const registrations = await Registration.find({ eventId: { $in: events.map(event => event._id) } });

    // Calculate registration stats
    const todayCount = countRegistrationsInRange(registrations, startOfToday, today);
    const last3DaysCount = countRegistrationsInRange(registrations, threeDaysAgo, today);
    const last7DaysCount = countRegistrationsInRange(registrations, sevenDaysAgo, today);

    // Return the stats
    res.json({
      today: todayCount,
      last3Days: last3DaysCount,
      last7Days: last7DaysCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching registration stats' });
  }
});

module.exports = router;

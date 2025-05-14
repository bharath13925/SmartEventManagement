// models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  organizerUid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  venue: String,
  startTime: String,
  endTime: String,
  date: {
    type: Date,  // Changed from String to Date
    required: true
  },
  ticketPrice: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);

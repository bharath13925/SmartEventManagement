// models/Registration.js
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  eventId: {
    type: String,
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure unique registration
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
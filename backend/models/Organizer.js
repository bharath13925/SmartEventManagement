const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  organizationName: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
});

const Organizer = mongoose.model('Organizer', organizerSchema);

module.exports = Organizer;

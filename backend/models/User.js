const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String },
  phoneNumber: { type: String }
});

module.exports = mongoose.model('User', userSchema);

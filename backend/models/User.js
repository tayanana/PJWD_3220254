const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  nextAppointmentDateTime: { type: Date, default: null } 
});

module.exports = mongoose.model('User', userSchema);

// models/bloodRequest.js
const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  patientName: String,
  bloodGroup: String,
  unitsRequired: Number,
  unitsFulfilled: { type: Number, default: 0 },
  contactNumber: String,
  requestDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);

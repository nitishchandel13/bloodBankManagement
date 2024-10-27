// models/bloodDonation.js
const mongoose = require('mongoose');

const bloodDonationSchema = new mongoose.Schema({
  donorName: String,
  bloodGroup: String,
  contactNumber: String,
  city: String,
  unitsDonated: Number,
  donationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BloodDonation', bloodDonationSchema);

const mongoose = require('mongoose');

const bloodStockSchema = new mongoose.Schema({
  bloodGroup: String,
  unitsAvailable: Number,
});

module.exports = mongoose.model('BloodStock', bloodStockSchema);

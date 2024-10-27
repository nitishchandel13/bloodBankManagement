const express = require('express');
const router = express.Router();
const BloodDonation = require('../models/bloodDonation');
const BloodStock = require('../models/bloodStock');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/authMiddleware');

// Route to render the form for adding a blood donor
router.get('/home', ensureAuthenticated, (req, res) => {
  res.render('home');
});

// Route to render the form for adding a blood donor
router.get('/donate', ensureAuthenticated, (req, res) => {
  res.render('donate');
});

// Route to handle form submission
router.post('/donate', ensureAuthenticated, async (req, res) => {
  try {
    const { donorName, bloodGroup, contactNumber, city, unitsDonated } = req.body;

    // Save donation
    const donation = new BloodDonation({ donorName, bloodGroup, contactNumber, city, unitsDonated });
    await donation.save();

    // Update stock
    let stock = await BloodStock.findOne({ bloodGroup });
    if (!stock) {
      stock = new BloodStock({ bloodGroup, unitsAvailable: 0 });
    }
    stock.unitsAvailable += parseInt(unitsDonated, 10);
    await stock.save();

    res.redirect('/donors');
  } catch (error) {
    res.status(500).send('Error saving donation and updating stock');
  }
});

// Route to list all blood donors
router.get('/donors', ensureAuthenticated, async (req, res) => {
  try {
    const donors = await BloodDonation.find();
    res.render('donors', { donors });
  } catch (error) {
    res.status(500).send('Error fetching donor list');
  }
});

// routes/bloodDonationRoutes.js
router.get('/donors/:id/edit', ensureAuthenticated, async (req, res) => {
  const donor = await BloodDonation.findById(req.params.id);
  res.render('editDonor', { donor });
});

router.post('/donors/:id/edit', ensureAuthenticated, async (req, res) => {
  const { donorName, bloodGroup, contactNumber, city, unitsDonated, oldUnitsDonated } = req.body;
  await BloodDonation.findByIdAndUpdate(req.params.id, { donorName, bloodGroup, contactNumber, city, unitsDonated });
  
  // Update stock
  let stock = await BloodStock.findOne({ bloodGroup });
  if (!stock) {
    stock = new BloodStock({ bloodGroup, unitsAvailable: 0 });
  }
  
  let newStocks = 0;
  if (oldUnitsDonated < unitsDonated) {
    newStocks = unitsDonated - oldUnitsDonated;
    stock.unitsAvailable += parseInt(newStocks, 10);
  } else if (oldUnitsDonated > unitsDonated) {
    newStocks = oldUnitsDonated - unitsDonated;
    stock.unitsAvailable -= parseInt(newStocks, 10);
  }
  
  await stock.save();
  res.redirect('/donors');
});

router.post('/donors/:id/delete', ensureAuthenticated, async (req, res) => {
  await BloodDonation.findByIdAndDelete(req.params.id);
  res.redirect('/donors');
});


module.exports = router;

const express = require('express');
const router = express.Router();
const BloodRequest = require('../models/bloodRequest');
const BloodStock = require('../models/bloodStock');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/authMiddleware');

router.get('/requests', ensureAuthenticated, async (req, res) => {
  try {
    const requests = await BloodRequest.find();
    res.render('requests', { requests, error: null });
  } catch (error) {
    // res.status(500).send('Error fetching requests');
    res.status(500).render('requests', { error: 'Error fetching requests.' });
  }
});

router.post('/requests', ensureAuthenticated, async (req, res) => {
  try {
    const { patientName, bloodGroup, unitsRequired, contactNumber } = req.body;
    const request = new BloodRequest({ patientName, bloodGroup, unitsRequired, contactNumber });
    await request.save();
    res.redirect('/requests');
  } catch (error) {
    // res.status(500).send('Error creating blood request');
    res.status(500).render('requests', { error: 'Error creating blood request' });
  }
});

// Approve request and adjust stock
router.post('/requests/:id/approve', ensureAuthenticated, ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    const stock = await BloodStock.findOne({ bloodGroup: request.bloodGroup });

    if (stock && stock.unitsAvailable >= request.unitsRequired) {
      request.status = 'Approved';
      request.unitsFulfilled = request.unitsRequired;
      stock.unitsAvailable -= request.unitsRequired;

      await request.save();
      await stock.save();
    } else {
      req.flash('error', 'Insufficient stock for this blood group.');
    }
    res.redirect('/requests');
  } catch (error) {
    // res.status(500).send('Error processing approval');
    res.status(500).render('requests', { error: 'Error processing approval' });
  }
});

// Reject request
router.post('/requests/:id/reject', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    request.status = 'Rejected';
    await request.save();
    res.redirect('/requests');
  } catch (error) {
    // res.status(500).send('Error processing rejection');
    res.status(500).render('requests', { error: 'Error processing rejection' });
  }
});


module.exports = router;

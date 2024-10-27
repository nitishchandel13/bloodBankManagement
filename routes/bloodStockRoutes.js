const express = require('express');
const router = express.Router();
const BloodStock = require('../models/bloodStock');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/authMiddleware');

router.get('/stock', ensureAuthenticated, async (req, res) => {
  try {
    const stocks = await BloodStock.find();
    res.render('stock', { stocks });
  } catch (error) {
    res.status(500).send('Error fetching blood stock');
  }
});

router.post('/stock', ensureAuthenticated, async (req, res) => {
  try {
    const { bloodGroup, unitsAvailable } = req.body;
    const stock = new BloodStock({ bloodGroup, unitsAvailable });
    await stock.save();
    res.redirect('/stock');
  } catch (error) {
    res.status(500).send('Error updating blood stock');
  }
});

module.exports = router;

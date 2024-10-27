// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Assume a User model is already set up
const bcrypt = require('bcrypt');

// GET forgot password page
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { error: null });
});

// POST forgot password form submission
router.post('/forgot-password', async (req, res) => {
    const { username, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).render('forgot-password', { error: 'Passwords do not match.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).render('forgot-password', { error: 'User not found.' });
        }

        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        // user.password = hashedPassword;
        user.password = newPassword;
        await user.save();

        res.redirect('/login'); // Redirect to login after successful reset
    } catch (error) {
        console.error(error);
        res.status(500).render('forgot-password', { error: 'Error resetting password.' });
    }
});

module.exports = router;

// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Render registration form
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const user = new User({ username, password, role });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.status(500).render('register', { error: 'Error registering user' });
    }
});

// Render login form
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Handle login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await user.isValidPassword(password)) {
        req.session.userId = user._id;
        req.session.role = user.role;
        res.redirect('/home');
    } else {
        res.status(401).render('login', { error: 'Invalid username or password' });
    }
});

// Handle logout

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;

// middleware/authMiddleware.js
function ensureAuthenticated(req, res, next) {
    if (req.session.userId) return next();
    res.redirect('/login');
}

function ensureAdmin(req, res, next) {
    if (req.session.role === 'Admin') return next();
    res.status(403).send('Access denied');
}

module.exports = { ensureAuthenticated, ensureAdmin };

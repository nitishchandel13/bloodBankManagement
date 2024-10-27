const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
// const path = require('path');
// const bcrypt = require('bcrypt'); // For password hashing
// const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Configure EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'BBMS',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/bloodBankDB' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));


app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bloodBankDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// Import and use routes
const bloodDonationRoutes = require('./routes/bloodDonationRoutes');
const bloodStockRoutes = require('./routes/bloodStockRoutes');
const requestRoutes = require('./routes/requestRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/', bloodDonationRoutes);
app.use('/', bloodStockRoutes);
app.use('/', requestRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/home`);
});

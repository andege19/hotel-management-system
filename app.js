const express = require('express');
const session = require('express-session');
const path = require('path');
const receptionistRoutes = require('./routes/receptionist');
const housekeepingRoutes = require('./routes/housekeeping');
const { authenticateUser } = require('./middleware/auth');

const app = express();

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'hotel_secret_key',
  resave: false,
  saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Authentication Routes
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

// Protected Routes for Receptionist and Housekeeping
app.use('/receptionist', authenticateUser(['receptionist']), receptionistRoutes);
app.use('/housekeeping', authenticateUser(['housekeeping']), housekeepingRoutes);

// Home Route
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user || null });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

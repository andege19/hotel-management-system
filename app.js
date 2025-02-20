// app.js - Main entry point
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const receptionistRoutes = require('./routes/receptionist');
const housekeepingRoutes = require('./routes/housekeeping');
const { authenticateUser } = require('./middleware/auth');

const app = express();

// Middleware
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
const users = [
    { username: 'receptionist', password: '1234', role: 'receptionist' },
    { username: 'housekeeping', password: '1234', role: 'housekeeping' }
];

const authRouter = express.Router();

authRouter.get('/login', (req, res) => {
    res.render('login', { error: null });
});

authRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        return res.redirect('/');
    }
    res.render('login', { error: 'Invalid credentials' });
});

authRouter.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.use('/auth', authRouter);

// Routes
app.use('/receptionist', authenticateUser(['receptionist']), receptionistRoutes);
app.use('/housekeeping', authenticateUser(['housekeeping']), housekeepingRoutes);

// Home Route
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user || null });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

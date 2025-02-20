// app.js - Main entry point
const express = require('express');
const session = require('express-session');
const path = require('path');
const receptionistRoutes = require('./routes/receptionist');
const housekeepingRoutes = require('./routes/housekeeping');
const authRoutes = require('./routes/auth');
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

// Authentication Middleware
const authenticateUser = (roles) => {
    return (req, res, next) => {
        if (!req.session.user || !roles.includes(req.session.user.role)) {
            return res.status(403).send('Access Denied');
        }
        next();
    };
};

// Authentication Routes
const users = [
    { username: 'receptionist', password: '1234', role: 'receptionist' },
    { username: 'housekeeping', password: '1234', role: 'housekeeping' }
];

const authRoutes = express.Router();

authRoutes.get('/login', (req, res) => {
    res.render('login');
});

authRoutes.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        return res.redirect('/');
    }
    res.status(401).send('Invalid credentials');
});

authRoutes.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.use('/auth', authRoutes);

// Routes
app.use('/receptionist', authenticateUser(['receptionist']), receptionistRoutes);
app.use('/housekeeping', authenticateUser(['housekeeping']), housekeepingRoutes);

// Home Route
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user || null });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

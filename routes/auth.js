const express = require('express');
const fs = require('fs');
const path = require('path');
const authRouter = express.Router();

const usersFile = path.join(__dirname, '../data/users.json');

const defaultUsers = [
  { username: "receptionist", password: "1234", role: "receptionist" },
  { username: "housekeeping", password: "1234", role: "housekeeping" }
];

const loadUsers = () => {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify(defaultUsers, null, 2), 'utf8');
    return defaultUsers;
  }
  const data = fs.readFileSync(usersFile, 'utf8');
  // Check if the file is empty or only contains whitespace
  if (!data.trim()) {
    fs.writeFileSync(usersFile, JSON.stringify(defaultUsers, null, 2), 'utf8');
    return defaultUsers;
  }
  try {
    return JSON.parse(data);
  } catch (error) {
    // If JSON parsing fails, reinitialize with defaultUsers
    fs.writeFileSync(usersFile, JSON.stringify(defaultUsers, null, 2), 'utf8');
    return defaultUsers;
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
};

// GET /login
authRouter.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST /login
authRouter.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password && u.role === role);
  if (user) {
    req.session.user = user;
    if (user.role === 'receptionist') {
      return res.redirect('/receptionist');
    } else if (user.role === 'housekeeping') {
      return res.redirect('/housekeeping');
    }
  }
  res.render('login', { error: 'Invalid credentials' });
});

// logout
authRouter.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// signup
authRouter.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

// signup
authRouter.post('/signup', (req, res) => {
  const { username, password, role } = req.body;
  let users = loadUsers();
  if (users.find(u => u.username === username)) {
    return res.render('signup', { error: 'User already exists' });
  }
  const newUser = { username, password, role };
  users.push(newUser);
  saveUsers(users);
  req.session.user = newUser;
  if (newUser.role === 'receptionist') {
    return res.redirect('/receptionist');
  } else if (newUser.role === 'housekeeping') {
    return res.redirect('/housekeeping');
  }
});

module.exports = authRouter;

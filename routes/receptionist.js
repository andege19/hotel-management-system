const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const roomsFile = path.join(__dirname, '../data/rooms.json');

const loadRooms = () => {
  if (!fs.existsSync(roomsFile)) return [];
  return JSON.parse(fs.readFileSync(roomsFile, 'utf8'));
};

const saveRooms = (rooms) => {
  fs.writeFileSync(roomsFile, JSON.stringify(rooms, null, 2), 'utf8');
};

// Receptionist Dashboard
router.get('/', (req, res) => {
  const rooms = loadRooms();
  res.render('receptionist/dashboard', { user: req.session.user, rooms });
});

// Check-in Guest
router.post('/check-in', (req, res) => {
  const { guestName, roomNumber } = req.body;
  let rooms = loadRooms();
  const room = rooms.find(r => r.number === roomNumber);
  if (room && room.status === 'available') {
    room.status = 'occupied';
    room.guest = guestName;
    saveRooms(rooms);
    return res.redirect('/receptionist');
  }
  res.status(400).send('Room is not available.');
});

// Check-out Guest (new feature)
router.post('/check-out', (req, res) => {
  const { roomNumber } = req.body;
  let rooms = loadRooms();
  const room = rooms.find(r => r.number === roomNumber);
  if (room && room.status === 'occupied') {
    room.status = 'available';
    room.guest = null;
    room.needsCleaning = false;
    saveRooms(rooms);
    return res.redirect('/receptionist');
  }
  res.status(400).send('Room is not currently occupied.');
});

// Add Cleaning Request
router.post('/add-cleaning', (req, res) => {
    const { roomNumber } = req.body;
    let rooms = loadRooms();
    const room = rooms.find(r => r.number === roomNumber);
    if (room) {
      if (!room.needsCleaning) {
        room.needsCleaning = true;
        saveRooms(rooms);
        return res.redirect('/receptionist');
      } else {
        return res.status(400).send('Cleaning request already added for this room.');
      }
    }
    res.status(400).send('Invalid room selection.');
  });
  

module.exports = router;

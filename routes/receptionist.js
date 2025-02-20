const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load room data
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

// Add Cleaning Request
router.post('/add-cleaning', (req, res) => {
    const { roomNumber } = req.body;
    let rooms = loadRooms();

    const room = rooms.find(r => r.number === roomNumber);
    if (room && room.status === 'occupied') {
        room.needsCleaning = true;
        saveRooms(rooms);
        return res.redirect('/receptionist');
    }
    res.status(400).send('Invalid request.');
});

module.exports = router;

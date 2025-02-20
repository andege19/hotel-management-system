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

// Housekeeping Dashboard
router.get('/', (req, res) => {
    const rooms = loadRooms();
    const cleaningTasks = rooms.filter(room => room.needsCleaning);
    res.render('housekeeping/dashboard', { user: req.session.user, cleaningTasks });
});

// Update Room Status
router.post('/update-room', (req, res) => {
    const { roomNumber } = req.body;
    let rooms = loadRooms();

    const room = rooms.find(r => r.number === roomNumber);
    if (room && room.needsCleaning) {
        room.needsCleaning = false;
        room.status = 'available';
        saveRooms(rooms);
        return res.redirect('/housekeeping');
    }
    res.status(400).send('Invalid room or already clean.');
});

module.exports = router;

const express = require('express');
const {
  createRoom,
  getRooms,
  getRoom,
  joinRoom,
  leaveRoom,
  getRoomMessages
} = require('../controllers/teahouseController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/rooms', auth, createRoom);
router.get('/rooms', auth, getRooms);
router.get('/rooms/:id', auth, getRoom);
router.post('/rooms/:id/join', auth, joinRoom);
router.post('/rooms/:id/leave', auth, leaveRoom);
router.get('/rooms/:id/messages', auth, getRoomMessages);

module.exports = router;

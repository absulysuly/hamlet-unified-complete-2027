const express = require('express');
const {
  register,
  login,
  verifyToken,
  refreshToken,
  getProfile
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyToken);
router.post('/refresh', refreshToken);
router.get('/profile', auth, getProfile);

module.exports = router;
Is there any program working in background that attracts my performance All right can you tell me how to hide this sidebar here
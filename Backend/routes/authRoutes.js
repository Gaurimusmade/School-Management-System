const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.get('/verify-session', authController.verifySession);
router.post('/logout', authController.logout);
router.post('/cleanup', authController.cleanup);

module.exports = router;

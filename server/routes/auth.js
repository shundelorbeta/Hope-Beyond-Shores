const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { validate } = require('../validators/schemas');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts, please try again later.' }
});

router.post('/login', loginLimiter, validate('login'), authController.login);
router.post('/logout', authController.logout);

module.exports = router;

const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media');
const { authenticate, authorize } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many uploads, please try again later.' }
});

router.post('/', authenticate, authorize(['owner']), uploadLimiter, mediaController.uploadMiddleware, mediaController.uploadImage);
router.delete('/', authenticate, authorize(['owner']), mediaController.deleteImage);

module.exports = router;

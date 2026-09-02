const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages');
const { authenticate, authorize } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: 'Too many messages sent, please try again later.' }
});

router.post('/', contactLimiter, messagesController.create);
router.get('/', authenticate, authorize(['owner']), messagesController.getAll);
router.put('/:id', authenticate, authorize(['owner']), messagesController.update);
router.delete('/:id', authenticate, authorize(['owner']), messagesController.remove);

module.exports = router;

const express = require('express');
const router = express.Router();
const landingController = require('../controllers/landing');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', landingController.getSettings);
router.put('/', authenticate, authorize(['owner']), landingController.updateSettings);

module.exports = router;

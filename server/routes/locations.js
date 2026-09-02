const express = require('express');
const router = express.Router();
const locationsController = require('../controllers/locations');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', locationsController.getAll);
router.post('/', authenticate, authorize(['owner']), locationsController.create);
router.delete('/:id', authenticate, authorize(['owner']), locationsController.remove);

module.exports = router;

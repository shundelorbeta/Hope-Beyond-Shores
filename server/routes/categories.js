const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', categoriesController.getAll);
router.post('/', authenticate, authorize(['owner']), categoriesController.create);
router.delete('/:id', authenticate, authorize(['owner']), categoriesController.remove);

module.exports = router;

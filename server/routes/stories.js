const express = require('express');
const router = express.Router();
const storiesController = require('../controllers/stories');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', storiesController.getAll);
router.get('/featured', storiesController.getFeatured);
router.get('/latest', storiesController.getLatest);
router.get('/:slug', storiesController.getBySlug);

router.post('/', authenticate, authorize(['owner']), storiesController.create);
router.put('/:id', authenticate, authorize(['owner']), storiesController.update);
router.delete('/:id', authenticate, authorize(['owner']), storiesController.remove);

module.exports = router;

const express = require('express');
const router = express.Router();
const storiesController = require('../controllers/stories');
const landingController = require('../controllers/landing');
const categoriesController = require('../controllers/categories');
const locationsController = require('../controllers/locations');

router.get('/stories', storiesController.getAll);
router.get('/stories/featured', storiesController.getFeatured);
router.get('/stories/latest', storiesController.getLatest);
router.get('/stories/:slug', storiesController.getBySlug);

router.get('/settings', landingController.getSettings);

router.get('/categories', categoriesController.getAll);
router.get('/locations', locationsController.getAll);

module.exports = router;

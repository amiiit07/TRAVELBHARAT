const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { auth } = require('../middleware/auth');

router.get('/', placeController.getAllPlaces);
router.get('/popular', placeController.getPopularPlaces);
router.get('/category/:category', placeController.getPlacesByCategory);
router.get('/:slug', placeController.getPlaceBySlug);
router.post('/', auth, placeController.createPlace);

module.exports = router;
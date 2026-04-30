const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const { auth } = require('../middleware/auth');

router.get('/', cityController.getAllCities);
router.get('/:slug', cityController.getCityBySlug);
router.post('/', auth, cityController.createCity);

module.exports = router;
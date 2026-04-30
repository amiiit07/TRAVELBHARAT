const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const { auth } = require('../middleware/auth');

router.get('/', cityController.getAllCities);
router.get('/:slug', cityController.getCityBySlug);
router.post('/', auth, cityController.createCity);
router.put('/:id', auth, cityController.updateCity);
router.delete('/:id', auth, cityController.deleteCity);

module.exports = router;
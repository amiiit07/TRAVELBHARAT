const express = require('express');
const router = express.Router();
const stateController = require('../controllers/stateController');
const { auth } = require('../middleware/auth');

router.get('/', stateController.getAllStates);
router.get('/:slug', stateController.getStateBySlug);
router.post('/', auth, stateController.createState);
router.put('/:id', auth, stateController.updateState);
router.delete('/:id', auth, stateController.deleteState);

module.exports = router;
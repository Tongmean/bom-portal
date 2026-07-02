const express = require('express');
const engineeringController = require('../Controller/engineeringController');

const router = express.Router();

router.get('/', engineeringController.getAllengineeringController);


module.exports = router;
const express = require('express');
const sdpackaingController = require('../Controller/sdPackagingcontroller.js');

const router = express.Router();

router.get('/', sdpackaingController.getAllsdpackagingController);


module.exports = router;
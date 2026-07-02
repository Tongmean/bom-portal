const express = require('express');
const Controller = require('../Controller/m_entityControler');

const router = express.Router();

router.get('/', Controller.getAllentityController);


module.exports = router;
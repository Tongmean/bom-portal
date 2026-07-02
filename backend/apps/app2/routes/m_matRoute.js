const express = require('express');
const Controller = require('../Controller/m_matController');

const router = express.Router();

router.get('/', Controller.getAllmatController);


module.exports = router;
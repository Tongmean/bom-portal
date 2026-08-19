const express = require('express');
const Controller = require('../Controller/layerBomdisplayController');
const flatController = require('../Controller/FlatBomdisplayController');

const router = express.Router();

router.get('/layerbom', Controller.layerDisplaycontroller);
router.post('/flatbom', flatController.flatDisplaycontroller);



module.exports = router;
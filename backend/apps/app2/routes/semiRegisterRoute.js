//getAllsemifgController
const express = require('express');
const Controller = require('../Controller/semiRegistercontroller');

const router = express.Router();

router.get('/', Controller.getAllsemifgController);
router.get('/:id', Controller.getSinglesemifgController);
router.post('/postinitail', Controller.getAllbom_detailbyidController);
router.post('/postArray', Controller.postArraysemifgController);
router.post('/putArray', Controller.updateArrayController);



module.exports = router;
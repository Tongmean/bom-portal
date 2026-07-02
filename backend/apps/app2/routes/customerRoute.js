const express = require('express');
const Controller = require('../Controller/customerControoler');

const router = express.Router();

router.get('/', Controller.getAllcustomerController);
router.post('/deleteArray', Controller.deleteArraycustomerController);
router.post('/postArray', Controller.postArraycustomerController);
router.post('/postbyid', Controller.getAllcustomerbyidController);
router.post('/updateArraybyid', Controller.updateArraycustomerController);


module.exports = router;
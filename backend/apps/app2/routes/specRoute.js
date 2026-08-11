//getAllsemifgController
const express = require('express');
const Controller = require('../Controller/specControler');

const router = express.Router();

router.get('/', Controller.getAllspecController);
router.get('/:id', Controller.getSinglespecController);
router.post('/postSingle', Controller.postSingleheaderController);
router.post('/putSingle', Controller.putSingleheaderController);



module.exports = router;
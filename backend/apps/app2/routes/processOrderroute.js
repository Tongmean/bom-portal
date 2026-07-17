const express = require('express');
const Controller = require('../controller/processOrderController');

const router = express.Router();

router.get('/', Controller.getAllprocess_order);
router.get('/:id', Controller.getSingleprocess_order);
router.post('/postSingle', Controller.postSingleprocessController);



module.exports = router;
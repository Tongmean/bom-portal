const express = require('express');
const toolingservice = require('../controller/processOrderControllerTooling')
const router = express.Router();



///
router.get('/', toolingservice.getAllprocess_ordertooling);
router.get('/:id', toolingservice.getSingleprocess_order_tooling);
router.post('/postSingle', toolingservice.postSingleprocess_order_tooling_Controller);
router.post('/putSingle', toolingservice.putSingleprocess_order_tooling_Controller);

module.exports = router;
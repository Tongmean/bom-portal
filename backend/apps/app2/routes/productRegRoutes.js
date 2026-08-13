const express = require('express');
const Controller = require('../Controller/productRegcontroller');

const router = express.Router();

router.get('/', Controller.getAllproductRegController);
router.get('/:id', Controller.getSingleproductRegController);
router.post('/postSingle', Controller.postSingleheaderController);
router.post('/putSingle', Controller.putSingleheaderController);




module.exports = router;
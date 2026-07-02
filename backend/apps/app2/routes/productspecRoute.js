const express = require('express');
const Controller = require('../Controller/productspecController');
const detailController = require('../controller/productspecDetailcontroller')
const router = express.Router();
//spec header
router.get('/', Controller.getAllproductspecController);
router.get('/:id', Controller.getSingleproductspecController);
// router.post('/deleteArray', Controller.deleteArraycustomerController);
router.post('/postSingle', Controller.postSingleproductspecController);
router.post('/putSingle', Controller.UpdateSingleproductspec);
// router.post('/postbyid', Controller.getAllcustomerbyidController);
// router.post('/updateArraybyid', Controller.updateArraycustomerController);

//spec detail
router.get('/detail/:id', detailController.getSingleproductspecDetailcontroller);

module.exports = router;
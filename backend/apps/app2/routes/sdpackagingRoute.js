const express = require('express');
const sdpackaingController = require('../Controller/sdPackagingcontroller.js');

const router = express.Router();

router.get('/', sdpackaingController.getAllsdpackagingController);
router.get('/:id', sdpackaingController.getSinglesdpackagingController);
router.post('/postSingle', sdpackaingController.postSingleheaderController);
router.post('/putSingle', sdpackaingController.UpdateSingleHeader);

router.get('/detail/:id', sdpackaingController.getSingleDetailsdpackagingbyheader_idController);


module.exports = router;
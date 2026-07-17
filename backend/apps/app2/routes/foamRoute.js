const express = require('express');
const Controller = require('../controller/foamController');
const detailController = require('../controller/foamController');

const router = express.Router();

router.get('/', Controller.getAllfoamController);
router.get('/:id', Controller.getSingleheaderController);
router.post('/postSingle', Controller.postSingleheaderController);
router.post('/putSingle', Controller.UpdateSingleheader);
//detail
router.get('/detail/:id', Controller.getSingledetailbyheader_idController);


module.exports = router;
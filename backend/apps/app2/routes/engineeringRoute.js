const express = require('express');
const engineeringController = require('../controller/engineeringController');
const detailController = require('../controller/engineeringDetailcontroller');
const router = express.Router();

router.get('/', engineeringController.getAllengineeringController);
router.get('/:id', engineeringController.getSingleengineeringController);
router.post('/postSingle', engineeringController.postSingleengineeringController);
router.post('/putSingle', engineeringController.UpdateSingleEngineering);

//detail
router.get('/detail/:id', detailController.getSingleengineeringDetailbyheader_idcontroller);
module.exports = router;
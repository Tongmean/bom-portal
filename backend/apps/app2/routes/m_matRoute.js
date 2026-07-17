const express = require('express');
const Controller = require('../Controller/m_matController');
const detailController = require('../Controller/m_matDetailcontroller');
const { uploadMatMiddleware } = require('../middleWare/matFilemiddleware');
const router = express.Router();
//mat
router.get('/', Controller.getAllmatController);
router.get('/:id', Controller.getSinglematController);
router.post('/postSingle', uploadMatMiddleware, Controller.postSingleheaderController);
router.post('/putSingle', uploadMatMiddleware, Controller.putSingleheaderController);
router.post('/deleteArray', uploadMatMiddleware, Controller.deleteSingleheaderController);
//detail

router.get('/mat/dimension/:id', detailController.getSingleDimensionController);
router.get('/mat/unit/:id', detailController.getSingleUnitController);
router.get('/mat/file/:id', detailController.getSingleFileController);
router.get('/mat/cat/:id', detailController.getSinglematCat);

module.exports = router;

// getSingleDimensionController,
// getSingleUnitController,
// getSingleFileController,
// getSinglematCat
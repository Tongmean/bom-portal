const express = require('express');
const Controller = require('../Controller/certificateController');
const { uploadCertificateMiddleware } = require('../middleWare/certificationFilemiddleware');
const router = express.Router();

router.get('/', Controller.getAllcertificateController);
router.get('/:id', Controller.getSinglecertificatebyidController);
router.post('/postSingle',uploadCertificateMiddleware, Controller.postSingleController);
router.post('/putSingle',uploadCertificateMiddleware, Controller.putSingleController);



module.exports = router;
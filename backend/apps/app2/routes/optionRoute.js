const express = require('express');
const Controller = require('../Controller/optionController');

const router = express.Router();

router.get('/m_channel', Controller.getAllm_channel);
router.get('/m_status', Controller.getAllm_status);
router.get('/m_statusCheck', Controller.getAllm_statusCheck);
router.get('/m_componentHeader', Controller.getAllm_componentHeader);
router.get('/m_documentStatus', Controller.getAllm_documentStatus);
router.get('/m_component', Controller.getOptioncomponentController);
router.get('/m_routingOrder', Controller.getOptionroutingOrderController);
router.get('/m_headerSpeccomponent', Controller.getOptionheaderSpeccomponentController);
router.get('/m_headerSpeccomponentOption', Controller.getOptionheaderSpeccomponentOptionController);
router.get('/productRegoption', Controller.getOptionproductRegController);

// getOptionheaderSpeccomponentController,
// getOptionheaderSpeccomponentOptionController
module.exports = router;
    // getAllm_channel,
    // getAllm_status,
    // getAllm_statusCheck,
    // getAllm_componentHeader,
    // getAllm_documentStatus
const express = require('express');
const Controller = require('../Controller/optionController');

const router = express.Router();

router.get('/m_channel', Controller.getAllm_channel);
router.get('/m_status', Controller.getAllm_status);
router.get('/m_statusCheck', Controller.getAllm_statusCheck);
router.get('/m_componentHeader', Controller.getAllm_componentHeader);
router.get('/m_documentStatus', Controller.getAllm_documentStatus);
router.get('/m_component', Controller.getOptioncomponentController);


module.exports = router;
    // getAllm_channel,
    // getAllm_status,
    // getAllm_statusCheck,
    // getAllm_componentHeader,
    // getAllm_documentStatus
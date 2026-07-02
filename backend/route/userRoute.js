const express = require('express');
// const controller = require('../Controller/Drawing_Request_Item_controller');
const userController = require('../auth/userController')

const router = express.Router();

router.post('/login', userController.login);

module.exports = router;
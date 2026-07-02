const express = require('express');
const router = express.Router();
const sdpackagingRoute = require('./routes/sdpackagingRoute')
const engineeringRoute = require('./routes/engineeringRoute')
const customerRoute = require('./routes/customerRoute')
const m_entityRoute = require('./routes/m_entityRoute')
const productspec = require('./routes/productspecRoute')
const option = require('./routes/optionRoute')
const m_mat = require('./routes/m_matRoute')
router.use('/sdpackaging', sdpackagingRoute);
router.use('/engineering', engineeringRoute);
router.use('/customer', customerRoute);
router.use('/m_entity', m_entityRoute);
router.use('/m_mat', m_mat);
router.use('/productspec', productspec);
router.use('/option', option);



module.exports = router;
const express = require('express');
const router = express.Router();
const sdpackagingRoute = require('./routes/sdpackagingRoute')
const engineeringRoute = require('./routes/engineeringRoute')
const customerRoute = require('./routes/customerRoute')
const m_entityRoute = require('./routes/m_entityRoute')
const productspec = require('./routes/productspecRoute')
const spec = require('./routes/specRoute')
const option = require('./routes/optionRoute')
const m_mat = require('./routes/m_matRoute')
const foam = require('./routes/foamRoute')
const certificateRoute = require('./routes/certificateRoute')   
const processRoute = require('./routes/processOrderroute')   
const processRoutetooling = require('./routes/processOrderroutTooling')   
const semifg = require('./routes/semiRegisterRoute')   
const productReg = require('./routes/productRegRoutes')   
const displayRoute = require('./routes/DisplayRoute')
router.use('/sdpackaging', sdpackagingRoute);
router.use('/engineering', engineeringRoute);
router.use('/customer', customerRoute);
router.use('/m_entity', m_entityRoute);
router.use('/m_mat', m_mat);
router.use('/productspec', productspec);
router.use('/spec', spec);
router.use('/option', option);
router.use('/foam', foam);
router.use('/certificate', certificateRoute);
router.use('/process_tooling', processRoutetooling);
router.use('/process', processRoute);
router.use('/semi-register', semifg);
router.use('/product-register', productReg);
router.use('/display', displayRoute);



module.exports = router;
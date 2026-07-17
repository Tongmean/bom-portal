// getAllproductspec

const dbconnect = require('../../../middleWare/Dbconnect');
// const Service = require('../service/productspecService')
const detailService = require('../service/engineeringDetailservice')
//mat
const getSingleengineeringDetailbyheader_idcontroller = async (req, res) => {
    const drawing_header_id = Number(req.params.id)
    // console.log("productspec_detail_id", productspec_detail_id)
    try {
        const result = await detailService.getSingledetailEngineeringbyheader_id(drawing_header_id)  
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: result
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        msg: 'มีปัญหาเกิดขึ้นระหว่างการดึงข้อมูล',
        error: error.message
        });
    }
};


module.exports = {
    getSingleengineeringDetailbyheader_idcontroller
};
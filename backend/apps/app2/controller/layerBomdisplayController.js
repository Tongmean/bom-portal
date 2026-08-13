const Service = require('../service/layerBomdisplayservice')

const dbconnect = require('../../../middleWare/Dbconnect');
//mat
const layerDisplaycontroller = async (req, res) => {
    // [
    //     production_code = '',

    // ]
    try {

        const resultLayer0 = await Service.getAlllayer0(req.query.production_code)     
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
    layerDisplaycontroller,

};


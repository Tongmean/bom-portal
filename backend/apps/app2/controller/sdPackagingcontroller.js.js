const sdpackagingService = require('../service/sdPackagingservice')

const dbconnect = require('../../../middleWare/Dbconnect');
//mat
const getAllsdpackagingController = async (req, res) => {
    try {
        const result = await sdpackagingService.getAllsdpackaging()        
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
    getAllsdpackagingController

};
const engineeringService = require('../service/engineeringService')

const dbconnect = require('../../../middleWare/Dbconnect');
//mat
const getAllengineeringController = async (req, res) => {
    try {
        const result = await engineeringService.getAllengineering()        
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
    getAllengineeringController

};
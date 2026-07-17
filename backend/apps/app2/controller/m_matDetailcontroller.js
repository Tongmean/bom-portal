// getSinglematCat,
// getSinglematDimension,
// getSinglematUnit,
// getSinglematfile

const Service = require('../service/m_matDetailservice')

const dbconnect = require('../../../middleWare/Dbconnect');
//mat
const getSinglematCat = async (req, res) => {
    try {
        const result = await Service.getSinglematCat(req.params.id)        
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
const getSingleDimensionController = async (req, res) => {
    try {
        const result = await Service.getSinglematDimension(req.params.id)        
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
const getSingleUnitController = async (req, res) => {
    try {
        const result = await Service.getSinglematUnit(req.params.id)        
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
const getSingleFileController = async (req, res) => {
    try {
        const result = await Service.getSinglematfile(req.params.id)        
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
    getSingleDimensionController,
    getSingleUnitController,
    getSingleFileController,
    getSinglematCat

};
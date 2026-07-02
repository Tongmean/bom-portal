
const dbconnect = require('../../../middleWare/Dbconnect');
const customerService = require('../service/customerService')
const { update_log, create_log } = require('../utility/update_log') 
//mat
const getAllcustomerController = async (req, res) => {
    try {
        const result = await customerService.getAllcustomer()        
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

// const getAllcustomerbyidController = async (req, res) => {
//     const payload = req.body.payload;
//     console.log("req.body", req.body)
//     // req.body = {
//     //     payload: [63,66]
//     // }
//     if (!Array.isArray(payload)) {
//         return res.status(400).json({
//             success: false,
//             msg: "payload must be an array of IDs"
//         });
//     }
//     try {
//         const result = []
//             const results = [];

//             for (let i = 0; i < payload.length; i++) {
//                 const id = payload[i];

//                 const result = await customerService.getAllcustomerbyid(id)

//                 if (result.rows.length > 0) {
//                     results.push(result.rows[0]);
//                 }
//             }     
//         res.status(200).json({
//             success: true,
//             msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
//             data: result
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//         success: false,
//         msg: 'มีปัญหาเกิดขึ้นระหว่างการดึงข้อมูล',
//         error: error.message
//         });
//     }
// };

const deleteArraycustomerController = async (req, res) => {
    const payload = req.body
    // payload =
    // [
    //     { customer_id: 12 },
    //     { customer_id: 15 },
    //     { customer_id: 20 }
    // ]
    console.log("req.body", req.body)
    try {
        const deletedIds = [];

        for (const item of payload) {
            const result = await customerService.deleteArraycustomer(
                item.customer_id
            );

            if (result) {
                deletedIds.push(result[0].customer_id);
            }
        }     
        res.status(200).json({
            success: true,
            msg: `Delete record successful: ${deletedIds.length} record & ID: ${deletedIds.join(',')}`,
            data: deletedIds
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
const postArraycustomerController = async (req, res) => {
    const payload = req.body
    const user_id = req.user.id
    // payload =
    // [
    //     { customer_id: 12, entity_id: 120, nick_name:"SX", zone: "Zone 1", country:"Cam", continent: "Asia" },
    
    // ]
    // console.log("req.body", req.body)
    try {
        const postData = [];

        for (const item of payload) {
            const result = await customerService.postArraycustomer(
                {
                    entity_id: item.entity_id,
                    nick_name: item.nick_name,
                    zone: item.zone,
                    country: item.country,
                    continnent: item.continnent
                }
            );

            if (result) {
                postData.push(result[0].customer_id);
                await create_log("m_customer", result[0].customer_id, user_id)
                // await create_log()
            }
        }     
        res.status(200).json({
            success: true,
            msg: `Delete record successful: ${postData.length} record & ID: ${postData.join(',')}`,
            data: postData
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


const getAllcustomerbyidController = async (req, res) => {
    // console.log("req.body", req.body)
    try {
        const payload = req.body?.payload;

        if (!Array.isArray(payload)) {
            return res.status(400).json({
                success: false,
                msg: "payload must be an array"
            });
        }

        const results = [];

        for (let i = 0; i < payload.length; i++) {
            const id = payload[i];

            const result = await customerService.getAllcustomerbyid(id);

            if (result?.length > 0) {
                results.push(result[0]);
            }
        // console.log("result", result)

        }
        // console.log("results", results)
        return res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: results
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

const updateArraycustomerController = async (req, res) => {
    // console.log("req.body", req.body)
    const user_id = req.user.id
    try {
        const payload = req?.body?.payload;

        if (!Array.isArray(payload)) {
            return res.status(400).json({
                success: false,
                msg: "payload must be an array"
            });
        }
        const results = [];

        for (let i = 0; i < payload.length; i++) {
            const old_Value = await customerService.getAllcustomerbyid(payload[i].customer_id)
            const result = await customerService.updateArraycustomer(payload[i]);
            if (result?.length > 0) {
                results.push(result[0].customer_id);
                const log = await  update_log("m_customer", result[0], result[0].customer_id, old_Value[0], result[0] , user_id)
                // console.log("log", log)
            }
        // console.log("result", result)
        }
        // console.log("results", results)
        return res.status(200).json({
            success: true,
            msg: `ดึงข้อมูลทั้งหมดได้สำเร็จ ${results.join(',')}`,
            data: results
        });

    } catch (error) {
        console.error("error", error);
        res.status(500).json({
            success: false,
            msg: 'มีปัญหาเกิดขึ้นระหว่างการดึงข้อมูล',
            error: error.message
        });
    }
};




module.exports = {
    getAllcustomerController,
    deleteArraycustomerController,
    postArraycustomerController,
    getAllcustomerbyidController,
    updateArraycustomerController

};
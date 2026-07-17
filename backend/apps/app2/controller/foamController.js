// getAllfoam
const Service = require('../service/foamService')
const detailService = require('../service/foamService')
const { update_log, create_log, delete_log } = require('../utility/update_log'); 
const dbconnect = require('../../../middleWare/Dbconnect');
//mat
const getAllfoamController = async (req, res) => {
    try {
        const result = await Service.getAllfoam()        
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

const getSingleheaderController = async (req, res) => {
    try {
        const result = await Service.getSingleheader(Number(req.params.id))        
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
const getSingledetailbyheader_idController = async (req, res) => {
    try {
        const result = await Service.getSingledetailbyheader_id(Number(req.params.id))        
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
const postSingleheaderController = async (req, res) => {
    // console.log("payload", payload)
    const user_id = req.user.id
    // {
    //     "header": {
    //         "part_no": "126141",
    //         "remark": "-"
    //     },
    //     "detail": [
    //         {
    //             "component_header": "shrinkFilm-1",
    //             "mat_id": 160,
    //             "quantity": "1"
    //         }
    //     ]
    // }
    const {header, detail} = req.body
    // console.log("req.body", req.body)
    try {
        await dbconnect.query('BEGIN')
        //check Duplicate
        const checkDuplicate = await Service.checkDuplicate(header.part_no)
        if (checkDuplicate.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkDuplicate[0],
                msg: `รหัสสินค้าสำเร็จรูป: ${header.part_no} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        //insert prospec
        const headerResult = await Service.postHeader(header)
        //log create at
        if (headerResult) {
            await create_log("foam_header", headerResult[0].foam_header_id, user_id)
            // await create_log()
        }
        //isert product spec detail
        const insertItems = []
        for(const i of detail) {
            const item = {
                foam_header_id: headerResult[0].foam_header_id,
                component_header: i.component_header,
                mat_id: i.mat_id,
                quantity: i.quantity
            }
            const itemsResults = await detailService.postDetail(item)
            console.log("itemsResults", itemsResults[0])
            // console.log("i", i)

            insertItems.push(itemsResults[0].component_header)
            await create_log("foam_detail", itemsResults[0].foam_detail_id, user_id)
        }
        await dbconnect.query('COMMIT');
        res.status(200).json({
            success: true,
            msg: `save record successfull: ${headerResult[0].part_no} }`,
            // data: {
            //     header:productspecResult,
            //     items: insertItems
            // }
        });

    } catch (error) {
        await dbconnect.query('ROLLBACK');
        console.error(error);
        res.status(500).json({
        success: false,
        msg: 'มีปัญหาเกิดขึ้นระหว่างการดึงข้อมูล',
        error: error.message
        });
    }
};


const UpdateSingleheader= async (req, res) => {
    
    const {header, detail} = req.body;
    const user_id = req.user.id
    // {
    //     "header": {
    //         "foam_header_id": 4,
    //         "part_no": "126141111",
    //         "remark": "-"
    //     },
    //     "detail": [
    //         {
    //             "foam_detail_id": 3,
    //             "foam_header_id": 4,
    //             "component_header": "revitBag-1",
    //             "mat_id": 52,
    //             "quantity": 2
    //         },
    //         {
    //             "component_header": "foam-1",
    //             "mat_id": 169,
    //             "quantity": "2"
    //         }
    //     ]
    // }
    try {
        const component = "foam"
        //1. put header
        await dbconnect.query('BEGIN')
        const beforeputheader = await Service.getSingleheader(header.foam_header_id)
        const headerResult = await Service.putHeader(header)
        // log update
        if(headerResult){
            await update_log(`${component}_header`, headerResult[0], headerResult[0].foam_header_id, beforeputheader[0], headerResult[0], user_id )
        }
        // const update_log = async (table_name, allColumn, record_id, old_Value, new_value,action_by) =>{

        //2. get detail by header id
        const existingDetailresult = await detailService.getSingledetailbyheader_id(header.foam_header_id);
        //3. map existing id
        const existingDetail_id = existingDetailresult.map(i => i.foam_detail_id)
        //4. find new detail
        const incomingDetail_id = detail.filter((i) => i.foam_detail_id).map((i) => i.foam_detail_id)
     
        //5. delete in case not existing and not imcoming
        const toDelete = existingDetail_id.filter(foam_detail_id => !incomingDetail_id.includes(foam_detail_id))
        // console.log("toDelete",toDelete)
        if (toDelete.length > 0){
            const toDeletelist = []
            for(const i of toDelete){
                const item = {
                    foam_detail_id: i
                }
                // const beforeDelete = await detailService.getSingledetail(item)
                const toDeleteresult = await detailService.deleteDetail(item.foam_detail_id)
                toDeletelist.push(toDeleteresult[0].drawing_detail_id)
                await delete_log(`${component}_detail`, `${component}_detail_id`, toDeleteresult[0].foam_detail_id,toDeleteresult[0].foam_detail_id, user_id )
                // const delete_log = async (table_name,column_name, record_id,old_Value,action_by) =>{
            }
        }
        //6. for loop to put (id) Or post (not id)
        // console.log("detail", detail)
        for (const item of detail){
            // console.log("item",item)
            const i = {
                foam_detail_id: item.foam_detail_id,
                foam_header_id: headerResult[0].foam_header_id,
                component_header: item.component_header,
                mat_id: item.mat_id,
                quantity: item.quantity,
            }
            if(
                item.foam_detail_id &&
                item.foam_detail_id !== ""
            ){
                const beforeDelete = await detailService.getSingledetail(item.foam_detail_id)
                const putResult = await detailService.putDetail(i)
                // console.log("putResult", putResult[0])
                // console.log("beforeDelete", beforeDelete[0])
                await update_log(`${component}_detail`, putResult[0], putResult[0]?.foam_detail_id,beforeDelete[0], putResult[0], user_id )

            }else{
                const postResult = await detailService.postDetail(i)
                // console.log("postResult", postResult[0])
                await create_log(`${component}_detail`, postResult[0]?.foam_detail_id, user_id)

            }
        }

        await dbconnect.query('COMMIT') 
        res.status(200).json({
            success: true,
            msg: `Record : ${headerResult[0].part_no} Update Successfully `,
            data: headerResult[0]
        });

    } catch (error) {
        await dbconnect.query('ROLLBACK')
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'มีปัญหาเกิดขึ้นระหว่างการดึงข้อมูล',
            error: error.message
        });
    }


}

//detail

module.exports = {
    getAllfoamController,
    getSingledetailbyheader_idController,
    getSingleheaderController,
    postSingleheaderController,
    UpdateSingleheader

};
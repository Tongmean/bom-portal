const engineeringService = require('../service/engineeringService')
const Service = require('../service/engineeringService')
const detailService = require('../service/engineeringDetailService')
const dbconnect = require('../../../middleWare/Dbconnect');
const { update_log, create_log, delete_log } = require('../utility/update_log'); 

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
const getSingleengineeringController = async (req, res) => {
    const drawing_header_id = Number(req.params.id)
    try {
        const result = await engineeringService.getSingleengineering(drawing_header_id)        
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

const postSingleengineeringController = async (req, res) => {
    const payload = req.body
    // console.log("payload", payload)
    const user_id = req.user.id
    // console.log("req.body", req.body)
    // const payload = {
    //     header: {
    //         // "drawing_header_id": 1,
    //         "compact_no": "IZ009-A130",
    //         "drawing_no": "DWIZ009-A130",
    //         "revision": "01",
    //         "remark": null,
    //         "document_status": 1,
    //         "check_status": 1,
    //         "part_no": "IZ009"
    //     },
    //     detail:[
    //         {
    //             // "drawing_detail_id": 1,
    //             // "drawing_header_id": 1,
    //             "component_header": "LS-1",
    //             "mat_id": null,
    //             "id": "LS-IZ009-A130",
    //             "quantity": 1,
    //             "height": null,
    //             "width": null,
    //             "thick_upper": null,
    //             "thick_lower": null,
    //             "curve": null
    //         }
    //     ]
    // }
    
    

    try {
        await dbconnect.query('BEGIN')
        //check Duplicate
        const checkDuplicate = await Service.checkDuplicate(payload.header.compact_no)
        if (checkDuplicate.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkDuplicate[0],
                msg: `รหัสสินค้าสำเร็จรูป: ${payload.header.compact_no} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        //insert prospec
        const headerResult = await Service.postEnginnering(payload.header)
        //log create at
        if (headerResult) {
            await create_log("drawing_header", headerResult[0].drawing_header_id, user_id)
            // await create_log()
        }
        //isert product spec detail
        const insertItems = []
        for(const i of payload.detail) {
            const item = {
                drawing_detail_id: i.drawing_detail_id,
                drawing_header_id: headerResult[0].drawing_header_id,
                component_header: i.component_header,
                mat_id: i.mat_id,
                id: i.id,
                quantity: i.quantity,
                height: i.height,
                width: i.width,
                thick_upper: i.thick_upper,
                thick_lower: i.thick_lower,
                curve: i.curve,
                area: i.area
            }
            const itemsResults = await detailService.postDetailenginnering(item)
            // console.log("itemsResults", itemsResults[0])
            // console.log("i", i)

            insertItems.push(itemsResults[0].component_header)
            await create_log("drawing_detail", itemsResults[0].drawing_detail_id, user_id)
        }
        await dbconnect.query('COMMIT');
        res.status(200).json({
            success: true,
            msg: `save record successfull: ${payload.header.compact_no} }`,
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

const UpdateSingleEngineering = async (req, res) => {
    
    const {header, detail} = req.body;
    const user_id = req.user.id
    // console.log("req.body", req.body)
    // {
    //     "header": {
    //         "drawing_header_id": 14,
    //         "compact_no": "126141-01145",
    //         "drawing_no": "126141",
    //         "revision": "01",
    //         "remark": null,
    //         "document_status": 4,
    //         "check_status": 1,
    //         "part_no": "126141"
    //     },
    //     "detail": [
    //         {
    //             "drawing_detail_id": 11,
    //             "drawing_header_id": 14,
    //             "component_header": "LS-1",
    //             "mat_id": null,
    //             "id": "126141-01145",
    //             "quantity": 1,
    //             "height": null,
    //             "width": null,
    //             "thick_upper": null,
    //             "thick_lower": null,
    //             "curve": null
    //         }
    //     ]
    // }
    console.log("req.body", req.body)
    try {
        //1. put header
        await dbconnect.query('BEGIN')
        const beforeputheader = await Service.getSingleengineering(header.drawing_header_id)
        const headerResult = await Service.putEnginnering(header)
        // log update
        if(headerResult){
            await update_log("drawing_header", headerResult[0], headerResult[0].drawing_header_id, beforeputheader[0], headerResult[0], user_id )
        }
        // const update_log = async (table_name, allColumn, record_id, old_Value, new_value,action_by) =>{

        //2. get detail by header id
        const existingDetailresult = await detailService.getSingledetailEngineeringbyheader_id(header.drawing_header_id);
        //3. map existing id
        const existingDetail_id = existingDetailresult.map(i => i.drawing_detail_id)
        //4. find new detail
        const incomingDetail_id = detail.filter((i) =>i.drawing_detail_id).map((i) => i.drawing_detail_id)
     
        //5. delete in case not existing and not imcoming
        const toDelete = existingDetail_id.filter(drawing_detail_id => !incomingDetail_id.includes(drawing_detail_id))
        // console.log("toDelete",toDelete)
        if (toDelete.length > 0){
            const toDeletelist = []
            for(const i of toDelete){
                const item = {
                    drawing_detail_id: i
                }
                // const beforeDelete = await detailService.getSingledetailEngineering(item)
                const toDeleteresult = await detailService.deleteDetailenginnering(item)
                toDeletelist.push(toDeleteresult[0].drawing_detail_id)
                await delete_log("drawing_detail", "drawing_detail_id", toDeleteresult[0].drawing_detail_id,toDeleteresult[0].drawing_detail_id, user_id )
                // const delete_log = async (table_name,column_name, record_id,old_Value,action_by) =>{
            }
        }
        //6. for loop to put (id) Or post (not id)
        for (const item of detail){
            const i = {
                drawing_detail_id: item.drawing_detail_id,
                drawing_header_id: item.drawing_header_id,
                component_header: item.component_header,
                mat_id: item.mat_id,
                id: item.id,
                quantity: item.quantity,
                height: item.height,
                width: item.width,
                thick_upper: item.thick_upper,
                thick_lower: item.thick_lower,
                curve: item.curve,
                area: item.area
            }
            if(
                item.drawing_detail_id &&
                item.drawing_detail_id !== ""
            ){
                const beforeDelete = await detailService.getSingledetailEngineering(item)
                const putResult = await detailService.putDetailenginnering(i)
                await update_log("drawing_detail", putResult[0], putResult[0].drawing_detail_id,beforeDelete[0], putResult[0], user_id )

            }else{
                const postResult = await detailService.postDetailenginnering(i)
                await create_log("drawing_detail", postResult[0].drawing_detail_id, user_id)

            }
        }

        await dbconnect.query('COMMIT') 
        res.status(200).json({
            success: true,
            msg: `Record : ${headerResult[0].compact_no} Update Successfully `,
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


module.exports = {
    getAllengineeringController,
    getSingleengineeringController,
    postSingleengineeringController,
    UpdateSingleEngineering

};
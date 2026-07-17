const sdpackagingService = require('../service/sdPackagingservice')
const Service = require('../service/sdPackagingservice')
const detailService = require('../service/sdPackagingDetailservice')
const dbconnect = require('../../../middleWare/Dbconnect');
const { update_log, create_log, delete_log } = require('../utility/update_log'); 

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
const getSinglesdpackagingController = async (req, res) => {
    try {
        const result = await sdpackagingService.getSingleheader(req.params.id)        
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
const getSingleDetailsdpackagingbyheader_idController = async (req, res) => {
    try {
        const result = await detailService.getSingledetailbyheader_id(req.params.id)       
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
    // const payload = req.body
    const user_id = req.user.id
    // {
    //     "header": {
    //         "sdpackaging_header_id": null,
    //         "sdpackaing_code": "x",
    //         "revision": "x",
    //         "remark": "x",
    //         "check_status": 1
    //     },
    //     "detail": [
    //         {
    //             "component_header": "innerBox-1",
    //             "mat_id": 1,
    //             "quantity": 1
    //         }
    //     ]
    // }
    const {header, detail} = req.body
    try {
        await dbconnect.query('BEGIN')
        //check Duplicate
        const checkDuplicate = await Service.checkDuplicateheader(header.sdpackaing_code)
        if (checkDuplicate.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkDuplicate[0],
                msg: `รหัสสินค้าสำเร็จรูป: ${header.sdpackaing_code} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        //insert prospec
        const headerResult = await Service.postHeader(header)
        //log create at
        if (headerResult) {
            await create_log("sdpackaging_header", headerResult[0].sdpackaging_header_id, user_id)
            // await create_log()
        }
        //isert product spec detail
        const insertItems = []
        for(const i of detail) {
            const item = {
                sdpackaging_header_id: headerResult[0].sdpackaging_header_id,
                component_header: i.component_header,
                mat_id: i.mat_id,
                quantity: i.quantity
            }
            const itemsResults = await detailService.postDetail(item)
            // console.log("itemsResults", itemsResults[0])
            // console.log("i", i)

            insertItems.push(itemsResults[0].component_header)
            await create_log("sdpackaging_detail", itemsResults[0].sdpackaging_detail_id, user_id)
        }
        await dbconnect.query('COMMIT');
        res.status(200).json({
            success: true,
            msg: `save record successfull: ${header.sdpackaing_code} }`,
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




const UpdateSingleHeader = async (req, res) => {
    
 
    const user_id = req.user.id
    // {
    //     "header": {
    //         "sdpackaging_header_id": 1,
    //         "sdpackaing_code": "P110201-04114/P110102-00100/P610502-00001/01",
    //         "revision": "01",
    //         "remark": "Use ERP ID Insread",
    //         "check_status": 1
    //     },
    //     "detail": [
    //         {
    //             "sdpackaging_detail_id": 2,
    //             "sdpackaging_header_id": 1,
    //             "component_header": "innerBox-1",
    //             "mat_id": 1,
    //             "quantity": 1
    //         },
    //         {
    //             "sdpackaging_detail_id": 1,
    //             "sdpackaging_header_id": 1,
    //             "component_header": "outerBox-1",
    //             "mat_id": 4,
    //             "quantity": 4
    //         },
    //         {
    //             "component_header": "Palete-1",
    //             "mat_id": 158,
    //             "quantity": 1
    //         }
    //     ]
    // }
    const {header, detail} = req.body;
    console.log(req.body)
    try {
        //1. put header
        await dbconnect.query('BEGIN')
        const beforeputheader = await Service.getSingleheader(header.sdpackaging_header_id)
        const headerResult = await Service.putHeader(header)
        // console.log("headerResult", headerResult[0])
        // log update
        if(headerResult){
            await update_log("sdpackaging_header", headerResult[0], headerResult[0].sdpackaging_header_id, beforeputheader[0], headerResult[0], user_id )
        }
        // const update_log = async (table_name, allColumn, record_id, old_Value, new_value,action_by) =>{

        //2. get detail by header id
        const existingDetailresult = await detailService.getSingledetailbyheader_id(header.sdpackaging_header_id);
        //3. map existing id
        const existingDetail_id = existingDetailresult.map(i => i.sdpackaging_detail_id)
        //4. find new detail
        const incomingDetail_id = detail.filter((i) =>i.sdpackaging_detail_id).map((i) => i.sdpackaging_detail_id)
     
        //5. delete in case not existing and not imcoming
        const toDelete = existingDetail_id.filter(sdpackaging_detail_id => !incomingDetail_id.includes(sdpackaging_detail_id))
        // console.log("toDelete",toDelete)
        if (toDelete.length > 0){
            const toDeletelist = []
            for(const i of toDelete){
                const item = {
                    sdpackaging_detail_id: i
                }
                // const beforeDelete = await detailService.getSingleproductspecDetailbydetail_id(item)
                const toDeleteresult = await detailService.deleteDetail(item)
                toDeletelist.push(toDeleteresult[0].sdpackaging_detail_id)
                await delete_log("drawing_detail", "drawing_detail_id", toDeleteresult[0].sdpackaging_detail_id,toDeleteresult[0].sdpackaging_detail_id, user_id )
                // const delete_log = async (table_name,column_name, record_id,old_Value,action_by) =>{
            }
        }
        //6. for loop to put (id) Or post (not id)
        for (const item of detail){
            const i = {
                sdpackaging_detail_id: item.sdpackaging_detail_id,
                sdpackaging_header_id: headerResult[0].sdpackaging_header_id,
                component_header: item.component_header,
                mat_id: item.mat_id,
                quantity: item.quantity,
            }
            if(
                item.sdpackaging_detail_id &&
                item.sdpackaging_detail_id !== ""
            ){
                const beforeDelete = await detailService.getSingledetail(i)
                const putResult = await detailService.putDetail(i)
                // console.log("putResult", putResult[0])
                await update_log("sdpackaging_detail", putResult[0], putResult[0].sdpackaging_detail_id,beforeDelete[0], putResult[0], user_id )

            }else{
                const postResult = await detailService.postDetail(i)
                // console.log("postResult", postResult)
                await create_log("sdpackaging_detail", postResult[0].sdpackaging_detail_id, user_id)


            }
        }

        await dbconnect.query('COMMIT') 
        res.status(200).json({
            success: true,
            msg: `Record : ${headerResult[0].sdpackaing_code} Update Successfully `,
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
    getAllsdpackagingController,
    getSinglesdpackagingController,
    getSingleDetailsdpackagingbyheader_idController,
    postSingleheaderController,
    UpdateSingleHeader

};
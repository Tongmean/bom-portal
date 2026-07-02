// getAllproductspec

const dbconnect = require('../../../middleWare/Dbconnect');
const Service = require('../service/productspecService')
const detailService = require('../service/productspecDetailservice')
const { update_log, create_log, delete_log } = require('../utility/update_log'); 
//mat
const getAllproductspecController = async (req, res) => {
    try {
        const result = await Service.getAllproductspec()   
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
const getSingleproductspecController = async (req, res) => {
    const productspec_header_id = Number(req.params.id)
    try {
        const result = await Service.getSingleproductspec(productspec_header_id)   
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

const postSingleproductspecController = async (req, res) => {
    const {header:productspec, detail: items  } = req.body
    const user_id = req.user.id
    // console.log("req.body", req.body)
    
    // const req.body = {
    //     productspec:{
    //         productspec_code: 'IZMT0633-N-SUB-N-01',
    //         formulation: '641',
    //         revit: '9/S',
    //         drill: 'No',
    //         screen: 'No',
    //         emark: '-',
    //         channel: 1,
    //         revision: '01',
    //         remark: '-',
    //         document_status: 1,
    //         check_status: 1,
    //         customer_id: 1,
    //         sale_code: 'N',
    //     },
    //     items: [
    //         {component_header: 'attachPaper-1', mat_id: 172, quantity: 1}
    //     ]
    // }
    try {
        await dbconnect.query('BEGIN')
        //check Duplicate
        const checkDuplicate = await Service.checkDupliacteproductspec(productspec);
        if (checkDuplicate.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkDuplicate,
                msg: `รหัสสินค้าสำเร็จรูป: ${productspec.productspec_code} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        //insert prospec
        const productspecResult = await Service.postProductspec(productspec)
        //log create at
        if (productspecResult) {
            await create_log("productspec_header", productspecResult[0].productspec_header_id, user_id)
            // await create_log()
        }
        //isert product spec detail
        const insertItems = []
        for(const i of items){
            const item = {
                component_header: i.component_header,
                mat_id: i.mat_id,
                productspec_header_id: productspecResult[0].productspec_header_id
            }
            const itemsResults = detailService.postProductspecdetailService(item)
            insertItems.push(itemsResults[0].component_header)
            await create_log("productspec_detail", itemsResults[0].productspec_detail_id, user_id)
        }
        await dbconnect.query('COMMIT');
        res.status(200).json({
            success: true,
            msg: `save record successfull: ${productspecResult[0].productspec_code} && ${insertItems.join(",")}`,
            data: {
                header:productspecResult,
                items: insertItems
            }
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


const UpdateSingleproductspec = async (req, res) => {
        // req.body = {
        //     "header": {
        //         "productspec_header_id": 2,
        //         "productspec_code": "45",
        //         "formulation": "45",
        //         "revit": "45",
        //         "drill": "45",
        //         "screen": "45",
        //         "emark": "45",
        //         "channel": null,
        //         "revision": "45",
        //         "remark": "45",
        //         "document_status": null,
        //         "check_status": 1,
        //         "customer_id": 72,
        //         "sale_code": "545"
        //     },
        //     "detail": [
        //         {
        //             "productspec_detail_id": 5,
        //             "productspec_header_id": 2,
        //             "component_header": "Sticker-1",
        //             "mat_id": 6,
        //             "quantity": 1
        //         },
        //         {
        //             "productspec_detail_id": "",
        //             "productspec_header_id": 2,
        //             "component_header": "Sticker-2",
        //             "mat_id": 4,
        //             "quantity": 2
        //         }
        //     ]
        // }
        const {header, detail} = req.body;
        const user_id = req.user.id
        // console.log("req.body", req.body)

        try {
            //1. put header
            await dbconnect.query('BEGIN')
            const beforeputheader = await Service.getSingleproductspec(header.productspec_header_id)
            const headerResult = await Service.putProductspecheader(header)
            // log update
            if(headerResult){
                await update_log("productspec_header", headerResult[0], headerResult[0].productspec_header_id, beforeputheader[0], headerResult[0], user_id )
            }
            // const update_log = async (table_name, allColumn, record_id, old_Value, new_value,action_by) =>{

            //2. get detail by header id
            const existingDetailresult = await detailService.getSingleproductspecDetail(header.productspec_header_id);
            //3. map existing id
            const existingDetail_id = existingDetailresult.map(i => i.productspec_detail_id)
            //4. find new detail
            const incomingDetail_id = detail.filter((i) =>i.productspec_detail_id).map((i) => i.productspec_detail_id)
         
            //5. delete in case not existing and not imcoming
            const toDelete = existingDetail_id.filter(productspec_detail_id => !incomingDetail_id.includes(productspec_detail_id))
            // console.log("toDelete",toDelete)
            if (toDelete.length > 0){
                const toDeletelist = []
                for(const i of toDelete){
                    const item = {
                        productspec_detail_id: i
                    }
                    // const beforeDelete = await detailService.getSingleproductspecDetailbydetail_id(item)
                    const toDeleteresult = await detailService.deleteProductspecdetailService(item)
                    toDeletelist.push(toDeleteresult[0].productspec_detail_id)
                    await delete_log("productspec_detail", "productspec_detail_id", toDeleteresult[0].productspec_detail_id,toDeleteresult[0].productspec_detail_id, user_id )
                    // const delete_log = async (table_name,column_name, record_id,old_Value,action_by) =>{
                }
            }
            //6. for loop to put (id) Or post (not id)
            for (const item of detail){
                if(
                    item.productspec_detail_id &&
                    item.productspec_detail_id !== ""
                ){
                    const beforeDelete = await detailService.getSingleproductspecDetailbydetail_id(item)
                    const putResult = await detailService.putProductspecdetailService(item)
                    await update_log("productspec_detail", putResult[0], putResult[0].productspec_detail_id,beforeDelete[0], putResult[0], user_id )

                }else{
                    const postResult = await detailService.postProductspecdetailService(item)
                    await create_log("productspec_detail", postResult[0].productspec_detail_id, user_id)

                }
            }

            await dbconnect.query('COMMIT') 
            res.status(200).json({
                success: true,
                msg: `Record : ${headerResult[0].productspec_code} Update Successfully `,
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
    getAllproductspecController,
    postSingleproductspecController,
    getSingleproductspecController,
    UpdateSingleproductspec
};
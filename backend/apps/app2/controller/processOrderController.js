const Service = require('../service/processOrderservice')
const matService = require('../service/m_matService')
const { update_log, create_log, delete_log } = require('../utility/update_log') 
const { leftJoin } = require('../utility/leftJoin') 
const {createColumnDefs} = require('../utility/getColumn')
const {pivotData} = require('../utility/pivotUltility')
const dbconnect = require('../../../middleWare/Dbconnect');


const getAllprocess_order = async (req, res) => {
    try {
        const process_routing = await Service.getAllprocessRouting()        
        const process_routing_order = await Service.getAllprocessRoutingorder()
        const mat = await matService.getAllmat() 
        // console.log("process_routing", process_routing)
        // console.log("process_routing_order", process_routing_order)
        // console.log("mat", mat[0])       
        const pivetProcess_routing_order = pivotData(process_routing_order,{
            groupBy: ['process_routing_id'],
            pivotColumnKey: 'process',
            pivotValueKey: 'process_order'
        }) 
        // console.log("pivetProcess_routing_order",pivetProcess_routing_order)
        const step1 = leftJoin(process_routing, mat, 'mat_id', 'mat_id')
        const final = leftJoin(step1, pivetProcess_routing_order, 'process_routing_id', 'process_routing_id')
        const newArray = final.map(({ 
            width, height, thick, area, curve, 
            min_thick, max_thick, cavity, weight, 
            costperunit, file, id,mat_id, unit, outer_dia, ...rest 
        }) => rest);
        const columnDefs = createColumnDefs(newArray)
        // console.log("newArray", newArray)
        // console.log("columnDefs", columnDefs)
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: newArray,
            columnDefs: columnDefs
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

//single
const getSingleprocess_order = async (req, res) => {
    const id = req.params.id
    try {
        const process_routing = await Service.getSingleprocessRouting(id)        
        const process_routing_order = await Service.getSinlgeprocessRoutingorderbyroutingid(id)
        const process_routing_ColumnDefs = (() => {
            const source = process_routing || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], required: true, option: true };
            // if (cols[5]) cols[5] = { ...cols[5], option: true, required: true };
            // if (cols[6]) cols[6] = { ...cols[6], option: true, required: true };
        
            return cols;
        })();
        const process_routing_order_ColumnDefs = (() => {
            const source = process_routing_order || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], hidden: true };
            if (cols[3]) cols[3] = { ...cols[3], option: true };
        
            return cols;
        })();
        // console.log("newArray", newArray)
        // console.log("columnDefs", columnDefs)
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: {
                process_routing:process_routing,
                process_routing_order: process_routing_order
            },
            columnDefs: {
                process_routing_ColumnDefs:process_routing_ColumnDefs,
                process_routing_order_ColumnDefs: process_routing_order_ColumnDefs
            }
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
//post single
const postSingleprocessController = async (req, res) => {
    const payload = req.body
    // console.log("payload", payload)
    const user_id = req.user.id
    // {
    //     "header": {
    //         "mat_id": 463,
    //         "revision": "12",
    //         "remark": "12"
    //     },
    //     "detail": [
    //         {
    //             "process_order": "1",
    //             "process": "press"
    //         }
    //     ]
    // }
    

    try {
        await dbconnect.query('BEGIN')
        //check Duplicate
        const checkDuplicate = await Service.checkDuplicate(payload.header.mat_id)
        if (checkDuplicate.length > 0) {
            return res.status(400).json({
                success: false,
                data: checkDuplicate[0],
                msg: `รหัส MAT: ${payload.header.mat_id} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }
        //insert prospec
        const headerResult = await Service.postSingleprocessRouting(payload.header)
        //log create at
        if (headerResult) {
            await create_log("process_routing", headerResult[0].process_routing_id, user_id)
            // await create_log()
        }
        //isert product spec detail
        const insertItems = []
        for(const i of payload.detail) {
            const item = {
                process_routing_id: headerResult[0].process_routing_id,
                process_order: i.process_order,
                process: i.process
            }
            const itemsResults = await Service.postSingleProcessRoutingOrder(item)
            // console.log("itemsResults", itemsResults[0])
            // console.log("i", i)

            insertItems.push(itemsResults[0].process)
            await create_log("process_routing_order", itemsResults[0].process_routing_order_id, user_id)
        }
        await dbconnect.query('COMMIT');
        res.status(200).json({
            success: true,
            msg: `save record successfull: ${payload.header.mat_id} }`,
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
//put single
const putSingleprocessController = async (req, res) => {
    const payload = req.body
    // console.log("payload", payload)
    const user_id = req.user.id
    // {
    //     "header": {
    //         "mat_id": 463,
    //         "revision": "12",
    //         "remark": "12"
    //     },
    //     "detail": [
    //         {
    //             "process_order": "1",
    //             "process": "press"
    //         }
    //     ]
    // }
    

    try {
        await dbconnect.query('BEGIN')
        if (!payload.header || !payload.header.mat_id) {
            await dbconnect.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                msg: "กรุณาเพิ่มข้อมูล Material ก่อนบันทึก!" // Please add Material data before saving!
            });
        }
        // 1. Update Header (Material)
        const beforeheaderUpdate = await Service.getSingleprocessRouting(payload.header.process_routing_id);
        const headerResult = await Service.putProcessRouting(payload.header);
        
        // GUARD: Ensure the main material actually updated before proceeding
        if (!headerResult || headerResult.length === 0) {
            throw new Error(`ไม่พบ Material ID: ${payload.header.process_routing_id} ในระบบ`); 
        }

        if(headerResult){
            await update_log(
                "process_routing",
                headerResult[0],
                headerResult[0].process_routing_id,
                beforeheaderUpdate[0],
                headerResult[0],
                user_id
            );
        }

        //2. get detail by header id
        const existingDetailresult = await Service.getSinlgeprocessRoutingorderbyroutingid(headerResult[0].process_routing_id);
        //3. map existing id
        const existingDetail_id = existingDetailresult.map(i => i.process_routing_order_id)
        //4. find new detail
        const incomingDetail_id = payload.detail.filter((i) =>i.process_routing_order_id).map((i) => i.process_routing_order_id)
     
        //5. delete in case not existing and not imcoming
        const toDelete = existingDetail_id.filter(process_routing_order_id => !incomingDetail_id.includes(process_routing_order_id))
        // console.log("toDelete",toDelete)
        if (toDelete.length > 0){
            const toDeletelist = []
            for(const i of toDelete){
                const item = {
                    process_routing_order_id: i
                }
                // const beforeDelete = await detailService.getSingledetailEngineering(item)
                const toDeleteresult = await Service.deleteProcessRoutingOrder(item.process_routing_order_id)
                toDeletelist.push(toDeleteresult[0].process_routing_order_id)
                await delete_log("process_routing_order", "process_routing_order_id", toDeleteresult[0].process_routing_order_id,toDeleteresult[0].process_routing_order_id, user_id )
                // const delete_log = async (table_name,column_name, record_id,old_Value,action_by) =>{
            }
        }
        //6. for loop to put (id) Or post (not id)
        for (const item of payload.detail){
            const i = {
                process_routing_order_id: item.process_routing_order_id,
                process_routing_id: headerResult[0].process_routing_id,
                process_order: item.process_order,
                process: item.process
               
            }
            if(
                item.process_routing_order_id &&
                item.process_routing_order_id !== ""
            ){
                const beforeDelete = await Service.getSinlgeprocessRoutingorder(i.process_routing_order_id)
                const putResult = await Service.putProcessRoutingOrder(i)
                await update_log("process_routing_order", putResult[0], putResult[0].process_routing_order_id,beforeDelete[0], putResult[0], user_id )

            }else{
                const postResult = await Service.postSingleProcessRoutingOrder(i)
                await create_log("process_routing_order", postResult[0].process_routing_order_id, user_id)

            }
        }
        await dbconnect.query('COMMIT');
        res.status(200).json({
            success: true,
            msg: `Update record successfull: ${payload.header.mat_id} `,
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



module.exports = {
    getAllprocess_order,
    getSingleprocess_order,
    postSingleprocessController,
    putSingleprocessController

};
const Service = require('../service/processOrderservice')
const matService = require('../service/m_matService')
const toolingService  = require('../service/processOrderserviceTooling')
const { update_log, create_log, delete_log } = require('../utility/update_log') 
const { leftJoin } = require('../utility/leftJoin') 
const {createColumnDefs, reorderAuto, sortColumnDefs} = require('../utility/getColumn')
const {pivotData} = require('../utility/pivotUltility')
const dbconnect = require('../../../middleWare/Dbconnect');


const getAllprocess_ordertooling = async (req, res) => {
    try {
        const process_routing = await Service.getAllprocessRouting()        
        const process_routing_order = await Service.getAllprocessRoutingorder()
        const mat = await matService.getAllmat() 
        const press_routing_order_tooling = await toolingService.getAllprocessRoutingtooling()        // console.log("process_routing", process_routing)
        const press_routing_order_tooling_bom = await toolingService.getAllprocessRoutingtoolingBom()  
        const press_routing_order_tooling_machine = await toolingService.getAllprocessRoutingtoolingMachine()  
        
        // console.log("process_routing_order", process_routing_order)
        // console.log("mat", mat[0])       

        const bomPrivet = pivotData(press_routing_order_tooling_bom,{
            groupBy: ['process_routing_tooling_id'],
            pivotColumnKey: 'mat_id',
            pivotValueKey: 'value'
        })
        const machinePrivet = pivotData(press_routing_order_tooling_machine,{
            groupBy: ['process_routing_tooling_id'],
            pivotColumnKey: 'machine_id',
            pivotValueKey: 'value'
        })

        // console.log("bomPrivet", bomPrivet)
        // console.log("press_routing_order_tooling", press_routing_order_tooling)
        const step1 = leftJoin(process_routing, mat, 'mat_id', 'mat_id')
        const final = leftJoin( process_routing_order, step1, 'process_routing_id', 'process_routing_id')
        const newArray = final.map(({ 
            width, height, thick, area, curve, 
            min_thick, max_thick, cavity, weight, 
            costperunit, file, id,mat_id, unit, outer_dia, process_order, process_routing_id,
            revision, remark,name,
            ...rest 
        }) => rest);
        const newArrayjointooling = leftJoin(press_routing_order_tooling,newArray, "process_routing_order_id", "process_routing_order_id")
        const toolingJoinbom = leftJoin(newArrayjointooling, bomPrivet, "process_routing_tooling_id", "process_routing_tooling_id").map(({
            process_routing_order_id, ...rest
        })=> rest)
        // Define your standard column order

        // Reorder toolingJoinbom generically
        const machinejoin = leftJoin(toolingJoinbom, machinePrivet,"process_routing_tooling_id", "process_routing_tooling_id" )
        // const toolingJoinbomReordered = reorderAuto(machinejoin);
        // console.log("machinejoin", machinejoin)
        // console.log("machinePrivet", machinePrivet)
        // console.log(toolingJoinbomReordered);
        // console.log(toolingJoinbomReordered);
        const columnDefs = createColumnDefs(machinejoin)
        // In your controller

        // 1. Define your exact desired standard field order
        const standardFieldsOrder = [
            'process_routing_tooling_id', 
            'process', 
            'tooling_id', 
            'value', 
            'erp', 
            'component'
        ];

        // 2. Pass the columnDefs and your ordered array into the function
        const sortedColumnDefs = sortColumnDefs(columnDefs, standardFieldsOrder);
        // // console.log("newArray", newArray)
        // console.log("reorderAuto(toolingJoinbom)", reorderAuto(machinejoin))
        
        // console.log("columnDefs", columnDefs)

        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: machinejoin,
            columnDefs: sortedColumnDefs
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
const getSingleprocess_order_tooling = async (req, res) => {
    const id = req.params.id
    try {
        const process_routing_tooling = await toolingService.getSingleprocessRoutingtooling(id)        
        const process_routing_tooling_bom = await toolingService.getSingleprocessRoutingtoolingBom(id)
        const process_routing_tooling_machine = await toolingService.getSingleprocessRoutingtoolingMachine(id)
        const process_routing_tooling_ColumnDefs = (() => {
            const source = process_routing_tooling || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], option:true, required: true, text: "number"  };
            if (cols[2]) cols[2] = { ...cols[2], option: true, required: true, text: "number" };
            if (cols[3]) cols[3] = { ...cols[3], option: false, required: false, text: "number" };
        
            return cols;
        })();
        const process_routing_tooling_bom_ColumnDefs = (() => {
            const source = process_routing_tooling_bom || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], hidden: true };
            if (cols[2]) cols[2] = { ...cols[2], option: true, required: false, text: "number" };
            if (cols[3]) cols[3] = { ...cols[3], required: false, text: "number" };
        
            return cols;
        })();
        const process_routing_tooling_machine_ColumnDefs = (() => {
            const source = process_routing_tooling_machine || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], hidden: true };
            if (cols[2]) cols[2] = { ...cols[2], option: true, required: false, text: "number" };
            if (cols[3]) cols[3] = { ...cols[3], required: false, text: "number" };
        
            return cols;
        })();
        // console.log("newArray", newArray)
        // console.log("columnDefs", columnDefs)
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: {
                process_routing_tooling:process_routing_tooling,
                process_routing_tooling_bom: process_routing_tooling_bom,
                process_routing_tooling_machine: process_routing_tooling_machine,

            },
            columnDefs: {
                header:process_routing_tooling_ColumnDefs,
                detail_bom: process_routing_tooling_bom_ColumnDefs,
                detail_machine: process_routing_tooling_machine_ColumnDefs
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
// const postSingleprocess_order_tooling_Controller = async (req, res) => {
//     const payload = req.body
//     // console.log("payload", payload)
//     const user_id = req.user.id
//     // {
//     //     "header": {
//     //         "process_routing_order_id": 1,
//     //         "tooling_id": 471,
//     //         "value": 1
//     //     },
//     //     "detail_bom": [
//     //         {
//     //             "mat_id": 470,
//     //             "value": 21
//     //         }
//     //     ],
//     //     "detail_machine": [
//     //         {
//     //             "machine_id": 472,
//     //             "value": 21
//     //         }
//     //     ]
//     // }
    

//     try {
//         await dbconnect.query('BEGIN')
//         //check Duplicate
//         const checkDuplicate = await toolingService.checkDuplicate(payload.header)
//         if (checkDuplicate.length > 0) {
//             return res.status(400).json({
//                 success: false,
//                 data: checkDuplicate[0],
//                 msg: `รหัส MAT ROUTE: ${payload.header.tooling_id}-${payload.header.process_routing_order_id} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
//             });
//         }
//         //insert prospec
//         const headerResult = await toolingService.postSingleprocessRoutingtooling(payload.header)
//         //log create at
//         if (headerResult) {
//             await create_log("process_routing_order_tooling", headerResult[0].process_routing_tooling_id, user_id)
//             // await create_log()
//         }
//         //bom
//         if(payload.detail_bom && Array.isArray(payload.detail_bom)){
//             for(const i of payload.detail_bom) {
//                 const item = {
//                     process_routing_tooling_id: headerResult[0].process_routing_tooling_id,
//                     mat_id: i.mat_id,
//                     value: i.value
//                 }
//                 const itemsResults = await toolingService.postSingleprocessRoutingtoolingBom(item)
//                 // console.log("itemsResults", itemsResults[0])
//                 // console.log("i", i)
    
//                 await create_log("process_routing_order_tooling_bom", itemsResults[0].process_routing_tooling_bom_id, user_id)
//             }
//         }
//          //machine
//          if(payload.detail_machine && Array.isArray(payload.detail_machine)){
//             for(const i of payload.detail_machine) {
//                 const item = {
//                     process_routing_tooling_id: headerResult[0].process_routing_tooling_id,
//                     machine_id: i.machine_id,
//                     value: i.value
//                 }
//                 const itemsResults = await toolingService.postSingleprocessRoutingtoolingMachine(item)
//                 // console.log("itemsResults", itemsResults[0])
//                 // console.log("i", i)
    
//                 await create_log("process_routing_order_tooling_machine_id", itemsResults[0].process_routing_order_tooling_machine_id, user_id)
//             }
//         }

       
//         await dbconnect.query('COMMIT');
//         res.status(200).json({
//             success: true,
//             msg: `save record successfull: ${payload.header.tooling_id}-- ${payload.header.value}}`,
//             // data: {
//             //     header:productspecResult,
//             //     items: insertItems
//             // }
//         });

//     } catch (error) {
//         await dbconnect.query('ROLLBACK');
//         console.error(error);
//         res.status(500).json({
//         success: false,
//         msg: 'มีปัญหาเกิดขึ้นระหว่างการดึงข้อมูล',
//         error: error.message
//         });
//     }
// };

const postSingleprocess_order_tooling_Controller = async (req, res) => {
    // Destructure for cleaner code
    const { header, detail_bom, detail_machine } = req.body;
    const user_id = req.user.id;

    try {
        await dbconnect.query('BEGIN');

        // 1. Check Duplicate
        const checkDuplicate = await toolingService.checkDuplicate(header, {mat_id: detail_bom.mat_id});
        if (checkDuplicate.length > 0) {
            await dbconnect.query('ROLLBACK'); // [FIXED]: Added missing ROLLBACK
            return res.status(400).json({
                success: false,
                data: checkDuplicate[0],
                msg: `รหัส MAT ROUTE: ${header.tooling_id}-${header.process_routing_order_id}-${detail_bom.mat_id} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }

        // 2. Insert Prospec Header
        const headerResult = await toolingService.postSingleprocessRoutingtooling(header);
        
        if (headerResult && headerResult.length > 0) {
            const newHeaderId = headerResult[0].process_routing_tooling_id;
            await create_log("process_routing_order_tooling", newHeaderId, user_id);

            // 3. Process BOM Details (Using Promise.all for concurrent insertion)
            if (detail_bom && Array.isArray(detail_bom)) {
                const bomPromises = detail_bom.map(async (i) => {
                    const item = {
                        process_routing_tooling_id: newHeaderId,
                        mat_id: i.mat_id,
                        value: i.value
                    };
                    const itemsResults = await toolingService.postSingleprocessRoutingtoolingBom(item);
                    return create_log(
                        "process_routing_order_tooling_bom", 
                        itemsResults[0].process_routing_tooling_bom_id, 
                        user_id
                    );
                });
                await Promise.all(bomPromises); // Executes all BOM inserts in parallel
            }

            // 4. Process Machine Details (Using Promise.all for concurrent insertion)
            if (detail_machine && Array.isArray(detail_machine)) {
                const machinePromises = detail_machine.map(async (i) => {
                    const item = {
                        process_routing_tooling_id: newHeaderId,
                        machine_id: i.machine_id,
                        value: i.value
                    };
                    const itemsResults = await toolingService.postSingleprocessRoutingtoolingMachine(item);
                    return create_log(
                        "process_routing_order_tooling_machine", // [FIXED]: Removed "_id" from string
                        itemsResults[0].process_routing_order_tooling_machine_id, 
                        user_id
                    );
                });
                await Promise.all(machinePromises); // Executes all Machine inserts in parallel
            }
        }

        await dbconnect.query('COMMIT');
        
        return res.status(200).json({
            success: true,
            msg: `save record successfull: ${header.tooling_id} -- ${header.value}`
        });

    } catch (error) {
        await dbconnect.query('ROLLBACK');
        console.error("Error in postSingleprocess_order_tooling_Controller:", error);
        return res.status(500).json({
            success: false,
            msg: 'มีปัญหาเกิดขึ้นระหว่างการดึงข้อมูล',
            error: error.message
        });
    }
};

// //put single
// const putSingleprocess_order_tooling_Controller = async (req, res) => {
//     const payload = req.body
//     // console.log("payload", payload)
//     const user_id = req.user.id
//     // {
//     //     "header": {
//     //         "process_routing_tooling_id": 1,
//     //         "process_routing_order_id": 1,
//     //         "tooling_id": 471,
//     //         "value": "1"
//     //     },
//     //     "detail_bom": [
//     //         {
//     //             "process_routing_tooling_bom_id": 1,
//     //             "process_routing_tooling_id": 1,
//     //             "mat_id": 464,
//     //             "value": "1200"
//     //         },
//     //         {
//     //             "process_routing_tooling_bom_id": 2,
//     //             "process_routing_tooling_id": 1,
//     //             "mat_id": 470,
//     //             "value": "1250"
//     //         }
//     //     ],
//     //     "detail_machine": [
//     //         {
//     //             "process_routing_order_tooling_machine_id": 1,
//     //             "process_routing_tooling_id": 1,
//     //             "machine_id": 467,
//     //             "value": "2000"
//     //         },
//     //         {
//     //             "process_routing_order_tooling_machine_id": 2,
//     //             "process_routing_tooling_id": 1,
//     //             "machine_id": 474,
//     //             "value": "2500"
//     //         }
//     //     ]
//     // }
    

//     try {
//         await dbconnect.query('BEGIN')
//         if (!payload.header || !payload.header.mat_id) {
//             await dbconnect.query("ROLLBACK");
//             return res.status(400).json({
//                 success: false,
//                 msg: "กรุณาเพิ่มข้อมูล ก่อนบันทึก!" // Please add Material data before saving!
//             });
//         }
//         // 1. Update Header (Material)
//         const beforeheaderUpdate = await toolingService.getSingleprocessRoutingtooling(payload.header.process_routing_tooling_id);
//         const headerResult = await toolingService.putSingleprocessRoutingtooling(payload.header);
        
//         // GUARD: Ensure the main material actually updated before proceeding
//         if (!headerResult || headerResult.length === 0) {
//             throw new Error(`ไม่พบ Material ID: ${payload.header.tooling_id} ในระบบ`); 
//         }

//         if(headerResult){
//             await update_log(
//                 "process_routing_order_tooling",
//                 headerResult[0],
//                 headerResult[0].process_routing_tooling_id,
//                 beforeheaderUpdate[0],
//                 headerResult[0],
//                 user_id
//             );
//         }
//         //2. SYNC DETAIL BOM
//         //2. get detail by header id
//         const existingDetailbomresult = await toolingService.getSingleprocessRoutingtoolingBom(headerResult[0].process_routing_tooling_id);
//         //3. map existing id
//         const existingbomDetail_id = existingDetailbomresult.map(i => i.process_routing_tooling_bom_id)
//         //4. find new detail
//         const incomingDetail_id = payload.detail_bom.filter((i) =>i.process_routing_tooling_bom_id).map((i) => i.process_routing_tooling_bom_id)
     
//         //5. delete in case not existing and not imcoming
//         const tobomDelete = existingbomDetail_id.filter(process_routing_tooling_bom_id => !incomingDetail_id.includes(process_routing_tooling_bom_id))
//         // console.log("toDelete",toDelete)
//         if (tobomDelete.length > 0){
//             const toDeletelist = []
//             for(const i of toDelete){
//                 const item = {
//                     process_routing_tooling_bom_id: i
//                 }
//                 // const beforeDelete = await detailService.getSingledetailEngineering(item)
//                 const toDeletebomresult = await toolingService.deleteSingleprocessRoutingtoolingBom(item)
//                 await delete_log("process_routing_order", "process_routing_tooling_bom_id", toDeletebomresult[0].process_routing_tooling_bom_id,toDeletebomresult[0].process_routing_tooling_bom_id, user_id )
//             }
//         }
//         //6. for loop to put (id) Or post (not id)
//         for (const item of payload.detail_bom){
//             const i = {
//                 process_routing_tooling_bom_id: item.process_routing_tooling_bom_id,
//                 process_routing_tooling_id: headerResult[0].process_routing_tooling_id,
//                 mat_id: item.mat_id,
//                 value: item.value
              
               
//             }
//             if(
//                 item.process_routing_tooling_bom_id &&
//                 item.process_routing_tooling_bom_id !== ""
//             ){
//                 const beforebomDelete = await toolingService.getSingleprocessRoutingtoolingBombybomid(i.process_routing_tooling_bom_id)
//                 const putResult = await toolingService.putSingleprocessRoutingtoolingBom(i)
//                 await update_log("process_routing_order_tooling_bom", putResult[0], putResult[0].process_routing_tooling_bom_id, beforebomDelete[0], putResult[0], user_id )

//             }else{
//                 const postResult = await toolingService.postSingleprocessRoutingtoolingBom(i)
//                 await create_log("process_routing_order_tooling_bom", postResult[0].process_routing_order_tooling_bom, user_id)

//             }
//         }
//         //3. SYNC DETAIL BOM
//         //2. get detail by header id
//         const existingDetailmachineresult = await toolingService.getSingleprocessRoutingtoolingMachine(headerResult[0].process_routing_tooling_id);
//         //3. map existing id
//         const existingmachineDetail_id = existingDetailmachineresult.map(i => i.process_routing_order_tooling_machine_id)
//         //4. find new detail
//         const incomingmachineDetail_id = payload.detail_machine.filter((i) =>i.process_routing_order_tooling_machine_id).map((i) => i.process_routing_order_tooling_machine_id)
     
//         //5. delete in case not existing and not imcoming
//         const tomachineDelete = existingmachineDetail_id.filter(process_routing_order_tooling_machine_id => !incomingmachineDetail_id.includes(process_routing_order_tooling_machine_id))
//         // console.log("toDelete",toDelete)
//         if (tobomDelete.length > 0){
//             const toDeletelist = []
//             for(const i of toDelete){
//                 const item = {
//                     process_routing_order_tooling_machine_id: i
//                 }
//                 // const beforeDelete = await detailService.getSingledetailEngineering(item)
//                 const toDeletebomresult = await toolingService.deleteSingleprocessRoutingtoolingBom(item)
//                 await delete_log("process_routing_order_tooling_machine", "process_routing_order_tooling_machine_id", toDeletebomresult[0].process_routing_order_tooling_machine_id,toDeletebomresult[0].process_routing_order_tooling_machine_id, user_id )
//             }
//         }
//         //6. for loop to put (id) Or post (not id)
//         for (const item of payload.detail_machine){
//             const i = {
//                 process_routing_order_tooling_machine_id: item.process_routing_order_tooling_machine_id,
//                 process_routing_tooling_id: headerResult[0].process_routing_tooling_id,
//                 machine_id: item.machine_id,
//                 value: item.value
              
               
//             }
//             if(
//                 item.process_routing_order_tooling_machine_id &&
//                 item.process_routing_order_tooling_machine_id !== ""
//             ){
//                 const beforebomDelete = await toolingService.getSingleprocessRoutingtoolingMachinebymachineid(i.process_routing_order_tooling_machine_id)
//                 const putResult = await toolingService.putSingleprocessRoutingtoolingMachine(i)
//                 await update_log("process_routing_order_tooling_machine", putResult[0], putResult[0].process_routing_order_tooling_machine, beforebomDelete[0], putResult[0], user_id )

//             }else{
//                 const postResult = await toolingService.postSingleprocessRoutingtoolingMachine(i)
//                 await create_log("process_routing_order_tooling_machine", postResult[0].process_routing_order_tooling_machine, user_id)

//             }
//         }
//         await dbconnect.query('COMMIT');
//         res.status(200).json({
//             success: true,
//             msg: `Update record successfull: ${payload.header.mat_id} `,
//             // data: {
//             //     header:productspecResult,
//             //     items: insertItems
//             // }
//         });

//     } catch (error) {
//         await dbconnect.query('ROLLBACK');
//         console.error(error);
//         res.status(500).json({
//         success: false,
//         msg: 'มีปัญหาเกิดขึ้นระหว่างการดึงข้อมูล',
//         error: error.message
//         });
//     }
// };

const putSingleprocess_order_tooling_Controller = async (req, res) => {
    const payload = req.body;
    const user_id = req.user.id;

    try {
        await dbconnect.query('BEGIN');

        // ==========================================
        // 1. UPDATE HEADER
        // ==========================================
        // FIX: Changed payload.header.mat_id to tooling_id (mat_id does not exist in header)
        if (!payload.header || !payload.header.tooling_id) {
            await dbconnect.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                msg: "กรุณาเพิ่มข้อมูล ก่อนบันทึก!" // Please add required data before saving!
            });
        }
        
        const beforeheaderUpdate = await toolingService.getSingleprocessRoutingtooling(payload.header.process_routing_tooling_id);
        const headerResult = await toolingService.putSingleprocessRoutingtooling(payload.header);
        
        // GUARD: Ensure the header actually updated before proceeding
        if (!headerResult || headerResult.length === 0) {
            throw new Error(`ไม่พบ Tooling ID: ${payload.header.tooling_id} ในระบบ`); 
        }

        await update_log(
            "process_routing_order_tooling",
            headerResult[0],
            headerResult[0].process_routing_tooling_id,
            beforeheaderUpdate[0],
            headerResult[0],
            user_id
        );

        // ==========================================
        // 2. SYNC DETAIL BOM
        // ==========================================
        const existingDetailbomresult = await toolingService.getSingleprocessRoutingtoolingBom(headerResult[0].process_routing_tooling_id);
        const existingbomDetail_id = existingDetailbomresult.map(i => i.process_routing_tooling_bom_id);
        const incomingDetail_id = payload.detail_bom
            .filter(i => i.process_routing_tooling_bom_id)
            .map(i => i.process_routing_tooling_bom_id);
     
        // Delete BOMs not present in the incoming payload
        const tobomDelete = existingbomDetail_id.filter(id => !incomingDetail_id.includes(id));
        
        if (tobomDelete.length > 0) {
            // FIX: changed "toDelete" to "tobomDelete"
            for (const i of tobomDelete) {
                const item = { process_routing_tooling_bom_id: i };
                const toDeletebomresult = await toolingService.deleteSingleprocessRoutingtoolingBom(item);
                await delete_log(
                    "process_routing_order", 
                    "process_routing_tooling_bom_id", 
                    toDeletebomresult[0].process_routing_tooling_bom_id,
                    toDeletebomresult[0].process_routing_tooling_bom_id, 
                    user_id
                );
            }
        }

        // Upsert BOMs (Update or Create)
        for (const item of payload.detail_bom) {
            const i = {
                process_routing_tooling_bom_id: item.process_routing_tooling_bom_id,
                process_routing_tooling_id: headerResult[0].process_routing_tooling_id,
                mat_id: item.mat_id,
                value: item.value
            };

            if (item.process_routing_tooling_bom_id && item.process_routing_tooling_bom_id !== "") {
                const beforebomUpdate = await toolingService.getSingleprocessRoutingtoolingBombybomid(i.process_routing_tooling_bom_id);
                const putResult = await toolingService.putSingleprocessRoutingtoolingBom(i);
                await update_log(
                    "process_routing_order_tooling_bom", 
                    putResult[0], 
                    putResult[0].process_routing_tooling_bom_id, 
                    beforebomUpdate[0], 
                    putResult[0], 
                    user_id 
                );
            } else {
                const postResult = await toolingService.postSingleprocessRoutingtoolingBom(i);
                await create_log(
                    "process_routing_order_tooling_bom", 
                    postResult[0].process_routing_tooling_bom_id, // Adjusted assumption for correct ID key
                    user_id
                );
            }
        }

        // ==========================================
        // 3. SYNC DETAIL MACHINE
        // ==========================================
        const existingDetailmachineresult = await toolingService.getSingleprocessRoutingtoolingMachine(headerResult[0].process_routing_tooling_id);
        const existingmachineDetail_id = existingDetailmachineresult.map(i => i.process_routing_order_tooling_machine_id);
        const incomingmachineDetail_id = payload.detail_machine
            .filter(i => i.process_routing_order_tooling_machine_id)
            .map(i => i.process_routing_order_tooling_machine_id);
     
        // Delete Machines not present in the incoming payload
        const tomachineDelete = existingmachineDetail_id.filter(id => !incomingmachineDetail_id.includes(id));
        
        // FIX: changed "tobomDelete.length" to "tomachineDelete.length"
        if (tomachineDelete.length > 0) {
            // FIX: changed "toDelete" to "tomachineDelete"
            for (const i of tomachineDelete) {
                const item = { process_routing_order_tooling_machine_id: i };
                // FIX: changed service from Bom to Machine
                const toDeletemachineresult = await toolingService.deleteSingleprocessRoutingtoolingMachine(item);
                await delete_log(
                    "process_routing_order_tooling_machine", 
                    "process_routing_order_tooling_machine_id", 
                    toDeletemachineresult[0].process_routing_order_tooling_machine_id,
                    toDeletemachineresult[0].process_routing_order_tooling_machine_id, 
                    user_id 
                );
            }
        }

        // Upsert Machines (Update or Create)
        for (const item of payload.detail_machine) {
            const i = {
                process_routing_order_tooling_machine_id: item.process_routing_order_tooling_machine_id,
                process_routing_tooling_id: headerResult[0].process_routing_tooling_id,
                machine_id: item.machine_id,
                value: item.value
            };

            if (item.process_routing_order_tooling_machine_id && item.process_routing_order_tooling_machine_id !== "") {
                const beforemachineUpdate = await toolingService.getSingleprocessRoutingtoolingMachinebymachineid(i.process_routing_order_tooling_machine_id);
                const putResult = await toolingService.putSingleprocessRoutingtoolingMachine(i);
                await update_log(
                    "process_routing_order_tooling_machine", 
                    putResult[0], 
                    putResult[0].process_routing_order_tooling_machine_id, // FIX: Ensured correct ID key
                    beforemachineUpdate[0], 
                    putResult[0], 
                    user_id 
                );
            } else {
                const postResult = await toolingService.postSingleprocessRoutingtoolingMachine(i);
                await create_log(
                    "process_routing_order_tooling_machine", 
                    postResult[0].process_routing_order_tooling_machine_id, // FIX: Ensured correct ID key
                    user_id
                );
            }
        }

        // Commit Transaction
        await dbconnect.query('COMMIT');
        res.status(200).json({
            success: true,
            msg: `Update record successful for Tooling ID: ${payload.header.tooling_id}`, // FIX: mat_id -> tooling_id
        });

    } catch (error) {
        await dbconnect.query('ROLLBACK');
        console.error("Transaction Error: ", error);
        res.status(500).json({
            success: false,
            msg: 'มีปัญหาเกิดขึ้นระหว่างการบันทึกข้อมูล',
            error: error.message
        });
    }
};

module.exports = {
    getAllprocess_ordertooling,
    getSingleprocess_order_tooling,
    postSingleprocess_order_tooling_Controller,
    putSingleprocess_order_tooling_Controller


};
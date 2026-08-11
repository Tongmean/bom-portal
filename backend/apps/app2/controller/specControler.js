const Service = require('../service/specService')
const detailService = require('../service/specDetailservice')

const dbconnect = require('../../../middleWare/Dbconnect');
const { update_log, create_log, delete_log } = require('../utility/update_log'); 
const {createColumnDefs} = require('../utility/getColumn')
const { pivotERPData, pivotData } = require('../utility/pivotUltility');
const { leftJoin } = require('../utility/leftJoin') 

const getAllspecController = async (req, res) => {
    try {
        const headerResult = await Service.getAllspecHeaderservice();
        const detailResult = await detailService.getAllspecDetailservice();
        const itemResult = await detailService.getAllspecItemservice();
        // console.log("itemResult", itemResult);
        const pivotedDetailResult = pivotERPData(detailResult, ["spec_header_id"]);
        const pivotedItemResult = pivotData(itemResult, {
            groupBy: ['spec_header_id'],
            pivotColumnKey: 'component',
            pivotValueKey: 'detail'
        });
        // const pivetProcess_routing_order = pivotData(process_routing_order,{
        //     groupBy: ['process_routing_id'],
        //     pivotColumnKey: 'process',
        //     pivotValueKey: 'process_order'
        // }) 
        const step1 = leftJoin(headerResult, pivotedItemResult, 'spec_header_id', 'spec_header_id');
        // const finalResult = leftJoin(step1, pivotedItemResult, 'spec_header_id', 'spec_header_id');
        const finalResult = leftJoin(step1, pivotedDetailResult, 'spec_header_id', 'spec_header_id');
        // console.log("finalResult", finalResult);
        const columnDefs = createColumnDefs(finalResult);
        // console.log("headerResult", headerResult);
        // console.log("pivotedDetailResult", pivotedDetailResult)
        // console.log("pivotedItemResult", pivotedItemResult)
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: finalResult,
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


const getSinglespecController = async (req, res) => {
    // console.log("req.params.id", req.params.id);
    const id = Number(req.params.id);
    try {
        const getSingleheader = await Service.getSinglespecHeaderservice(id);
        const getSingledetail = await detailService.getSinglespecDetailbyheaderservice(id);
        const getSingleitem = await detailService.getSinglespecItembyheaderservice(id);
        const spec_header_ColumnDefs = (() => {
            const source = getSingleheader || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], required: true,option: false, type: 'text' };
            if (cols[2]) cols[2] = { ...cols[2], required: true,option: false , type: 'text' };
            if (cols[3]) cols[3] = { ...cols[3], required: true,option: false, type: 'text' };
            if (cols[4]) cols[4] = { ...cols[4], required: true, option: true, type: 'number', headerName: "customer" };
            if (cols[5]) cols[5] = { ...cols[5], required: true,option: false, type: 'text' };
            if (cols[6]) cols[6] = { ...cols[6], required: true, option: true, type: 'number' ,headerName: "channel"};
            if (cols[7]) cols[7] = { ...cols[7], required: true, option: true, type: 'number' ,headerName: "status"};
            if (cols[8]) cols[8] = { ...cols[8], required: true, option: true, type: 'number' ,headerName: "status_check"};
            if (cols[9]) cols[9] = { ...cols[9], required: false,option: false, type: 'text' };
            if (cols[10]) cols[10] = { ...cols[10], required: false,option: false, type: 'text' };
            return cols;
        })();
        const spec_detail_ColumnDefs = (() => {
            const source = getSingledetail || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], hidden: true };
            if (cols[2]) cols[2] = { ...cols[2], required: true, option: true, type: 'text' };
            if (cols[3]) cols[3] = { ...cols[3], required: true, option: true, type: 'number' };
            if (cols[4]) cols[4] = { ...cols[4], required: true, option: false, type: 'number' };


            return cols;
        })();
        const spec_item_ColumnDefs = (() => {
            const source = getSingleitem || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], hidden: true };
            if (cols[2]) cols[2] = { ...cols[2], required: true, option: true, type: 'text' };
            if (cols[3]) cols[3] = { ...cols[3], required: true,  type: 'text' };


            return cols;
        })();
        
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: {
                header: getSingleheader[0],
                details: getSingledetail,
                items: getSingleitem
            },
            columnDefs: {
                spec_header_ColumnDefs,
                spec_detail_ColumnDefs,
                spec_item_ColumnDefs
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

const postSingleheaderController = async (req, res) => {
    const user_id = req.user?.id || 1; // Fallback or auth middleware user id
    const { header, items, details } = req.body;

    // Validate request payload presence
    if (!header || !header.spec_code) {
        return res.status(400).json({
            success: false,
            msg: 'Invalid payload: Header data or spec_code is missing.'
        });
    }


    try {
        await dbconnect.query('BEGIN');

        // 1. Check for duplicate header code
        const checkDuplicate = await Service.checkDuplicate(header);
        if (checkDuplicate.length > 0) {
            await dbconnect.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                data: checkDuplicate[0],
                msg: `รหัสสินค้าสำเร็จรูป: ${header.spec_code} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }

        // 2. Insert Header
        const headerResult = await Service.postHeader(header);
        const headerId = headerResult[0].spec_header_id;

        // Log header creation
        if(headerId) {
            await create_log("sdpackaging_header", headerId, user_id);
        }

        // 3. Bulk Insert Details (Optimized: Single round-trip instead of loop)
        let insertedDetailsCount = 0;
        if (details && details.length > 0) {
            for (const detail of details) {
                const item = {
                    ...detail,
                    spec_header_id: headerId // Ensure each detail has the correct header ID
                } // Ensure each detail has the correct header ID
                const detailResults = await detailService.postDetail(item);
                insertedDetailsCount = detailResults.length;
                await create_log("spec_detail", headerId, user_id);
            }
           
        }

        // 4. Handle items array if applicable based on your sample payload
        if (items && items.length > 0) {
            for (const item of items) {
                const itemWithHeaderId = {
                    ...item,
                    spec_header_id: headerId // Ensure each item has the correct header ID
                };
                const itemResults = await detailService.postItem(itemWithHeaderId);
                await create_log("spec_item", headerId, user_id);
            }
        }

        await dbconnect.query('COMMIT');

        return res.status(200).json({
            success: true,
            msg: `Save record successful: ${header.spec_code}`,
            details_inserted: insertedDetailsCount
        });

    } catch (error) {
        await dbconnect.query('ROLLBACK');
        console.error('Transaction Error:', error);
        return res.status(500).json({
            success: false,
            msg: 'มีปัญหาเกิดขึ้นระหว่างการบันทึกข้อมูล',
            error: error.message
        });
    }
};


const putSingleheaderController = async (req, res) => {
    const payload = req.body;
    const user_id = req.user.id;

    try {
        // Start Transaction
        await dbconnect.query('BEGIN');

        // ==========================================
        // 1. UPDATE HEADER
        // ==========================================
        if (!payload.header || !payload.header.spec_header_id) {
            await dbconnect.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                msg: "กรุณาเพิ่มข้อมูล spec_header_id ก่อนบันทึก!" // Missing Header ID
            });
        }

        const beforeheaderUpdate = await Service.getSinglespecHeaderservice(payload.header.spec_header_id);
        const headerResult = await Service.putHeader(payload.header);
        
        // GUARD: Ensure the header actually updated before proceeding
        if (!headerResult || headerResult.length === 0) {
            throw new Error(`ไม่พบ Tooling ID: ${payload.header.spec_header_id} ในระบบ`); 
        }

        await update_log(
            "spec_header",
            headerResult[0],
            headerResult[0].spec_header_id,
            beforeheaderUpdate[0],
            headerResult[0],
            user_id
        );

        // ==========================================
        // 2. SYNC DETAIL BOM
        // ==========================================
        const detailsPayload = payload.details || []; // Defensive check to prevent crash if undefined
        const existingDetailresult = await detailService.getSinglespecDetailbyheaderservice(headerResult[0].spec_header_id);
        
        // FIX: Changed mapping from spec_header_id to spec_detail_id to prevent catastrophic deletion logic
        const existingDetail_id = existingDetailresult.map(i => i.spec_detail_id); 
        const incomingDetail_id = detailsPayload
            .filter(i => i.spec_detail_id)
            .map(i => i.spec_detail_id);
     
        // Delete BOMs not present in the incoming payload
        const tobomDelete = existingDetail_id.filter(id => !incomingDetail_id.includes(id));
        
        if (tobomDelete.length > 0) {
            for (const i of tobomDelete) {
                const item = { spec_detail_id : i };
                const toDeletebomresult = await detailService.deleteDetail(item);
                await delete_log(
                    "spec_detail", 
                    "spec_detail_id", 
                    toDeletebomresult[0].spec_detail_id,
                    toDeletebomresult[0].spec_detail_id, 
                    user_id
                );
            }
        }

        // Upsert BOMs (Update or Create)
        for (const item of detailsPayload) {
            const i = {
                spec_detail_id: item.spec_detail_id,
                spec_header_id: headerResult[0].spec_header_id,
                mat_id: item.mat_id,
                header_component: item.header_component,
                quantity: item.quantity
            };

            if (item.spec_detail_id && item.spec_detail_id !== "") {
                const beforebomUpdate = await detailService.getSinglespecDetail(i.spec_detail_id);
                const putResult = await detailService.putDetail(i);
                await update_log(
                    "spec_detail", 
                    putResult[0], 
                    putResult[0].spec_detail_id, 
                    beforebomUpdate[0], 
                    putResult[0], 
                    user_id 
                );
            } else {
                const postResult = await detailService.postDetail(i);
                await create_log(
                    "spec_detail", 
                    postResult[0].spec_detail_id, 
                    user_id
                );
            }
        }

        // ==========================================
        // 3. SYNC DETAIL MACHINE
        // ==========================================
        const itemsPayload = payload.items || []; // Defensive check
        const existingItemresult = await detailService.getSinglespecItembyheaderservice(headerResult[0].spec_header_id);
        const existingItemDetail_id = existingItemresult.map(i => i.spec_item_id);
        const incomingItem_id = itemsPayload
            .filter(i => i.spec_item_id)
            .map(i => i.spec_item_id);
     
        // Delete Machines not present in the incoming payload
        const toItemDelete = existingItemDetail_id.filter(id => !incomingItem_id.includes(id));
        
        if (toItemDelete.length > 0) {
            for (const i of toItemDelete) {
                const item = { spec_item_id: i };
                const toDeleteItemresult = await detailService.deleteItem(item);
                
                // FIX: Changed log target from spec_header_id to spec_item_id
                await delete_log(
                    "spec_item", 
                    "spec_item_id", 
                    toDeleteItemresult[0].spec_item_id,
                    toDeleteItemresult[0].spec_item_id, 
                    user_id 
                );
            }
        }

        // Upsert Machines (Update or Create)
        for (const item of itemsPayload) {
            const i = {
                spec_item_id : item.spec_item_id ,
                spec_header_id: headerResult[0].spec_header_id,
                header_component_item : item.header_component_item,
                detail: item.detail
            };

            if (item.spec_item_id && item.spec_item_id !== "") {
                const beforeitemUpdate = await detailService.getSinglespecItem(i.spec_item_id);
                const putResult = await detailService.putItem(i);
                await update_log(
                    "spec_item", 
                    putResult[0], 
                    putResult[0].spec_item_id, 
                    beforeitemUpdate[0], 
                    putResult[0], 
                    user_id 
                );
            } else {
                const postResult = await detailService.postItem(i);
                await create_log(
                    "spec_item", 
                    postResult[0].spec_item_id, 
                    user_id
                );
            }
        }

        // Commit Transaction
        await dbconnect.query('COMMIT');
        return res.status(200).json({
            success: true,
            msg: `Update record successful for Tooling ID: ${payload.header.spec_code}`,
        });

    } catch (error) {
        await dbconnect.query('ROLLBACK');
        console.error("Transaction Error: ", error);
        return res.status(500).json({
            success: false,
            msg: 'มีปัญหาเกิดขึ้นระหว่างการบันทึกข้อมูล',
            error: error.message
        });
    }
};

module.exports = {
   
    getAllspecController,
    getSinglespecController,
    postSingleheaderController,
    putSingleheaderController
};

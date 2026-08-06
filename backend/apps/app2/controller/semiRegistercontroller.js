const Service = require('../service/semiRegisterSeevice')
const matService = require('../service/m_matService')

const dbconnect = require('../../../middleWare/Dbconnect');
const { update_log, create_log, delete_log } = require('../utility/update_log'); 
const {createColumnDefs} = require('../utility/getColumn')


const getAllsemifgController = async (req, res) => {
    try {
        const getAllsemifgMat = await matService.getAllmat();
        const filterSemifg = getAllsemifgMat.filter(item => {
            return item.component && item.component.includes("SEMI");
        });
        
        let result = [];
        
        if (filterSemifg.length > 0) {
            // 🚀 OPTIMIZATION: Process all database queries at the exact same time
            const promises = filterSemifg.map(async (item) => {
                // This returns an ARRAY of rows
                const resultItems = await Service.getSinglebyparrent(item.erp);
                
                // 🛡️ SAFETY CHECK: If no data is found or empty array, return null
                if (!resultItems || resultItems.length === 0) return null; 

                // Map through the array of rows returned by the DB
                return resultItems.map(row => ({
                    bom_detail_id: row.bom_detail_id, // Fixed: changed from mat_id to bom_detail_id
                    semi_fg: row.semi_fg,
                    parent: row.parent,
                    child: row.child,
                    level: row.level,
                    quantity: row.quantity,
                    priority: row.priority,
                    total_qty: row.total_qty,
                    path: row.path
                }));
            });

            // Wait for all promises to finish resolving
            const rawResults = await Promise.all(promises);
            
            // Filter out any 'null' values and flatten the array of arrays into a single array
            result = rawResults.filter(item => item !== null).flat();
        }    
        
        console.log("filterSemifg", filterSemifg);
        console.log("result", result);
        
        const columnDefs = createColumnDefs(result);
        
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: result,
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
const getSinglesemifgController = async (req, res) => {
    try {
        const getSinglesemifg = await Service.getSingle(req.params.id);
        const bom_detail_ColumnDefs = (() => {
            const source = getSinglesemifg || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], required: true, option: true, type: 'number' };
            if (cols[2]) cols[2] = { ...cols[2], required: true, option: true, type: 'number' };
            if (cols[3]) cols[3] = { ...cols[3], required: true, option: false, type: 'number' };
            if (cols[4]) cols[4] = { ...cols[4], required: true, option: false, type: 'number' };
            // if (cols[5]) cols[5] = { ...cols[5], option: true, required: true };
            // if (cols[6]) cols[6] = { ...cols[6], option: true, required: true };
        
            return cols;
        })();
        
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: getSinglesemifg,
            columnDefs: bom_detail_ColumnDefs
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

const getAllbom_detailbyidController = async (req, res) => {
    console.log("req.body", req.body)
    try {
        const payload = req.body?.ids;

        if (!Array.isArray(payload)) {
            return res.status(400).json({
                success: false,
                msg: "payload must be an array"
            });
        }

        const results = [];

        for (let i = 0; i < payload.length; i++) {
            const id = payload[i];

            const result = await Service.getSingle(id);

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

const postArraysemifgController = async (req, res) => {
    const payload = req.body;
    const user_id = req.user.id;
    // {
    //     [
    //         {
    //             bom_detail_id: 1,
    //             parrent_mat_id: 1,
    //             child_mat_id: 2,
    //             quantity: 10,
    //             priority: 1
    //         }
    //     ]
    // }
    // console.log(payload, "payload");

    try {
        const postData = [];

        for (const item of payload) {
            // 1. Check if the record already exists in the database
            const isDuplicate = await Service.checkDuplicate(item);
                // console.log(isDuplicate, "isDuplicate");
            // 2. Post ONLY if it is NOT a duplicate
            if (!isDuplicate || isDuplicate.length === 0){
                const result = await Service.postBomdetail({
                    // bom_detail_id: item.bom_detail_id,
                    parrent_mat_id: item.parrent_mat_id,
                    child_mat_id: item.child_mat_id,
                    quantity: item.quantity,
                    priority: item.priority
                });

                if (result) {
                    // Assuming result[0].id is the newly created ID
                    postData.push(result[0].bom_detail_id); 
                    await create_log("bom_detail", result[0].bom_detail_id, user_id);
                }
            }
        }    

        // 3. Return success response
        res.status(200).json({
            success: true,
            msg: `Success! Inserted ${postData.length} new records. Duplicates were ignored.`,
            data: postData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'An error occurred while saving the data',
            error: error.message
        });
    }
};

const updateArrayController = async (req, res) => {
    // console.log("req.body", req.body)
    const user_id = req.user.id
    try {
        const payload = req?.body;

        if (!Array.isArray(payload)) {
            return res.status(400).json({
                success: false,
                msg: "payload must be an array"
            });
        }
        const results = [];

        for (let i = 0; i < payload.length; i++) {
            const old_Value = await Service.getSingle(payload[i].bom_detail_id);
            const result = await Service.putBomdetail(payload[i]);
            if (result?.length > 0) {
                results.push(result[0].bom_detail_id);
                const log = await  update_log("bom_detail", result[0], result[0].bom_detail_id, old_Value[0], result[0] , user_id)
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
    getAllsemifgController,
    postArraysemifgController,
    getAllbom_detailbyidController,
    getSinglesemifgController,
    updateArrayController
   

};

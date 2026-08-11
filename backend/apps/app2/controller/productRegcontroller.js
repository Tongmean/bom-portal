const Service = require('../service/productRegservice')
const matCateservice = require('../service/m_matDetailservice')
const matService = require('../service/m_matService')
const bomService = require('../service/semiRegisterSeevice')

// const detailService = require('../service/specDetailservice')

const dbconnect = require('../../../middleWare/Dbconnect');
const { update_log, create_log, delete_log } = require('../utility/update_log'); 
const {createColumnDefs} = require('../utility/getColumn')
const { pivotERPData, pivotData } = require('../utility/pivotUltility');
const { leftJoin } = require('../utility/leftJoin') 

const getAllproductRegController = async (req, res) => {
    try {
        const headerResult = await Service.getAllprodutReg();
        const detailResult = await Service.getAllprodutRegitem();
        const pivotedDetailResult = pivotData(detailResult, {
            groupBy: ['product_reg_id'],
            pivotColumnKey: 'component',
            pivotValueKey: 'optional_header'
        });
        const finalResult = leftJoin(headerResult, pivotedDetailResult, 'product_reg_id', 'product_reg_id');
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

const getSingleproductRegController = async (req, res) => {
    const id = req.params.id;
    try {
        const headerResult = await Service.getSingleprodutReg(id);
        const detailResult = await Service.getSingleprodutRegitembyregid(id);
        const matResult = await matService.getSinglemat(18);
        const initailmatResult = await matService.getSinglemat(headerResult[0].fg_mat_id);
        const mat_ColumnDefs = (() => {
            const source = matResult || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], required: true,option: false, type: 'text' };
            if (cols[2]) cols[2] = { ...cols[2], required: false,option: false , type: 'text' };
            if (cols[3]) cols[3] = { ...cols[3], required: false,option: false, type: 'text' };
            if (cols[4]) cols[4] = { ...cols[4], required: true, option: true, type: 'number', headerName: "status_check" };
            if (cols[5]) cols[5] = { ...cols[5], required: false,option: false, type: 'text' };
            return cols;
        })();
        const header_ColumnDefs = (() => {
            const source = headerResult || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], hidden: true };
            if (cols[2]) cols[2] = { ...cols[2], required: true, option: false , type: 'text' };
            if (cols[3]) cols[3] = { ...cols[3], required: false,option: false, type: 'text' };
            if (cols[4]) cols[4] = { ...cols[4], required: true, option: true, type: 'number' , headerName: "drawing_no"};
            if (cols[5]) cols[5] = { ...cols[5], required: true, option: true, type: 'number', headerName: "product_spec_no" };
            if (cols[6]) cols[6] = { ...cols[6], required: true, option: true, type: 'number' };
            if (cols[7]) cols[7] = { ...cols[7], required: true, option: false, type: 'number' };
            if (cols[8]) cols[8] = { ...cols[8], required: true, option: true, type: 'number' , headerName: "sdpackaging_no"};
            if (cols[9]) cols[9] = { ...cols[9], required: false, option: true, type: 'number' , headerName: "additional_form_no"};
            if (cols[10]) cols[10] = { ...cols[10], required: false, option: true, type: 'number' ,headerName: "certificate_no"};
            if (cols[11]) cols[11] = { ...cols[11], required: true, option: true, type: 'number' , headerName: "status" };
            if (cols[12]) cols[12] = { ...cols[12], required: false, option: false, type: 'text' };
            if (cols[13]) cols[13] = { ...cols[13], required: true, option: true, type: 'text' };
            return cols;
        })();
        const detail_ColumnDefs = (() => {
            const source = detailResult || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], hidden: true };
            if (cols[2]) cols[2] = { ...cols[2], required: true, option: true , type: 'text' , headerName: "Optional"};
            if (cols[3]) cols[3] = { ...cols[3], required: true,option: true, type: 'text' , headerName: "detail"};
            return cols;
        })();
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: {
                header_ColumnDefs: headerResult[0],
                detail_ColumnDefs: detailResult,
                mat_ColumnDefs: initailmatResult[0]
            },
            columnDefs: {
                mat_ColumnDefs:mat_ColumnDefs,
                header_ColumnDefs: header_ColumnDefs,
                detail_ColumnDefs: detail_ColumnDefs

            },
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
    const { header_ColumnDefs: header, detail_ColumnDefs: items, mat_ColumnDefs: mat } = req.body[0];
    const user_id = req.user.id;
    console.log("Received request body:", req.body[0]); // Debugging line to check the request body
    try {
        await dbconnect.query('BEGIN');

        // 1. Check Duplicate
        const checkDuplicate = await Service.checkDuplicate(header.production_code);
        if (checkDuplicate.length > 0) {
            // FIX: Must rollback before returning early!
            await dbconnect.query('ROLLBACK'); 
            return res.status(400).json({
                success: false,
                data: checkDuplicate,
                msg: `รหัสสินค้าสำเร็จรูป: ${header.production_code} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }

        // FIX: Declare matResult outside the if-block so it can be accessed later
        let matResult; 
        
        if (mat) {
            matResult = await matService.postMat(mat);
            if (matResult && matResult.length > 0) {
                const bomResult = await bomService.postBomdetail({
                    parrent_mat_id: matResult[0].mat_id,
                    child_mat_id: header.semi_mat_id,
                    quantity: 1,
                    priority: 1
                })
                await create_log("m_mat", matResult[0].mat_id, user_id);
                await create_log("bom_detail", bomResult[0].bom_detail_id, user_id);

            }
        }

        if (matResult && matResult[0]?.mat_id && header.production_type === 'LiningBrake') {
            const matCatresult = await matCateservice.postMatcat({ mat_id: matResult[0].mat_id, mat_cat: 'FG-Brake-Lining' });
            if (matCatresult && matCatresult.length > 0) {
                await create_log("m_mat_cat", matCatresult[0].mat_cat_id, user_id);
            }
        }

        // FIX: Ensure we have an ID to pass. If 'mat' wasn't passed, fallback to whatever is in the header
        const fg_mat_id = matResult ? matResult[0].mat_id : header.fg_mat_id; 

        // Insert product spec header
        const headerResult = await Service.postSingleheader(header, { fg_mat_id });
        
        if (headerResult && headerResult.length > 0) {
            await create_log("product_reg", headerResult[0].product_reg_id, user_id);
        }

        // Insert product spec detail
        const insertItems = [];
        
        // Optional safety check in case 'items' is empty/undefined
        if (items && items.length > 0) { 
            for (const i of items) {
                const item = {
                    option_header: i.option_header,
                    detail: i.detail,
                    product_reg_id: headerResult[0].product_reg_id
                };
                
                // FIX: Added missing 'await' 
                const itemsResults = await Service.postSingledetail(item); 
                insertItems.push(itemsResults[0].option_header);
                await create_log("productspec_detail", itemsResults[0].product_reg_option_id, user_id);
            }
        }

        await dbconnect.query('COMMIT');
        
        res.status(200).json({
            success: true,
            msg: `save record successfull: ${headerResult[0].production_code} && ${insertItems.join(",")}`,
            data: {
                // FIX: Grab production_code from the headerResult or header
                header: headerResult[0].production_code, 
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


const putSingleheaderController = async (req, res) => {
    // console.log("payload", payload)
    const user_id = req.user.id
    const { header_ColumnDefs: header, detail_ColumnDefs: items, mat_ColumnDefs: mat } = req.body[0];
    try {
        await dbconnect.query('BEGIN')
        if (!header) {
            await dbconnect.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                msg: "กรุณาเพิ่มข้อมูล Material ก่อนบันทึก!" // Please add Material data before saving!
            });
        }
        // 1. Update Header (Material)
        const beforeheaderUpdate = await Service.getSingleprodutReg(header.product_reg_id);
        const headerResult = await Service.putSingleheader(header);
        
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
    getAllproductRegController,
    getSingleproductRegController,
    postSingleheaderController
    
};

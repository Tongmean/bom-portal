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
        const initailmatResult = (await matService.getSinglemat(headerResult[0].fg_mat_id)).map(i=>({
            ...i,
            status_check_id: Number(i.status_check_id)
        }));
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


// const postSingleheaderController = async (req, res) => {
//     const { header_ColumnDefs: header, detail_ColumnDefs: items, mat_ColumnDefs: mat } = req.body[0];
//     const user_id = req.user.id;
//     console.log("Received request body:", req.body[0]); // Debugging line to check the request body
//     try {
//         await dbconnect.query('BEGIN');

//         // 1. Check Duplicate
//         const checkDuplicate = await Service.checkDuplicate(header.production_code);
//         if (checkDuplicate.length > 0) {
//             // FIX: Must rollback before returning early!
//             await dbconnect.query('ROLLBACK'); 
//             return res.status(400).json({
//                 success: false,
//                 data: checkDuplicate,
//                 msg: `รหัสสินค้าสำเร็จรูป: ${header.production_code} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
//             });
//         }

//         // FIX: Declare matResult outside the if-block so it can be accessed later
//         let matResult; 
        
//         if (mat) {
//             matResult = await matService.postMat(mat);
//             if (matResult && matResult.length > 0) {
//                 const bomResult = await bomService.postBomdetail({
//                     parrent_mat_id: matResult[0].mat_id,
//                     child_mat_id: header.semi_mat_id,
//                     quantity: 1,
//                     priority: 1
//                 })
//                 await create_log("m_mat", matResult[0].mat_id, user_id);
//                 await create_log("bom_detail", bomResult[0].bom_detail_id, user_id);

//             }
//         }

//         if (matResult && matResult[0]?.mat_id && header.production_type === 'LiningBrake') {
//             const matCatresult = await matCateservice.postMatcat({ mat_id: matResult[0].mat_id, mat_cat: 'FG-Brake-Lining' });
//             if (matCatresult && matCatresult.length > 0) {
//                 await create_log("m_mat_cat", matCatresult[0].mat_cat_id, user_id);
//             }
//         }

//         // FIX: Ensure we have an ID to pass. If 'mat' wasn't passed, fallback to whatever is in the header
//         const fg_mat_id = matResult ? matResult[0].mat_id : header.fg_mat_id; 

//         // Insert product spec header
//         const headerResult = await Service.postSingleheader(header, { fg_mat_id });
        
//         if (headerResult && headerResult.length > 0) {
//             await create_log("product_reg", headerResult[0].product_reg_id, user_id);
//         }

//         // Insert product spec detail
//         const insertItems = [];
        
//         // Optional safety check in case 'items' is empty/undefined
//         if (items && items.length > 0) { 
//             for (const i of items) {
//                 const item = {
//                     option_header: i.option_header,
//                     detail: i.detail,
//                     product_reg_id: headerResult[0].product_reg_id
//                 };
                
//                 // FIX: Added missing 'await' 
//                 const itemsResults = await Service.postSingledetail(item); 
//                 insertItems.push(itemsResults[0].option_header);
//                 await create_log("productspec_detail", itemsResults[0].product_reg_option_id, user_id);
//             }
//         }

//         await dbconnect.query('COMMIT');
        
//         res.status(200).json({
//             success: true,
//             msg: `save record successfull: ${headerResult[0].production_code} && ${insertItems.join(",")}`,
//             data: {
//                 // FIX: Grab production_code from the headerResult or header
//                 header: headerResult[0].production_code, 
//                 items: insertItems
//             }
//         });

//     } catch (error) {
//         await dbconnect.query('ROLLBACK');
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             msg: 'มีปัญหาเกิดขึ้นระหว่างการดึงข้อมูล',
//             error: error.message
//         });
//     }
// };


const postSingleheaderController = async (req, res) => {
    const { header_ColumnDefs: header, detail_ColumnDefs: items, mat_ColumnDefs: mat } = req.body[0];
    const user_id = req.user.id;
    console.log("Received request body:", req.body[0]); // Debugging line to check the request body
    
    try {
        await dbconnect.query('BEGIN');

        // 1. Check Duplicate
        const checkDuplicate = await Service.checkDuplicate(header.production_code);
        if (checkDuplicate.length > 0) {
            await dbconnect.query('ROLLBACK'); 
            return res.status(400).json({
                success: false,
                data: checkDuplicate,
                msg: `รหัสสินค้าสำเร็จรูป: ${header.production_code} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
            });
        }

        let matResult; 
        
        // 2. Handle Material (mat) and BOM Creation
        if (mat) {
            const checkDuplicateMat = await matService.checkDuplicate(mat.erp);
            if(checkDuplicateMat.length > 0) {
                matResult = checkDuplicateMat[0].mat_id; // Use existing material if duplicate found
            }else{
                matResult = await matService.postMat(mat);
            }
            
            if (matResult && matResult.length > 0) {
                await create_log("m_mat", matResult[0].mat_id, user_id);

                // GUARD: Only post BOM if semi_mat_id actually exists
                if (header.semi_mat_id) {
                    const bomResult = await bomService.postBomdetail({
                        parrent_mat_id: matResult[0].mat_id,
                        child_mat_id: header.semi_mat_id,
                        quantity: 1,
                        priority: 1
                    });
                    
                    if (bomResult && bomResult.length > 0) {
                        await create_log("bom_detail", bomResult[0].bom_detail_id, user_id);
                    }
                }
            }
        }

        // 3. Map Production Type to Material Category
        const productionTypeToMatCat = {
            'LiningBrake': 'FG-Brake-Lining',
            'DiscBrake': 'FG-Brake-Shoes',
            'DiscBrake': 'FG-Brake-Disc'
        };

        const targetMatCat = productionTypeToMatCat[header.production_type];

        // 4. Handle Material Category Creation
        if (matResult && matResult[0]?.mat_id && targetMatCat) {
            const matCatresult = await matCateservice.postMatcat({ 
                mat_id: matResult[0].mat_id, 
                mat_cat: targetMatCat 
            });
            
            if (matCatresult && matCatresult.length > 0) {
                await create_log("m_mat_cat", matCatresult[0].mat_cat_id, user_id);
            }
        }

        // Ensure we have an ID to pass. If 'mat' wasn't passed, fallback to whatever is in the header
        const fg_mat_id = matResult ? matResult[0].mat_id : header.fg_mat_id; 

        // 5. Insert product spec header
        const headerResult = await Service.postSingleheader(header, { fg_mat_id });
        
        if (!headerResult || headerResult.length === 0) {
            throw new Error(`ไม่สามารถสร้าง Header Product Spec ได้`);
        }
        
        await create_log("product_reg", headerResult[0].product_reg_id, user_id);

        // 6. Insert product spec details
        const insertItems = [];
        
        if (items && items.length > 0) { 
            for (const i of items) {
                const item = {
                    option_header: i.option_header,
                    detail: i.detail,
                    product_reg_id: headerResult[0].product_reg_id
                };
                
                const itemsResults = await Service.postSingledetail(item); 
                
                if (itemsResults && itemsResults.length > 0) {
                    insertItems.push(itemsResults[0].option_header);
                    await create_log("productspec_detail", itemsResults[0].product_reg_option_id, user_id);
                }
            }
        }

        await dbconnect.query('COMMIT');
        
        res.status(200).json({
            success: true,
            msg: `save record successfull: ${headerResult[0].production_code} && ${insertItems.join(",")}`,
            data: {
                header: headerResult[0].production_code, 
                items: insertItems
            }
        });

    } catch (error) {
        await dbconnect.query('ROLLBACK');
        console.error("Transaction Error:", error);
        res.status(500).json({
            success: false,
            msg: 'มีปัญหาเกิดขึ้นระหว่างการบันทึกข้อมูล',
            error: error.message
        });
    }
};

const putSingleheaderController = async (req, res) => {
    const user_id = req.user.id;
    const { header_ColumnDefs: header, detail_ColumnDefs: detail, mat_ColumnDefs: mat } = req.body[0];

    try {
        await dbconnect.query('BEGIN');

        if (!header) {
            await dbconnect.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                msg: "กรุณาเพิ่มข้อมูล Material ก่อนบันทึก!" // Please add Material data before saving!
            });
        }

        // 0. Update Material (mat)
        if (mat) {
            const beforeMatUpdate = await matService.getSinglemat(mat.mat_id);
            const matResult = await matService.putMat(mat);
            
            if (matResult && matResult.length > 0) {
                await update_log(
                    "m_mat",
                    matResult[0],
                    matResult[0].mat_id,
                    beforeMatUpdate[0], 
                    matResult[0],
                    user_id
                );
            }

            // Map the production types to their corresponding material categories
            const productionTypeToMatCat = {
                'LiningBrake': 'FG-Brake-Lining',
                'ShoesBrake': 'FG-Brake-Shoes',
                'DiscBrake': 'FG-Brake-Disc'
            };

            // Look up the category based on the incoming production_type
            const targetMatCat = productionTypeToMatCat[header.production_type];

            // If matResult is valid AND the production_type exists in our map, proceed
            if (matResult && matResult[0]?.mat_id && targetMatCat) {
                const beforeMatCatUpdate = await matCateservice.getSinglematCat(matResult[0].mat_id);
                
                const matCatresult = await matCateservice.putMatcat({ 
                    mat_id: matResult[0].mat_id, 
                    mat_cat: targetMatCat 
                });
                
                if (matCatresult && matCatresult.length > 0) {
                    await update_log(
                        "m_mat_cat",
                        matCatresult[0],
                        matCatresult[0].mat_cat_id,
                        beforeMatCatUpdate[0], 
                        matCatresult[0],
                        user_id
                    );
                }
            } 

            if (header.semi_mat_id) {
                const beforeBomUpdate = await bomService.getSinglebyfg(matResult[0].mat_id);
                const bomResult = await bomService.putBomdetail({
                    parrent_mat_id: matResult[0].mat_id,
                    child_mat_id: header.semi_mat_id,
                    quantity: 1,
                    priority: 1,
                    bom_detail_id: beforeBomUpdate[0].bom_detail_id  // Assuming you want to update the existing BOM detail
                });

                if (bomResult && bomResult.length > 0) {
                    await update_log(
                        "bom_detail",
                        bomResult[0],
                        bomResult[0].bom_detail_id,
                        beforeBomUpdate[0], 
                        bomResult[0],
                        user_id
                    );
                }
            }
        }

        // 1. Update Header (Product Reg)
        const beforeheaderUpdate = await Service.getSingleprodutReg(header.product_reg_id);
        const headerResult = await Service.putSingleheader(header, { fg_mat_id: mat?.mat_id });

        // GUARD: Ensure the main material actually updated before proceeding
        if (!headerResult || headerResult.length === 0) {
            throw new Error(`ไม่พบ Material ID: ${header.production_code} ในระบบ`);
        }

        await update_log(
            "product_reg",
            headerResult[0],
            headerResult[0].product_reg_id,
            beforeheaderUpdate[0],
            headerResult[0],
            user_id
        );

        // 2-5. Handle Detail Deletions
        const existingDetailresult = await Service.getSingleprodutRegitembyregid(headerResult[0].product_reg_id);
        const existingDetail_id = existingDetailresult.map(i => i.product_reg_item);
        const incomingDetail_id = detail.filter(i => i.product_reg_item).map(i => i.product_reg_item);

        const toDelete = existingDetail_id.filter(id => !incomingDetail_id.includes(id));

        if (toDelete.length > 0) {
            for (const id of toDelete) {
                const toDeleteresult = await Service.deleteSingledetail(id);
                
                // GUARD: Check if delete was successful to avoid reading [0] of undefined
                if (toDeleteresult && toDeleteresult.length > 0) {
                    await delete_log(
                        "product_reg_option_id", 
                        "product_reg_item", 
                        toDeleteresult[0].product_reg_option_id, 
                        toDeleteresult[0].product_reg_option_id, 
                        user_id
                    );
                }
            }
        }

        // 6. Handle Detail Inserts/Updates
        for (const item of detail) {
            const i = {
                product_reg_option_id: item.product_reg_option_id,
                product_reg_id: headerResult[0].product_reg_id,
                option_header: item.option_header,
                detail: item.detail
            };

            if (item.product_reg_option_id && item.product_reg_option_id !== "") {
                const beforeDelete = await Service.getSingleprodutRegitem(i.product_reg_option_id);
                const putResult = await Service.putSingledetail(i);
                
                if (putResult && putResult.length > 0) {
                    await update_log(
                        "product_reg_item", 
                        putResult[0], 
                        putResult[0].product_reg_option_id,
                        beforeDelete[0], 
                        putResult[0], 
                        user_id
                    );
                }
            } else {
                const postResult = await Service.postSingleProcessRoutingOrder(i);
                
                if (postResult && postResult.length > 0) {
                    await create_log(
                        "product_reg_item", 
                        postResult[0].product_reg_option_id, 
                        user_id
                    );
                }
            }
        }

        await dbconnect.query('COMMIT');
        
        res.status(200).json({
            success: true,
            msg: `Update record successfull: ${header.production_code}`
        });

    } catch (error) {
        await dbconnect.query('ROLLBACK');
        console.error("Transaction Error:", error);
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
    postSingleheaderController,
    putSingleheaderController
    
};

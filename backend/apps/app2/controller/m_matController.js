const Service = require('../service/m_matService')
const detailService = require('../service/m_matDetailservice')
const { update_log, create_log, delete_log } = require('../utility/update_log'); 
const fs = require('fs');
const path = require("path");
const { uploadDir } = require("../middleware/matFilemiddleware");
const dbconnect = require('../../../middleWare/Dbconnect');
//mat
const getAllmatController = async (req, res) => {
    try {
        const result = await Service.getAllmat()        
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
const getSinglematController = async (req, res) => {
    try {
        const result = await Service.getSinglemat(req.params.id)    
        const mappedResult = result.map(item => ({mat_id:item.mat_id,erp: item.erp, name: item.name, id: item.id, mat_id: item.mat_id, status_check_id: Number(item.status_check_id), revision: item.revision}));    
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: mappedResult
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
//     // console.log("payload", payload)
//     const user_id = req.user.id
//     const payload = req.body;
//     const file = req.file;
//     // console.log("req.body", req.body)
//     // {
//     //     "erp": "fgfdd",
//     //     "name": "Dust_Collection_1",
//     //     "id": "55",
//     //     "mat_cat": [
//     //         {
//     //             "mat_cat": "foam"
//     //         }
//     //     ],
//     //     "mat_unit": [
//     //         {
//     //             "weight": 55,
//     //             "costperunit": 55
//     //         }
//     //     ],
//     //     "mat_dimension": [
//     //         {
//     //             "height": 55,
//     //             "width": 55,
//     //             "thick": 55,
//     //             "curve": 55,
//     //             "area": 55
//     //         }
//     //     ],
//     //     "mat_file": [
//     //         {
//     //             "file": {
//     //                 "uid": "rc-upload-1783481383865-4"
//     //             }
//     //         }
//     //     ]
//     // }
//     console.log("payload", payload)
//     console.log("file", file)
//     // console.log("file2", payload.mat_file)

//     try {
//         await dbconnect.query('BEGIN')
//         const headerResult = []
//         if(!payload.mat || payload.mat.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 msg: 'กรุณาเพิ่มข้อมูลสินค้าสำเร็จรูปก่อนบันทึก!'
//             });
//         }
//         if(payload.mat.length > 0) {
//             for(const i of payload.mat) {
//                 const checkDuplicate = await Service.checkDuplicate(i.erp)
//                 if (checkDuplicate.length > 0) {
//                     return res.status(400).json({
//                         success: false,
//                         data: checkDuplicate[0],
//                         msg: `รหัสสินค้าสำเร็จรูป: ${i.erp} มีในฐานข้อมูลอยู่แล้ว กรุณาลองรหัสใหม่!`
//                     });
//                 }
//                 const result = await Service.postMat(i)
//                 headerResult.push(result[0])
//                 await create_log("m_mat", result[0].mat_id, user_id)
//             }
//         }
//         //isert product spec detail
//         if(payload.mat_cat && payload.mat_cat.length > 0) {
//             for(const i of payload.mat_cat) {
//                 const item = {
//                     mat_id: headerResult[0].mat_id,
//                     mat_cat: i.mat_cat
//                 }
//                 const itemsResults = await detailService.postMatcat(item)
//                 console.log("itemsResults", itemsResults[0])
//                 await create_log("m_mat_cat", itemsResults[0].mat_id, user_id)
//             }
//         }
//         if(payload.mat_unit && payload.mat_unit.length > 0) {
//             for(const i of payload.mat_unit) {
//                 const item = {
//                     mat_id: headerResult[0].mat_id,
//                     weight: i.weight,
//                     costperunit: i.costperunit
//                 }
//                 const itemsResults = await detailService.postMatunit(item)
//                 console.log("itemsResults", itemsResults[0])
//                 await create_log("m_mat_unit", itemsResults[0].mat_id, user_id)
//             }
//         }
//         if(payload.mat_dimension && payload.mat_dimension.length > 0) {
//             for(const i of payload.mat_dimension) {
//                 const item = {
//                     mat_id: headerResult[0].mat_id,
//                     height: i.height,
//                     width: i.width,
//                     thick: i.thick,
//                     curve: i.curve,
//                     area: i.area
//                 }
//                 const itemsResults = await detailService.postMatdimension(item)
//                 console.log("itemsResults", itemsResults[0])
//                 await create_log("m_mat_dimension", itemsResults[0].mat_id, user_id)
//             }
//         }
//         if(file){
//             const { filename, originalname, path: filePath } = file;
//             const encodedOriginalName = Buffer.from(originalname, 'latin1').toString('utf8').replace(/\s+/g, '_').replace(/[^\w\-_.ก-๙]/g, '');

//             const item = {
//                 mat_id: headerResult[0].mat_id,
//                 file_name: file.encodedOriginalName,
//                 path: filePath
//             }
//             const itemsResults = await detailService.postMatfile(item)
//             console.log("itemsResults", itemsResults[0])
//             await create_log("m_mat_file", itemsResults[0].mat_id, user_id)
//         }
//         await dbconnect.query('COMMIT');
//         res.status(200).json({
//             success: true,
//             msg: `save record successfull: ${headerResult.erp} -- ${headerResult.name} }`,
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


const postSingleheaderController = async (req, res) => {
    const user_id = req.user.id;
    // const payload = req.body;
    const payload = {
        mat: JSON.parse(req.body.mat || "{}"),
        mat_cat: JSON.parse(req.body.mat_cat || "[]"),
        mat_unit: JSON.parse(req.body.mat_unit || "[]"),
        mat_dimension: JSON.parse(req.body.mat_dimension || "[]"),
    };
    const file = req.file;

    // console.log("payload", payload);
    // // console.log("JSON.parse(payload)", JSON.parse(payload));
    // console.log("file", file);

    try {
        await dbconnect.query("BEGIN");


        if (!payload.mat) {
            await dbconnect.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                msg: "กรุณาเพิ่มข้อมูล Material ก่อนบันทึก!"
            });
        }

        // Header
       // Read as: "If the category is NOT included in this list of molds..."
       // 1. Safely extract the actual category string from the array
        const currentCategory = payload.mat_cat?.[0]?.mat_cat; 

        // 2. Check if the category is NOT one of our mold types
        if (!["Mold-Press", "Mold-HotPress"].includes(currentCategory)) {
            
            const checkDuplicate = await Service.checkDuplicate(payload.mat.erp);

            if (checkDuplicate.length > 0) {
                await dbconnect.query("ROLLBACK");

                return res.status(400).json({
                    success: false,
                    data: checkDuplicate[0],
                    msg: `ERP : ${payload.mat.erp} มีอยู่ในระบบแล้ว`
                });
            }
        }
            
       
        console.log("payload.mat", payload.mat);
        const result = await Service.postMat(payload.mat);
        console.log("result", result);
        // headerResult.push(result[0]);

        await create_log(
            "m_mat",
            result[0].mat_id,
            user_id
        );

        const mat_id = result[0].mat_id;

        // Category
        if (
            Array.isArray(payload.mat_cat) &&
            payload.mat_cat.length > 0
        ) {
            for (const item of payload.mat_cat) {
                const result =
                    await detailService.postMatcat({
                        mat_id,
                        mat_cat: item.mat_cat
                    });

                await create_log(
                    "m_mat_cat",
                    result[0].mat_id,
                    user_id
                );
            }
        }

        // Unit
        if (
            Array.isArray(payload.mat_unit) &&
            payload.mat_unit.length > 0
        ) {
            for (const item of payload.mat_unit) {
                const result =
                    await detailService.postMatunit({
                        mat_id,
                        weight: item.weight,
                        costperunit: item.costperunit
                    });

                await create_log(
                    "m_mat_unit",
                    result[0].mat_id,
                    user_id
                );
            }
        }

        // Dimension
        if (
            Array.isArray(payload.mat_dimension) &&
            payload.mat_dimension.length > 0
        ) {
            // for (const item of payload.mat_dimension) {
            //     const result =
            //         await detailService.postMatdimension({
            //             mat_id,
            //             height: item.height,
            //             width: item.width,
            //             thick: item.thick,
            //             curve: item.curve,
            //             area: item.area,
            //             min_thick: item.min_thick,
            //             max_thick: item.max_thick,
            //             cavity: item.cavity,
            //             outer_dia: item.outer_dia

            //         });

            //     await create_log(
            //         "m_mat_dimension",
            //         result[0].mat_id,
            //         user_id
            //     );
            // }
            for (const item of payload.mat_dimension) {

                const hasData = [
                    item.height,
                    item.width,
                    item.thick,
                    item.curve,
                    item.area,
                    item.min_thick,
                    item.max_thick,
                    item.cavity,
                    item.outer_dia
                ].some(v => v !== null && v !== undefined && String(v).trim() !== "");
            
                if (!hasData) {
                    continue;
                }
            
                const result = await detailService.postMatdimension({
                    mat_id,
                    height: item.height,
                    width: item.width,
                    thick: item.thick,
                    curve: item.curve,
                    area: item.area,
                    min_thick: item.min_thick,
                    max_thick: item.max_thick,
                    cavity: item.cavity,
                    outer_dia: item.outer_dia
                });
            
                await create_log(
                    "m_mat_dimension",
                    result[0].mat_id,
                    user_id
                );
            }
        }

        // File
        if (file) {
            const {
                originalname,
                path: filePath
            } = file;

            const encodedOriginalName = Buffer.from(
                originalname,
                "latin1"
            )
                .toString("utf8")
                .replace(/\s+/g, "_")
                .replace(/[^\w\-_.ก-๙]/g, "");

            const result =
                await detailService.postMatfile({
                    mat_id,
                    file_name: encodedOriginalName,
                    path: filePath
                });

            await create_log(
                "m_mat_file",
                result[0].mat_id,
                user_id
            );
        }

        await dbconnect.query("COMMIT");

        return res.status(200).json({
            success: true,
            data: result,
            msg: `Save record successful : ${result[0].erp} - ${result[0].name}`
        });

    } catch (error) {
        await dbconnect.query("ROLLBACK");

        console.error(error);

        return res.status(500).json({
            success: false,
            msg: "มีปัญหาเกิดขึ้นระหว่างการบันทึกข้อมูล",
            error: error.message
        });
    }
};
//
// const putSingleheaderController = async (req, res) => {
//     const user_id = req.user.id;
//     // const payload = req.body;
//     const payload = {
//         mat: JSON.parse(req.body.mat || "{}"),
//         mat_cat: JSON.parse(req.body.mat_cat || "[]"),
//         mat_unit: JSON.parse(req.body.mat_unit || "[]"),
//         mat_dimension: JSON.parse(req.body.mat_dimension || "[]"),
//     };
//     const file = req.file;

//     console.log("payload", payload);
//     console.log("payload mat matid", payload.mat.mat_id);
//     // console.log("JSON.parse(payload)", JSON.parse(payload));
//     console.log("file", file);

//     try {
//         await dbconnect.query("BEGIN");


//         if (!payload.mat) {
//             await dbconnect.query("ROLLBACK");

//             return res.status(400).json({
//                 success: false,
//                 msg: "กรุณาเพิ่มข้อมูล Material ก่อนบันทึก!"
//             });
//         }
//         console.log("payload.mat", payload.mat);
//         const beforeUpdate = await Service.getSinglemat(payload.mat.mat_id);
//         const result = await Service.putMat(payload.mat);
//         console.log("result", result);
//         // headerResult.push(result[0]);

//         await update_log(
//             "m_mat",
//             result[0],
//             result[0].mat_id,
//             beforeUpdate[0],
//             result[0],
//             user_id
//         );

//         const mat_id = result[0].mat_id;

//         // Category
//         if (
//             Array.isArray(payload.mat_cat) &&
//             payload.mat_cat.length > 0
//         ) {
//             for (const item of payload.mat_cat) {
//                 const beforeUpdate = await detailService.getSinglematCat(item.mat_id);
//                 const result =
//                     await detailService.putMatcat({
//                         mat_id: payload.mat.mat_id,
//                         mat_cat: item.mat_cat
//                     });

//                 await update_log(
//                     "m_mat_cat",
//                     result[0],
//                     result[0].mat_id,
//                     beforeUpdate[0],
//                     result[0],
//                     user_id
//                 );
//             }
//         }

//         // Unit
//         if (
//             Array.isArray(payload.mat_unit) &&
//             payload.mat_unit.length > 0
//         ) {
//             for (const item of payload.mat_unit) {
//                 const beforeUpdate = await detailService.getSinglematUnit(payload.mat.mat_id);
//                 const result =
//                     await detailService.putMatunit({
//                         mat_id: payload.mat.mat_id,
//                         weight: item.weight,
//                         costperunit: item.costperunit
//                     });
//                     console.log("result", result);
                
//                 if (result && result.length > 0) {
//                     await update_log(
//                         "m_mat_unit",
//                         result[0],
//                         result[0].mat_id,
//                         beforeUpdate[0],
//                         result[0],
//                         user_id
//                     );
//                 } else {
//                     // Optional: Handle the case where the record wasn't found
//                     console.warn(`No record found in m_mat_unit for mat_id: ${payload.mat.mat_id}`);
//                 }
                
//             }
//         }

//         // Dimension
//         if (
//             Array.isArray(payload.mat_dimension) &&
//             payload.mat_dimension.length > 0
//         ) {
//             for (const item of payload.mat_dimension) {
//                 const beforeUpdate = await detailService.getSinglematDimension(payload.mat.mat_id);
//                 const result =
//                     await detailService.putMatdimension({
//                         mat_id: payload.mat.mat_id,
//                         height: item.height,
//                         width: item.width,
//                         thick: item.thick,
//                         curve: item.curve,
//                         area: item.area
//                     });

//                 await update_log(
//                     "m_mat_dimension",
//                     result[0],
//                     result[0].mat_id,
//                     beforeUpdate[0],
//                     result[0],
//                     user_id
//                 );
//             }
//         }

//         // File
//         if (file) {
//             const {
//                 originalname,
//                 path: filePath
//             } = file;

//             const encodedOriginalName = Buffer.from(
//                 originalname,
//                 "latin1"
//             )
//                 .toString("utf8")
//                 .replace(/\s+/g, "_")
//                 .replace(/[^\w\-_.ก-๙]/g, "");
//             const beforeUpdate = await detailService.getSinglematfile(mat_id);
//             if (beforeUpdate?.[0]?.file) {
//                 const oldFilepath = path.join(
//                     uploadDir,
//                     beforeUpdate[0].file
//                 );
            
//                 if (fs.existsSync(oldFilepath)) {
//                     try {
//                         fs.unlinkSync(oldFilepath);
//                         console.log("✅ Deleted old file:", oldFilepath);
//                     } catch (err) {
//                         console.error("❌ Error deleting old file:", oldFilepath, err);
//                     }
//                 } else {
//                     console.log("⚠️ File not found:", oldFilepath);
//                 }
//             }
//             const result =
//                 await detailService.putMatfile({
//                     mat_id,
//                     file_name: encodedOriginalName,
//                     path: filePath
//                 });

//             await update_log(
//                 "m_mat_file",
//                 result[0],
//                 result[0].mat_id,
//                 beforeUpdate[0],
//                 result[0],
//                 user_id
//             );
//         }

//         await dbconnect.query("COMMIT");

//         return res.status(200).json({
//             success: true,
//             data: result,
//             msg: `Save record successful : ${result[0].erp} - ${result[0].name}`
//         });

//     } catch (error) {
//         await dbconnect.query("ROLLBACK");

//         console.error(error);

//         return res.status(500).json({
//             success: false,
//             msg: "มีปัญหาเกิดขึ้นระหว่างการบันทึกข้อมูล",
//             error: error.message
//         });
//     }
// };
// //



const deleteSingleheaderController = async (req, res) => {
    const user_id = req.user.id;
    const payload = req.body;

    console.log("payload", payload);

    try {
        // 1. Start Transaction
        await dbconnect.query("BEGIN");
        
        // 2. Renamed to prevent variable shadowing issues inside the loop
        const deletedMatIds = []; 

        for (const item of payload) {
            // Fetch existing records
            const beforeDeletemat = await Service.getSinglemat(item.mat_id);
            const beforeDeletematcat = await detailService.getSinglematCat(item.mat_id);
            const beforeDeletematdimension = await detailService.getSinglematDimension(item.mat_id);
            const beforeDeletematunit = await detailService.getSinglematUnit(item.mat_id);
            const beforeDeletematfile = await detailService.getSinglematfile(item.mat_id);

            // 3. Added `.length > 0` checks to prevent crashes if DB returns an empty array []
            if (beforeDeletemat && beforeDeletemat.length > 0) {
                await Service.deleteMat(item);
                await delete_log("m_mat", item.mat_id, beforeDeletemat[0].mat_id, user_id);
                deletedMatIds.push(beforeDeletemat[0].mat_id); // Pushing to the correctly scoped array
            }

            if (beforeDeletematcat && beforeDeletematcat.length > 0) {
                await detailService.deleteMatcat(item);
                await delete_log("m_mat_cat", item.mat_id, beforeDeletematcat[0].mat_id, user_id);
            }

            if (beforeDeletematdimension && beforeDeletematdimension.length > 0) {
                await detailService.deleteMatDimension(item);
                await delete_log("m_mat_dimension", item.mat_id, beforeDeletematdimension[0].mat_id, user_id);
            }

            if (beforeDeletematunit && beforeDeletematunit.length > 0) {
                await detailService.deleteMatunit(item);
                await delete_log("m_mat_unit", item.mat_id, beforeDeletematunit[0].mat_id, user_id);
            }

            if (beforeDeletematfile && beforeDeletematfile.length > 0) {
                await detailService.deleteMatfile(item);
                await delete_log("m_mat_file", item.mat_id, beforeDeletematfile[0].mat_id, user_id);
                
                // Delete file from server
                if (beforeDeletematfile[0].file) {
                    const oldFilepath = path.join(
                        uploadDir, // Note: Ensure uploadDir is defined in your file scope
                        beforeDeletematfile[0].file
                    );
                
                    if (fs.existsSync(oldFilepath)) {
                        try {
                            fs.unlinkSync(oldFilepath);
                            console.log("✅ Deleted old file:", oldFilepath);
                        } catch (err) {
                            console.error("❌ Error deleting old file:", oldFilepath, err);
                        }
                    } else {
                        console.log("⚠️ File not found:", oldFilepath);
                    }
                }
            }
        }

        // 4. Commit Transaction
        await dbconnect.query("COMMIT");

        return res.status(200).json({
            success: true,
            data: deletedMatIds,
            msg: `Delete record successful : ${deletedMatIds.join(",")}` // Will now properly format: "1,2,3"
        });

    } catch (error) {
        // 5. Rollback on any failure
        await dbconnect.query("ROLLBACK");

        console.error("Transaction failed, rolling back. Error:", error);

        return res.status(500).json({
            success: false,
            msg: "มีปัญหาเกิดขึ้นระหว่างการบันทึกข้อมูล",
            error: error.message
        });
    }
};



const putSingleheaderController = async (req, res) => {
    const user_id = req.user.id;
    const payload = {
        mat: JSON.parse(req.body.mat || "{}"),
        mat_cat: JSON.parse(req.body.mat_cat || "[]"),
        mat_unit: JSON.parse(req.body.mat_unit || "[]"),
        mat_dimension: JSON.parse(req.body.mat_dimension || "[]"),
    };
    const file = req.file;

    try {
        await dbconnect.query("BEGIN");

        if (!payload.mat || !payload.mat.mat_id) {
            await dbconnect.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                msg: "กรุณาเพิ่มข้อมูล Material ก่อนบันทึก!" // Please add Material data before saving!
            });
        }

        // 1. Update Header (Material)
        const beforeMatUpdate = await Service.getSinglemat(payload.mat.mat_id);
        const matResult = await Service.putMat(payload.mat);
        
        // GUARD: Ensure the main material actually updated before proceeding
        if (!matResult || matResult.length === 0) {
            throw new Error(`ไม่พบ Material ID: ${payload.mat.mat_id} ในระบบ`); 
        }

        await update_log(
            "m_mat",
            matResult[0],
            matResult[0].mat_id,
            beforeMatUpdate[0],
            matResult[0],
            user_id
        );

        const mat_id = matResult[0].mat_id;

        // 2. Update Category
        if (Array.isArray(payload.mat_cat) && payload.mat_cat.length > 0) {
            for (const item of payload.mat_cat) {
                // FIXED: Changed item.mat_id to payload.mat.mat_id for consistency
                const beforeCatUpdate = await detailService.getSinglematCat(payload.mat.mat_id);
                if(beforeCatUpdate && beforeCatUpdate.length >0) {
                    const catResult = await detailService.putMatcat({
                        mat_id: mat_id,
                        mat_cat: item.mat_cat
                    });
                    await update_log(
                        "m_mat_cat",
                        catResult[0],
                        catResult[0].mat_id,
                        beforeCatUpdate[0],
                        catResult[0],
                        user_id
                    )
                }else{
                    const catResult = await detailService.postMatcat(item);
                    await create_log(
                        "m_mat_cat",
                        catResult[0].mat_id,
                        user_id
                    );
                }
            }
        }

        // 3. Update Unit
        if (Array.isArray(payload.mat_unit) && payload.mat_unit.length > 0) {
            for (const item of payload.mat_unit) {
                const beforeUnitUpdate = await detailService.getSinglematUnit(mat_id);
                if(beforeUnitUpdate && beforeUnitUpdate.length >0) {
                    const unitResult = await detailService.putMatunit({
                        mat_id:  payload.mat.mat_id,
                        weight: item.weight,
                        costperunit: item.costperunit
                    });
                    await update_log(
                        "m_mat_unit",
                        unitResult[0],
                        unitResult[0].mat_id,
                        beforeUnitUpdate[0],
                        unitResult[0],
                        user_id
                    );
                } else {
                    const unitResult = await detailService.postMatunit({
                        mat_id:  payload.mat.mat_id,
                        weight: item.weight,
                        costperunit: item.costperunit
                    });
                    await create_log(
                        "m_mat_unit",
                        unitResult[0].mat_id,
                        user_id
                    );
                }
            }
        }

        // 4. Update Dimension
        if (Array.isArray(payload.mat_dimension) && payload.mat_dimension.length > 0) {
            for (const item of payload.mat_dimension) {
                const beforeDimUpdate = await detailService.getSinglematDimension(mat_id);
                if(beforeDimUpdate && beforeDimUpdate.length >0) {
                    const dimResult = await detailService.putMatdimension({
                        mat_id: payload.mat.mat_id,
                        height: item.height,
                        width: item.width,
                        thick: item.thick,
                        curve: item.curve,
                        area: item.area,
                        min_thick: item.min_thick,
                        max_thick: item.max_thick,
                        cavity: item.cavity
                    });

                    await update_log(
                        "m_mat_dimension",
                        dimResult[0],
                        dimResult[0].mat_id,
                        beforeDimUpdate[0],
                        dimResult[0],
                        user_id
                    );
                }else{
                    const dimResult = await detailService.postMatdimension({
                        mat_id: payload.mat.mat_id,
                        height: item.height,
                        width: item.width,
                        thick: item.thick,
                        curve: item.curve,
                        area: item.area
                    });

                    await create_log(
                        "m_mat_dimension",
                        dimResult[0].mat_id,
                        user_id
                    );
                }
              
            }
        }

        // 5. Update File
        if (file) {
            const { originalname, path: filePath } = file;

            const encodedOriginalName = Buffer.from(originalname, "latin1")
                .toString("utf8")
                .replace(/\s+/g, "_")
                .replace(/[^\w\-_.ก-๙]/g, "");
                
            const beforeFileUpdate = await detailService.getSinglematfile(mat_id);
            if(beforeFileUpdate && beforeFileUpdate.length > 0) {
                // Delete old file if it exists
                if (beforeFileUpdate?.[0]?.file) {
                    const oldFilepath = path.join(uploadDir, beforeFileUpdate[0].file);
                
                    if (fs.existsSync(oldFilepath)) {
                        try {
                            fs.unlinkSync(oldFilepath);
                            console.log("✅ Deleted old file:", oldFilepath);
                        } catch (err) {
                            console.error("❌ Error deleting old file:", oldFilepath, err);
                        }
                    }
                }
                
                const fileResult = await detailService.putMatfile({
                    mat_id: payload.mat.mat_id,
                    file_name: encodedOriginalName,
                    path: filePath
                });
                if (fileResult && fileResult.length > 0) {
                    await update_log(
                        "m_mat_file",
                        fileResult[0],
                        fileResult[0].mat_id,
                        beforeFileUpdate?.[0], // safe fallback if undefined
                        fileResult[0],
                        user_id
                    );
                }
            }else{
                const fileResult = await detailService.postMatfile({
                    mat_id: payload.mat.mat_id,
                    file_name: encodedOriginalName,
                    path: filePath
                });
                await update_log(
                    "m_mat_file",
                    fileResult[0],
                    fileResult[0].mat_id,
                    beforeFileUpdate?.[0], // safe fallback if undefined
                    fileResult[0],
                    user_id
                );
            }
            
        }

        await dbconnect.query("COMMIT");

        return res.status(200).json({
            success: true,
            data: matResult,
            msg: `Save record successful : ${matResult[0].erp} - ${matResult[0].name}`
        });

    } catch (error) {
        await dbconnect.query("ROLLBACK");
        console.error("Transaction Error:", error);

        return res.status(500).json({
            success: false,
            msg: "มีปัญหาเกิดขึ้นระหว่างการบันทึกข้อมูล",
            error: error.message
        });
    }
};
module.exports = {
    getAllmatController,
    getSinglematController,
    postSingleheaderController,
    putSingleheaderController,
    deleteSingleheaderController

};

// postMatcat,
// postMatdimension,
// postMatunit,
// postMatfile,
// putMatcat,
// putMatdimension,
// putMatunit,
// putMatfile,
// deleteMatcat,
// deleteMatDimension,
// deleteMatunit,
// deleteMatfile
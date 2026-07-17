
const dbconnect = require('../../../middleWare/Dbconnect');
const Service = require('../service/certificateService')
const { update_log, create_log } = require('../utility/update_log') 
const { leftJoin } = require('../utility/leftJoin') 
const {createColumnDefs} = require('../utility/getColumn')
const { uploadDir } = require("../middleware/certificationFilemiddleware");
const fs = require("fs");
const path = require("path");

const getAllcertificateController = async (req, res) => {
    try {
        const certificate = await Service.getAllcertificate()        
        const certificateCat = await Service.getAllcertificatecat()        
        const certificateType = await Service.getAllcertificatetype()        
        const certificate_file = await Service.getAllcertificatefile()
        let step1 = leftJoin(certificate, certificateCat, "certificate_id", "certificate_id")
        let step2 = leftJoin(step1, certificateType, "certificate_id", "certificate_id")
        let final = leftJoin(step2, certificate_file, "certificate_id", "certificate_id")
        const filterData = final.map(({certificate_type_id, certificate_cat_id, file_id, ...rest}) => rest)
        // console.log("filterData", filterData)
        const columnDefs = createColumnDefs(filterData)

        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: filterData,
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


//get by id----------------------------------------
const getSinglecertificatebyidController = async (req, res) => {
    const { id } = req.params;
    try {
        const certificate = await Service.getSinglecertificatebyid(id)        
        const certificateCat = await Service.getSinglecertificatecatbyid(id)        
        const certificateType = await Service.getSinglecertificatetypebyid(id)        
        const certificate_file = await Service.getSinglecertificatefilebyid(id)
        // console.log("filterData", filterData)
        // const certificateColumnDefs = createColumnDefs(certificate)
        const certificateColumnDefs = (() => {
            const source = certificate || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], required: true, option: true };
            if (cols[2]) cols[2] = { ...cols[2], required: true };
            if (cols[3]) cols[3] = { ...cols[3], required: true };
            if (cols[6]) cols[6] = { ...cols[6], required: true };
            // if (cols[5]) cols[5] = { ...cols[5], option: true, required: true };
            // if (cols[6]) cols[6] = { ...cols[6], option: true, required: true };
        
            return cols;
        })();
        // const certificateCatColumnDefs = createColumnDefs(certificateCat)
        const certificateCatColumnDefs = (() => {
            const source = certificateCat || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], hidden: true };
            // if (cols[5]) cols[5] = { ...cols[5], option: true, required: true };
            // if (cols[6]) cols[6] = { ...cols[6], option: true, required: true };
        
            return cols;
        })();
        // const certificateTypeColumnDefs = createColumnDefs(certificateType)
        const certificateTypeColumnDefs = (() => {
            const source = certificateType || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], hidden: true };
            // if (cols[5]) cols[5] = { ...cols[5], option: true, required: true };
            // if (cols[6]) cols[6] = { ...cols[6], option: true, required: true };
        
            return cols;
        })();
        // const certificateFileColumnDefs = createColumnDefs(certificate_file)
        const certificateFileColumnDefs = (() => {
            const source = certificate_file || [];
            const cols = [...createColumnDefs(source)];
        
            if (cols[0]) cols[0] = { ...cols[0], hidden: true };
            if (cols[1]) cols[1] = { ...cols[1], type: "file" };
            // if (cols[5]) cols[5] = { ...cols[5], option: true, required: true };
            // if (cols[6]) cols[6] = { ...cols[6], option: true, required: true };
        
            return cols;
        })();
        // console.log("certificateColumnDefs", certificateColumnDefs)
        res.status(200).json({
            success: true,
            msg: 'ดึงข้อมูลทั้งหมดได้สำเร็จ',
            data: {
                certificate: certificate,
                certificateCat: certificateCat,
                certificateType: certificateType,
                certificate_file: certificate_file,

            },
            columnDefs: {
                certificateColumnDefs: certificateColumnDefs,
                certificateCatColumnDefs: certificateCatColumnDefs,
                certificateTypeColumnDefs: certificateTypeColumnDefs,
                certificateFileColumnDefs: certificateFileColumnDefs
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

//post
const postSingleController = async (req, res) => {
    // {
    //     "certificateColumnDefs": [
    //         {
    //             "type_brake": "DB",
    //             "aproval_code": "12"
    //         }
    //     ],
    //     "certificateCatColumnDefs": [
    //         {
    //             "certificate_cat": "Emark"
    //         }
    //     ],
    //     "certificateTypeColumnDefs": [
    //         {
    //             "certificate_type": "E1"
    //         }
    //     ],
    //     "certificateFileColumnDefs": [
    //         {
    //             "file": [
    //                 {
    //                     "uid": "rc-upload-1783998864131-3",
    //                     "lastModified": 1783734152784,
    //                     "lastModifiedDate": "2026-07-11T01:42:32.784Z",
    //                     "name": "inventory_module.pdf",
    //                     "size": 211306,
    //                     "type": "application/pdf",
    //                     "percent": 0,
    //                     "originFileObj": {
    //                         "uid": "rc-upload-1783998864131-3"
    //                     }
    //                 }
    //             ]
    //         }
    //     ]
    // }
    console.log("req.body", req.body);

  
    const user_id = req.user.id;
    // const payload = req.body;
    // const payload = {
    //     cer: (req.body.certificateColumnDefs || "{}"),
    //     cer_cat: (req.body.certificateCatColumnDefs || "[]"),
    //     cer_type: (req.body.certificateTypeColumnDefs || "[]"),
    // };
    const payload = {
        cer: JSON.parse(req.body.certificateColumnDefs || "{}"),
        cer_cat: JSON.parse(req.body.certificateCatColumnDefs || "[]"),
        cer_type: JSON.parse(req.body.certificateTypeColumnDefs || "[]"),
    };
    const file = req.file;
    console.log("payload", payload);
    // console.log("JSON.parse(payload)", JSON.parse(payload));
    console.log("file", file);

    try {
        await dbconnect.query("BEGIN");


        if (!payload.cer) {
            await dbconnect.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                msg: "กรุณาเพิ่มข้อมูล Material ก่อนบันทึก!"
            });
        }

        // Header
        const checkDuplicate =
            await Service.checkDuplicate(payload.cer);

        if (checkDuplicate.length > 0) {
            await dbconnect.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                data: checkDuplicate[0],
                msg: ` : ${payload.cer.compact_no}- ${payload.cer.formulation}-${payload.cer.revision}มีอยู่ในระบบแล้ว`
            });
        }
        const result = await Service.postSinglecertificate(payload.cer[0]);
        // headerResult.push(result[0]);

        await create_log(
            "certificate",
            result[0].certificate_id,
            user_id
        );

        const certificate_id = result[0].certificate_id;

        // Category
        if (
            Array.isArray(payload.cer_cat) &&
            payload.cer_cat.length > 0
        ) {
            for (const item of payload.cer_cat) {
                const result =
                    await Service.postSinglecertificatecat({
                        certificate_id: certificate_id,
                        certificate_cat: item.certificate_cat
                    });

                await create_log(
                    "certificate_cat",
                    result[0].certificate_id,
                    user_id
                );
            }
        }

        // Unit
        if (
            Array.isArray(payload.cer_type) &&
            payload.cer_type.length > 0
        ) {
            for (const item of payload.cer_type) {
                const result =
                    await Service.postSinglecertificatetype({
                        certificate_id:certificate_id,
                        certificate_type: item.certificate_type,
                    });

                await create_log(
                    "certificate_type",
                    result[0].certificate_id,   
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
                await Service.postSinglecertificatefile({
                    certificate_id: certificate_id,
                    file_name: encodedOriginalName,
                    path: filePath
                });

            await create_log(
                "certificate_file",
                result[0].certificate_id,
                user_id
            );
        }

        await dbconnect.query("COMMIT");

        return res.status(200).json({
            success: true,
            data: result,
            // msg: `Save record successful : ${result[0].erp} - ${result[0].name}`
            msg: ` :Save record successful  ${payload.cer.compact_no}- ${payload.cer.formulation}-${payload.cer.revision}`

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
//put
// const putSingleController = async (req, res) => {
//     // {
//     //     "certificateColumnDefs": [
//     //         {
//     //             "certificate_id": 3,
//     //             "type_brake": "LB",
//     //             "compact_no": "12",
//     //             "formulation": "12",
//     //             "aproval_code": null,
//     //             "certificate_no": null,
//     //             "revision": "2"
//     //         }
//     //     ],
//     //     "certificateCatColumnDefs": [
//     //         {
//     //             "certificate_cat_id": 3,
//     //             "certificate_id": 3,
//     //             "certificate_cat": null
//     //         }
//     //     ],
//     //     "certificateTypeColumnDefs": [
//     //         {
//     //             "certificate_type_id": 3,
//     //             "certificate_id": 3,
//     //             "certificate_type": null
//     //         }
//     //     ],
//     //     "certificateFileColumnDefs": [
//     //         {
//     //             "certificate_id": 3,
//     //             "file": [
//     //                 {
//     //                     "uid": "-1",
//     //                     "name": "COMPOACT_ERP_Phase3_ModuleDeepDive.pdf",
//     //                     "status": "done",
//     //                     "url": "COMPOACT_ERP_Phase3_ModuleDeepDive.pdf"
//     //                 }
//     //             ]
//     //         }
//     //     ]
//     // }
//     console.log("req.body", req.body);

  
//     const user_id = req.user.id;
//     // const payload = req.body;
//     // const payload = {
//     //     cer: (req.body.certificateColumnDefs || "{}"),
//     //     cer_cat: (req.body.certificateCatColumnDefs || "[]"),
//     //     cer_type: (req.body.certificateTypeColumnDefs || "[]"),
//     // };
//     const payload = {
//         cer: JSON.parse(req.body.certificateColumnDefs || "[]"),
//         cer_cat: JSON.parse(req.body.certificateCatColumnDefs || "[]"),
//         cer_type: JSON.parse(req.body.certificateTypeColumnDefs || "[]"),
//     };
//     const file = req.file;
//     console.log("payload", payload);
//     // console.log("JSON.parse(payload)", JSON.parse(payload));
//     console.log("file", file);

//     try {
//         await dbconnect.query("BEGIN");


//         if (!payload.cer) {
//             await dbconnect.query("ROLLBACK");

//             return res.status(400).json({
//                 success: false,
//                 msg: "กรุณาเพิ่มข้อมูล Material ก่อนบันทึก!"
//             });
//         }

//        const beforeUpdate = await Service.getSinglecertificatebyid(payload.cer[0].certificate_id);
//         const result = await Service.putSinglecertificate(payload.cer[0]);
//         // headerResult.push(result[0]);

//         await update_log(
//             "certificate",
//             result[0],
//             result[0].certificate_id,
//             beforeUpdate[0],
//             user_id
//         );

//         const certificate_id = result[0].certificate_id;

//         // Category
//         if (
//             Array.isArray(payload.cer_cat) &&
//             payload.cer_cat.length > 0
//         ) {
//             for (const item of payload.cer_cat) {
//                 const beforeUpdate = await Service.getSinglecertificatecatbyid(certificate_id);
//                 const result =
//                     await Service.putSinglecertificatecat({
//                         certificate_id: certificate_id,
//                         certificate_cat: item.certificate_cat
//                     });

//                 await update_log(
//                     "certificate_cat",
//                     result[0].certificate_id,
//                     beforeUpdate[0],
//                     result[0],
//                     user_id
//                 );
//             }
//         } else {
//             for (const item of payload.cer_cat) {
//                 const result =
//                     await Service.postSinglecertificatecat({
//                         certificate_id: certificate_id,
//                         certificate_cat: item.certificate_cat
//                     });

//                 await create_log(
//                     "certificate_cat",
//                     result[0].certificate_id,
//                     user_id
//                 );
//             }
//         }

//         // Unit
//         if (
//             Array.isArray(payload.cer_type) &&
//             payload.cer_type.length > 0
//         ) {
//             for (const item of payload.cer_type) {
//                 const beforeUpdate = await Service.getSinglecertificatetypebyid(certificate_id);
//                 const result =
//                     await Service.putSinglecertificatetype({
//                         certificate_id: certificate_id,
//                         certificate_type: item.certificate_type
//                     });

//                 await update_log(
//                     "certificate_type",
//                     result[0].certificate_id,
//                     beforeUpdate[0],
//                     result[0],
//                     user_id
//                 );
//             }
                
//         }else{
//             const result =
//             await Service.postSinglecertificatetype({
//                 certificate_id:certificate_id,
//                 certificate_type: item.certificate_type,
//             });

//             await create_log(
//                 "certificate_type",
//                 result[0].certificate_id,   
//                 user_id
//             );
//         }
//         // File
       
        
//         if (file) { 
//             const {
//                 originalname,
//                 path: filePath
//                 } = file;

//                 const encodedOriginalName = Buffer.from(
//                     originalname,
//                     "latin1"
//                 )
//                     .toString("utf8")
//                     .replace(/\s+/g, "_")
//                     .replace(/[^\w\-_.ก-๙]/g, "");
//             const beforeUpdate = await Service.getSinglecertificatefilebyid(certificate_id);
//             if(beforeUpdate.length > 0){
//                 if (beforeUpdate?.[0]?.file) {
//                     const oldFilepath = path.join(uploadDir, beforeUpdate[0].file);
                
//                     if (fs.existsSync(oldFilepath)) {
//                         try {
//                             fs.unlinkSync(oldFilepath);
//                             console.log("✅ Deleted old file:", oldFilepath);
//                         } catch (err) {
//                             console.error("❌ Error deleting old file:", oldFilepath, err);
//                         }
//                     }
//                 }
//             }else{
//                 const result =
//                 await Service.postSinglecertificatefile({
//                     certificate_id: certificate_id,
//                     file_name: encodedOriginalName,
//                     path: filePath
//                 });

//             await create_log(
//                 "certificate_file",
//                 result[0].certificate_id,
//                 user_id
//             );
//             }   
//         }
//         await dbconnect.query("COMMIT");

//         return res.status(200).json({
//             success: true,
//             data: result,
//             // msg: `Save record successful : ${result[0].erp} - ${result[0].name}`
//             msg: ` :Save record successful  ${payload.cer.compact_no}- ${payload.cer.formulation}-${payload.cer.revision}`

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



const putSingleController = async (req, res) => {
    const user_id = req.user.id;
    const file = req.file;

    // Safely parse incoming data
    const payload = {
        cer: JSON.parse(req.body.certificateColumnDefs || "[]"),
        cer_cat: JSON.parse(req.body.certificateCatColumnDefs || "[]"),
        cer_type: JSON.parse(req.body.certificateTypeColumnDefs || "[]"),
    };
    console.log("payload", payload);
    console.log("file", file);
    try {
        await dbconnect.query("BEGIN");

        // 1. Better Validation: Check if array is actually empty
        // if (!payload.cer || payload.cer.length === 0) {
        //     await dbconnect.query("ROLLBACK");
        //     return res.status(400).json({
        //         success: false,
        //         msg: "กรุณาเพิ่มข้อมูล Material ก่อนบันทึก!"
        //     });
        // }

        const certificateData = payload.cer[0];
        const certificate_id = certificateData.certificate_id;

        // 2. Update Main Certificate
        const beforeUpdateCer = await Service.getSinglecertificatebyid(certificate_id);
        const result = await Service.putSinglecertificate(certificateData);

        await update_log(
            "certificate",
            result[0],
            certificate_id,
            beforeUpdateCer[0],
            user_id
        );

        // 3. Handle Category (Unified POST/PUT Logic)
        if (Array.isArray(payload.cer_cat)) {
            for (const item of payload.cer_cat) {
                const beforeUpdateCat = await Service.getSinglecertificatecatbyid(certificate_id);
                
                // If it already exists, update it. Otherwise, create it.
                if (beforeUpdateCat && beforeUpdateCat.length > 0) {
                    const catResult = await Service.putSinglecertificatecat({
                        certificate_id: certificate_id,
                        certificate_cat: item.certificate_cat
                    });
                    await update_log("certificate_cat", catResult[0].certificate_id, beforeUpdateCat[0], catResult[0], user_id);
                } else {
                    const catResult = await Service.postSinglecertificatecat({
                        certificate_id: certificate_id,
                        certificate_cat: item.certificate_cat
                    });
                    await create_log("certificate_cat", catResult[0].certificate_id, user_id);
                }
            }
        }

        // 4. Handle Type (Unified POST/PUT Logic, fixes ReferenceError)
        if (Array.isArray(payload.cer_type)) {
            for (const item of payload.cer_type) {
                const beforeUpdateType = await Service.getSinglecertificatetypebyid(certificate_id);
                
                if (beforeUpdateType && beforeUpdateType.length > 0) {
                    const typeResult = await Service.putSinglecertificatetype({
                        certificate_id: certificate_id,
                        certificate_type: item.certificate_type
                    });
                    await update_log("certificate_type", typeResult[0].certificate_id, beforeUpdateType[0], typeResult[0], user_id);
                } else {
                    const typeResult = await Service.postSinglecertificatetype({
                        certificate_id: certificate_id,
                        certificate_type: item.certificate_type,
                    });
                    await create_log("certificate_type", typeResult[0].certificate_id, user_id);
                }
            }
        }

        // 5. Handle File Upload (Fixes missing DB update)
        let oldFilepath = null; // Store old path to delete ONLY after commit

        if (file) {
            const { originalname, path: filePath } = file;
            const encodedOriginalName = Buffer.from(originalname, "latin1")
                .toString("utf8")
                .replace(/\s+/g, "_")
                .replace(/[^\w\-_.ก-๙]/g, "");

            const beforeUpdateFile = await Service.getSinglecertificatefilebyid(certificate_id);

            if (beforeUpdateFile && beforeUpdateFile.length > 0) {
                // Prepare old file for deletion later
                if (beforeUpdateFile[0].file) {
                    // Ensure uploadDir is defined in your file scope!
                    oldFilepath = path.join(uploadDir, beforeUpdateFile[0].file); 
                }

                // MISSING LOGIC ADDED: You must update the DB with the new file!
                const fileResult = await Service.putSinglecertificatefile({ // Assuming you have this service
                    certificate_id: certificate_id,
                    file_name: encodedOriginalName,
                    path: filePath
                });
                await update_log("certificate_file", certificate_id, beforeUpdateFile[0], fileResult[0], user_id);

            } else {
                // Post new file if none existed previously
                const fileResult = await Service.postSinglecertificatefile({
                    certificate_id: certificate_id,
                    file_name: encodedOriginalName,
                    path: filePath
                });
                await create_log("certificate_file", fileResult[0].certificate_id, user_id);
            }
        }

        // Commit Transaction
        await dbconnect.query("COMMIT");

        // 6. Delete old file ONLY if the database commit was successful
        if (oldFilepath && fs.existsSync(oldFilepath)) {
            try {
                fs.unlinkSync(oldFilepath);
                console.log("✅ Deleted old file:", oldFilepath);
            } catch (err) {
                console.error("❌ Error deleting old file:", oldFilepath, err);
            }
        }

        // 7. Fix Response Message (Array Indexing)
        return res.status(200).json({
            success: true,
            data: result,
            msg: `Update record successful: ${certificateData.compact_no} - ${certificateData.formulation} - ${certificateData.revision}`
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

module.exports = {
    getAllcertificateController,
    getSinglecertificatebyidController,
    postSingleController,
    putSingleController


};
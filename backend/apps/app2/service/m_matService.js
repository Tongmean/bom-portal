const dbconnect = require('../../../Middleware/Dbconnect');
const getSinglemat= async (payload) => {
        const mysql =`
            SELECT * FROM "blCpi".m_mat
            WHERE mat_id = $1
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const checkDuplicate= async (payload) => {
        const mysql =`
            SELECT * FROM "blCpi".m_mat
            WHERE erp = $1
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const getAllmat = async () => {
        const mysql =`
        SELECT 
            mm.mat_id,
            mm.erp,
            mm.name,
            mm.id,
            sc.label AS status_check,
            mm.revision,
            mcho.component_label AS "component",
            mcho.unit,
            md.width,
            md.height,
            md.thick,
            md.area,
            md.curve,
            md.min_thick,
            md.max_thick,
            md.cavity,
            md.outer_dia,
            mu.weight,
            mu.costperunit,
            mf.file_name AS file
        FROM "blCpi".m_mat mm
        LEFT JOIN "blCpi".m_mat_cat mc
            ON mm.mat_id = mc.mat_id
        LEFT JOIN "blCpi".m_mat_unit mu
            ON mm.mat_id = mu.mat_id
        LEFT JOIN "blCpi".m_mat_file mf
            ON mm.mat_id = mf.mat_id
        LEFT JOIN "blCpi".m_mat_dimension md
            ON mm.mat_id = md.mat_id
        LEFT JOIN "blCpi".m_status_check sc
            ON sc.status_check_id = mm.status_check_id
        LEFT JOIN (
            SELECT DISTINCT
                compoent AS component,
                compoent_label AS component_label,
                unit
            FROM "blCpi".m_compoent_header_option
            WHERE unit IS NOT NULL
        ) mcho
            ON mc.mat_cat = mcho.component
        ORDER BY mm.mat_id DESC;
        `
    const result = await dbconnect.query(mysql);
    return result.rows
}


// const postMat = async (payload) => {
//         console.log("Matpayload", payload)
//         const mysql =`
//         INSERT INTO "blCpi".m_mat(
//             erp, name, id)
//             VALUES ($1, $2, $3)
//         RETURNING *;
//         `
//     const result = await dbconnect.query(mysql, [payload.erp, payload.name, payload.id]);
//     return result.rows
// }
const postMat = async (payload) => {
    console.log("Matpayload", payload);
    
    const mysql = `
        INSERT INTO "blCpi".m_mat(
            erp, name, id , status_check_id, revision)
            VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    // Safely trim values if they are strings, otherwise pass them as-is
    const safeErp = typeof payload.erp === 'string' ? payload.erp.trim() : payload.erp;
    const safeName = typeof payload.name === 'string' ? payload.name.trim() : payload.name;
    const safeId = typeof payload.id === 'string' ? payload.id.trim() : payload.id;

    const result = await dbconnect.query(mysql, [safeErp, safeName, safeId, payload.status_check_id, payload.revision]);
    
    return result.rows;
}

const putMat = async (payload) => {
        const mysql =`
        UPDATE "blCpi".m_mat
        SET erp=$1, name=$2, id=$3, status_check_id=$4, revision=$5
        WHERE mat_id= $6
        RETURNING *;
        `
    const result = await dbconnect.query(mysql, [payload.erp, payload.name, payload.id,payload.status_check_id,payload.revision, payload.mat_id]);
    return result.rows
}
const deleteMat = async (payload) => {
        const mysql =`
        DELETE FROM "blCpi".m_mat
	    WHERE mat_id = $1
        RETURNING *;
        `
    const result = await dbconnect.query(mysql, [payload.mat_id]);
    return result.rows
}


module.exports = {
    getAllmat,
    getSinglemat,
    putMat,
    postMat,
    deleteMat,
    checkDuplicate

};
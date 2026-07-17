const dbconnect = require('../../../Middleware/Dbconnect');

const checkDuplicate = async (payload) => {
    const mysql =`
        SELECT * FROM "blCpi".foam_header
        WHERE part_no = $1
    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}
const getAllfoam = async () => {
    const mysql =`
    SELECT 
        fh.foam_header_id,
        fh.part_no,
        fh.remark,
        cho.compoent_header_option_label AS component,
        mat.erp, mat.name,
        fd.quantity
        FROM "blCpi".foam_detail AS fd
        LEFT JOIN "blCpi".foam_header AS fh
        ON fh.foam_header_id = fd.foam_header_id
        LEFT JOIN "blCpi".m_compoent_header_option AS cho
        ON fd.component_header = cho.compoent_header_option_id
        
        LEFT JOIN "blCpi".m_mat AS mat
        ON mat.mat_id = fd.mat_id
    ORDER BY 
    fh.foam_header_id DESC,
    component DESC
    `
    const result = await dbconnect.query(mysql);
    return result.rows
}




const getSingleheader = async (payload) => {
    const mysql =`
        SELECT * FROM "blCpi".foam_header
        WHERE foam_header_id = $1
    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}

const postHeader = async (payload) => {
    const {remark, part_no } = payload;


    const mysql = `
        INSERT INTO "blCpi".foam_header(
            part_no, remark
        )
        VALUES ($1, $2)
        RETURNING *;
    `;

    const values = [part_no, remark];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}
const putHeader = async (payload) => {
    const {remark, part_no, foam_header_id } = payload;

    const mysql = `
        UPDATE "blCpi".foam_header
        SET 
            part_no = $1, 
            remark = $2
            
        WHERE foam_header_id = $3
        RETURNING *;
    `;

    const values = [part_no, remark, foam_header_id];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}
//detail
const getSingledetailbyheader_id = async (payload) => {
    const mysql =`
        SELECT * FROM "blCpi".foam_detail
        WHERE foam_header_id = $1
    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}
const getSingledetail = async (payload) => {
    const mysql =`
        SELECT * FROM "blCpi".foam_detail
        WHERE foam_detail_id = $1
    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}

const postDetail = async (payload) => {
    const {foam_header_id, component_header, mat_id, quantity } = payload;


    const mysql = `
        INSERT INTO "blCpi".foam_detail(
            foam_header_id, component_header, mat_id, quantity
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [foam_header_id, component_header, mat_id, quantity];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}
const putDetail = async (payload) => {
    const {foam_header_id, component_header, mat_id, quantity, foam_detail_id } = payload;

    const mysql = `
        UPDATE "blCpi".foam_detail
        SET 
            foam_header_id = $1, 
            component_header = $2, 
            mat_id = $3,
            quantity = $4
            WHERE foam_detail_id = $5
        RETURNING *;
    `;

    const values = [foam_header_id, component_header, mat_id, quantity, foam_detail_id];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}
const deleteDetail = async (payload) => {
    // const {foam_detail_id } = payload;

    const mysql = `
        DELETE FROM "blCpi".foam_detail
            WHERE foam_detail_id = $1
        RETURNING *;
    `;

    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}
module.exports = {
    getAllfoam,
    getSingleheader,
    getSingledetailbyheader_id,
    checkDuplicate,

    postHeader,
    putHeader,
    postDetail,
    putDetail,
    deleteDetail,
    getSingledetail,

};
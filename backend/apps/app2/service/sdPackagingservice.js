const dbconnect = require('../../../Middleware/Dbconnect');
const getAllsdpackaging = async () => {
        const mysql =`
            SELECT 
                sd.sdpackaging_header_id,
                sh.sdpackaing_code,
                
                sh.revision,
                sh.remark,
                cs.label AS check_status,
                cho.compoent_header_option_label AS component,
                mat.erp, mat.name,mat.id,
                sd.quantity

            FROM "blCpi".sdpackaging_detail sd
                LEFT JOIN "blCpi".sdpackaging_header AS sh
                ON sh.sdpackaging_header_id = sd.sdpackaging_header_id
                LEFT JOIN "blCpi".m_compoent_header_option AS cho
                ON sd.component_header = cho.compoent_header_option_id
                
                LEFT JOIN "blCpi".m_mat AS mat
                ON mat.mat_id = sd.mat_id

                LEFT JOIN "blCpi".m_status_check AS cs
                ON cs.status_check_id = sh.check_status
                
            ORDER BY sd.quantity ASC

        `
        const result = await dbconnect.query(mysql);
        return result.rows
}


const getSingleheader = async (payload) => {
    // const {drawing_header_id} = payload;
    const mysql =`
    SELECT * FROM "blCpi".sdpackaging_header
    WHERE sdpackaging_header_id = $1 

    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}
const checkDuplicateheader = async (payload) => {
    // const {drawing_header_id} = payload;
    const mysql =`
    SELECT * FROM "blCpi".sdpackaging_header
    WHERE sdpackaing_code = $1 

    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}
const postHeader = async (payload) => {
// console.log("payload", payload)
    const { sdpackaing_code, revision, remark, check_status } = payload;
    const mysql = `
        INSERT INTO "blCpi".sdpackaging_header(
            sdpackaing_code, revision, remark, check_status
        ) VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

const values = [sdpackaing_code, revision, remark, check_status];
const result = await dbconnect.query(mysql, values);

return result.rows
}
const putHeader = async (payload) => {
    const { 
        sdpackaging_header_id, // The new ID if you are changing it, otherwise same as targetId
        sdpackaing_code, 
        revision, 
        remark, 
        check_status 
      } = payload;

        const mysql = `
            UPDATE "blCpi".sdpackaging_header
            SET 
                sdpackaing_code = $1, 
                revision = $2, 
                remark = $3, 
                check_status = $4
            WHERE sdpackaging_header_id = $5
            RETURNING *;
        `;

        const values = [
            // sdpackaging_header_id, 
            sdpackaing_code, 
            revision, 
            remark, 
            check_status, 
            sdpackaging_header_id
        ];
        const result = await dbconnect.query(mysql, values);
        return result.rows
}
const deleteHeader = async (payload) => {
const { 
    sdpackaging_header_id
} = payload;


const mysql = `
    DELETE FROM "blCpi".sdpackaging_header
    WHERE sdpackaging_header_id = $1
    RETURNING *;
`;

const values = [
    sdpackaging_header_id // Maps to $11 in the WHERE clause
];
const result = await dbconnect.query(mysql, values);
return result.rows
}

module.exports = {
    getAllsdpackaging,
    getSingleheader,
    postHeader,
    putHeader,
    deleteHeader,
    checkDuplicateheader
};
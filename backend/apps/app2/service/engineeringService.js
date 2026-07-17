const dbconnect = require('../../../middleWare/Dbconnect');
const getSingleengineering = async (payload) => {
        const mysql =`
            SELECT * FROM "blCpi".drawing_header
            WHERE drawing_header_id = $1

        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const checkDuplicate = async (payload) => {
        const mysql =`
            SELECT * FROM "blCpi".drawing_header
            WHERE compact_no = $1

        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const getAllengineering = async () => {
        const mysql =`
           SELECT 
                dh.drawing_header_id,
                dh.compact_no,
                dh.part_no,
                dh.drawing_no,
                dh.revision,
                dh.drawing_no,
                dh.remark,
                dso.label AS "status",
                sc.label AS "check_status",
                dd.component_header AS component,
                mat.erp, mat.name, mat.id,
                dd.quantity,
                dd.height,
                dd.width,
                dd.thick_upper,
                dd.thick_lower,
                dd.curve,
                dd.area
                
            FROM "blCpi".drawing_detail dd
            LEFT JOIN "blCpi".drawing_header dh
                ON dh.drawing_header_id = dd.drawing_header_id
            LEFT JOIN "blCpi".m_status_check AS sc
                ON sc.status_check_id = dh.check_status
            LEFT JOIN "blCpi".m_document_status_option AS dso
                ON dso.document_status_option_id = dh.document_status
            LEFT JOIN "blCpi".m_mat AS mat
                ON dd.mat_id = mat.mat_id
                
            ORDER BY dh.drawing_header_id ASC , dd.quantity ASC

        `
        const result = await dbconnect.query(mysql);
        return result.rows
}

const postEnginnering = async (payload) => {
    const { compact_no, drawing_no, revision, remark, document_status, check_status, part_no } = payload;


    const mysql = `
        INSERT INTO "blCpi".drawing_header(
            compact_no, drawing_no, revision, remark, document_status, check_status, part_no
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [compact_no, drawing_no, revision, remark, document_status, check_status, part_no];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}
const putEnginnering = async (payload) => {
    const { compact_no, drawing_no, revision, remark, document_status, check_status, part_no, drawing_header_id } = payload;


    const mysql = `
        UPDATE "blCpi".drawing_header
        SET 
            compact_no = $1, 
            drawing_no = $2, 
            revision = $3, 
            remark = $4, 
            document_status = $5, 
            check_status = $6, 
            part_no = $7
        WHERE drawing_header_id = $8
        RETURNING *;
    `;

    const values = [compact_no, drawing_no, revision, remark, document_status, check_status, part_no, drawing_header_id];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}


module.exports = {
    getAllengineering,
    postEnginnering,
    putEnginnering,
    getSingleengineering,
    checkDuplicate
};

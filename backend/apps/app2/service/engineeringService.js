const dbconnect = require('../../../Middleware/Dbconnect');
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
                dd.curve
                
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
module.exports = {
    getAllengineering
};
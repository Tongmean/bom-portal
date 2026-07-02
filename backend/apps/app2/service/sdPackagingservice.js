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
module.exports = {
    getAllsdpackaging
};
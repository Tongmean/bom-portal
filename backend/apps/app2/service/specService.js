const dbconnect = require('../../../Middleware/Dbconnect');
const getAllspecHeaderservice = async () => {
        const mysql =`
        SELECT 
            sh.spec_header_id,
            sh.spec_code,
            sh.sale_code, 
            entity.erp AS Customer_code,
            entity.name AS Customer_name,
            mc.zone,
            mc.country,
            sh.certificate,
            sh.formulation,
            sh.revision,
            sh.remark,
            dso.label AS document_Status,
            co.label AS channel,
            sc.label AS check_status
            
        
        FROM "blCpi".spec_header sh
        LEFT JOIN "blCpi"."m_customer" mc
            ON sh.customer_id = mc.customer_id
        LEFT JOIN "blCpi"."m_entity" entity
            ON entity.entity_id = mc.entity_id
        LEFT JOIN "blCpi".m_document_status_option AS dso
            ON dso.document_status_option_id = sh.document_status_option_id
        LEFT JOIN "blCpi".m_chanel_option co
            ON co.chanel_option_id = sh.chanel_option_id
        LEFT JOIN "blCpi".m_status_check AS sc
            ON sc.status_check_id = sh.status_check_id
        ORDER BY spec_header_id DESC 

        `
        const result = await dbconnect.query(mysql);
        return result.rows
}


const getSinglespecHeaderservice = async (payload) => {
        const mysql =`
            SELECT * FROM "blCpi".spec_header
            WHERE spec_header_id = $1
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}


const postHeader= async (payload) => {
    // console.log("payload", payload)
        const {
            spec_code, sale_code, certificate, customer_id,
            formulation, chanel_option_id, document_status_option_id,
            status_check_id, revision, remark
        } = payload;
        const mysql = `
            INSERT INTO "blCpi".spec_header 
            (spec_code, sale_code, certificate, customer_id, formulation, chanel_option_id, document_status_option_id, status_check_id, revision, remark)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
    
        const values = [
            spec_code, sale_code, certificate, customer_id,
            formulation, chanel_option_id, document_status_option_id,
            status_check_id, revision, remark
          ];
    const result = await dbconnect.query(mysql, values);
    
    return result.rows
}
const putHeader= async (payload) => {
    // console.log("payload", payload)
        const {
            spec_code, sale_code, certificate, customer_id,
            formulation, chanel_option_id, document_status_option_id,
            status_check_id, revision, remark, spec_header_id
        } = payload;
        const mysql = `
            UPDATE "blCpi".spec_header 
            SET spec_code = $1, sale_code = $2, certificate = $3, customer_id = $4, 
                formulation = $5, chanel_option_id = $6, document_status_option_id = $7, 
                status_check_id = $8, revision = $9, remark = $10
            WHERE spec_header_id = $11
            RETURNING *;
        `;
    
        const values = [
            spec_code, sale_code, certificate, customer_id,
            formulation, chanel_option_id, document_status_option_id,
            status_check_id, revision, remark, spec_header_id
          ];
    const result = await dbconnect.query(mysql, values);
    
    return result.rows
}
const deleteHeader = async (payload) => {
    // console.log("payload", payload)
        const mysql = `
            DELETE FROM "blCpi".spec_header WHERE spec_header_id = $1
            RETURNING *;
        `;
    
        
    const result = await dbconnect.query(mysql, [payload.spec_header_id]);
    
    return result.rows
}
const checkDuplicate = async (payload) => {
    // console.log("payload", payload)
        const { spec_code } = payload;
        const mysql = `
        SELECT * FROM "blCpi".spec_header
        WHERE spec_code = $1
        
        `;
    
    const values = [spec_code];
    const result = await dbconnect.query(mysql, values);
    
    return result.rows
}
module.exports = {
    getAllspecHeaderservice,
    getSinglespecHeaderservice,
    postHeader,
    deleteHeader,
    putHeader,
    checkDuplicate

};

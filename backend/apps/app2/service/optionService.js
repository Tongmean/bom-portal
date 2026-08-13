const dbconnect = require('../../../Middleware/Dbconnect');
const getAllm_channel= async () => {
        const mysql =`
            SELECT * FROM "blCpi".m_chanel_option
            ORDER BY chanel_option_id ASC 

        `
        const result = await dbconnect.query(mysql);
        return result.rows
}
const getAllm_status = async () => {
        const mysql =`
            SELECT * FROM "blCpi".m_status
        `
        const result = await dbconnect.query(mysql);
        return result.rows
}
const getAllm_statusCheck= async () => {
        const mysql =`
            SELECT * FROM "blCpi".m_status_check
            ORDER BY status_check_id ASC 
        `
        const result = await dbconnect.query(mysql);
        return result.rows
}

const getAllm_componentHeader= async () => {
        const mysql =`
            SELECT * FROM "blCpi".m_compoent_header_option
     
        `
        const result = await dbconnect.query(mysql);
        return result.rows
}
const getAllm_documentStatus= async () => {
        const mysql =`
            SELECT * FROM "blCpi".m_document_status_option
     
        `
        const result = await dbconnect.query(mysql);
        return result.rows
}

const getOptioncomponent = async () => {
    const mysql =`
        SELECT DISTINCT
            compoent AS component,
            compoent_label AS component_label,
            unit
        FROM "blCpi".m_compoent_header_option
        WHERE unit IS NOT NULL
        `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getOptionroutingOrder = async () => {
    const mysql =`
    SELECT * 
        FROM "blCpi".process_routing_order pro
        LEFT JOIN "blCpi".process_routing pr
            ON pr.process_routing_id = pro.process_routing_id
        LEFT JOIN "blCpi".m_mat mat
            ON pr.mat_id = mat.mat_id
        LEFT JOIN "blCpi".m_compoent_header_option cho
            ON cho.compoent_header_option_id = pro.process
        ORDER BY process_routing_order_id ASC 
        `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getOptionheaderSpeccomponentOption = async () => {
    const mysql =`
        SELECT * FROM "blCpi".header_spec_component_option
        ORDER BY header_spec_component_option_id ASC 
        `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getOptionheaderSpeccomponent = async () => {
    const mysql =`
        SELECT * FROM "blCpi".header_spec_component
        ORDER BY header_spec_component_id ASC 
        `
    const result = await dbconnect.query(mysql);
    return result.rows
}
//product reg
const getOptiondrawing = async () => {
    const mysql =`
        SELECT * FROM "blCpi".drawing_header
        ORDER BY drawing_header_id DESC
        `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getOptionspec = async () => {
    const mysql =`
            SELECT * FROM "blCpi".spec_header
            ORDER BY spec_header_id DESC 
        `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getOptionsdpackage = async () => {
    const mysql =`
        SELECT * FROM "blCpi".sdpackaging_header
        ORDER BY sdpackaging_header_id DESC 
        `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getOptioncertificate = async () => {
    const mysql =`
        SELECT * FROM "blCpi".certificate
        ORDER BY certificate_id DESC 
        `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getOptionproduct_reg_item_option = async () => {
    const mysql =`
            SELECT * FROM "blCpi".product_reg_item_option
            ORDER BY option_header DESC 
        `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getOptionfoam = async () => {
    const mysql =`
    SELECT * FROM "blCpi".foam_header
    ORDER BY foam_header_id DESC 
        `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getOptiondisplay = async () => {
    const mysql =`
            SELECT 
            reg.product_reg_id,
            reg.production_type,
            fg_mat.erp AS FG_ERP, 
            fg_mat.name AS FG_name,
            reg.production_code, 


            reg.part_no, 
            drawing.compact_no AS drawing_no,
            semi_fg_mat.erp AS semi_fg_erp, 
            semi_fg_mat.name AS semi_fg_name,
            reg.pcs_per_set,
            spec.spec_code AS product_spec_code,
            spec.sale_code,
            spec.formulation,
            cus.country,
            entity.name AS customer_name,
            sdpackage.sdpackaing_code, -- (Check for spelling in DB)
            foam.part_no AS foam_part_no, -- Added Alias to prevent collision
            cer.aproval_code,          -- (Check for spelling in DB)
            status.label AS status,
            reg.remark,
            fg_mat.revision,
            sc.label AS status_check
            
        FROM "blCpi".product_reg reg

        LEFT JOIN "blCpi".m_mat fg_mat
            ON reg.fg_mat_id = fg_mat.mat_id
            
        LEFT JOIN "blCpi".drawing_header drawing
            ON reg.drawing_id = drawing.drawing_header_id
            
        -- spec_header JOIN removed because it is unused
            
        LEFT JOIN "blCpi".m_mat semi_fg_mat
            ON reg.semi_mat_id = semi_fg_mat.mat_id
            
        LEFT JOIN "blCpi".sdpackaging_header sdpackage
            ON reg.sdpackaging_id = sdpackage.sdpackaging_header_id
            
        LEFT JOIN "blCpi".foam_header foam
            ON reg.additional_form_id = foam.foam_header_id -- (Check form vs foam)

        LEFT JOIN "blCpi".certificate cer
            ON reg.certificate_id = cer.certificate_id

        LEFT JOIN "blCpi".m_status status
            ON reg.status_id = status.status_id
            
        LEFT JOIN "blCpi".m_status_check sc
            ON sc.status_check_id = fg_mat.status_check_id
        LEFT JOIN "blCpi".spec_header spec
            ON spec.spec_header_id = reg.spec_id 
        LEFT JOIN "blCpi".m_customer cus
            ON cus.customer_id = spec.customer_id
        LEFT JOIN "blCpi".m_entity entity
            ON entity.entity_id = cus.entity_id

            
        ORDER BY reg.product_reg_id DESC
        `
    const result = await dbconnect.query(mysql);
    return result.rows
}

module.exports = {
    getAllm_channel,
    getAllm_status,
    getAllm_statusCheck,
    getAllm_componentHeader,
    getAllm_documentStatus,
    getOptioncomponent,
    getOptionroutingOrder,
    getOptionheaderSpeccomponentOption,
    getOptionheaderSpeccomponent,

    getOptiondrawing,
    getOptionspec,
    getOptionsdpackage,
    getOptioncertificate,
    getOptionproduct_reg_item_option,
    getOptionfoam,
    getOptiondisplay



};
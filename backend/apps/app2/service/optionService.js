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
module.exports = {
    getAllm_channel,
    getAllm_status,
    getAllm_statusCheck,
    getAllm_componentHeader,
    getAllm_documentStatus,
    getOptioncomponent,
    getOptionroutingOrder,
    getOptionheaderSpeccomponentOption,
    getOptionheaderSpeccomponent


};
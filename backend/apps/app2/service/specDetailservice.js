const dbconnect = require('../../../Middleware/Dbconnect');
//detail
const getAllspecDetailservice = async () => {
        const mysql =`
        SELECT 
            --sd.spec_detail_id,
            sd.spec_header_id,
            cho.compoent_header_option_label AS component,
            mat.erp, mat.name,
            sd.quantity
            
        FROM "blCpi".spec_detail sd
        LEFT JOIN "blCpi"."m_compoent_header_option" cho
            ON sd.header_component = cho.compoent_header_option_id
        LEFT JOIN "blCpi"."m_mat" mat
            ON sd.mat_id = mat.mat_id
        ORDER BY compoent_header_option_label ASC,
        spec_header_id DESC

        `
        const result = await dbconnect.query(mysql);
        return result.rows
}

const getSinglespecDetailbyheaderservice = async (payload) => {
        const mysql =`
        
            SELECT
            *,
            mat_id::INTEGER AS mat_id
        FROM "blCpi".spec_detail
        WHERE spec_header_id = $1
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const postDetail = async (payload) => {
    // console.log("payload", payload)
        const {
            spec_header_id, header_component, mat_id, quantity
        } = payload;
        const mysql = `
            INSERT INTO "blCpi".spec_detail (spec_header_id, header_component, mat_id, quantity)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
    
        const values = [
            spec_header_id, header_component, mat_id, quantity
          ];
    const result = await dbconnect.query(mysql, values);
    
    return result.rows
}
const putDetail= async (payload) => {
    // console.log("payload", payload)
        const {
            spec_header_id, header_component, mat_id, quantity
        } = payload;
        const mysql = `
            UPDATE "blCpi".spec_detail
            SET spec_header_id = $1, header_component = $2, mat_id = $3, quantity = $4
            WHERE spec_detail_id = $5
            RETURNING *;
        `;
    
        const values = [
            spec_header_id, header_component, mat_id, quantity
          ];
    const result = await dbconnect.query(mysql, values);
    
    return result.rows
}
const deleteDetail = async (payload) => {
    // console.log("payload", payload)
        const mysql = `
        DELETE FROM "blCpi".spec_detail WHERE spec_detail_id = $1 
            RETURNING *;
        `;
    
        
    const result = await dbconnect.query(mysql, [payload.spec_detail_id]);
    
    return result.rows
}
//item
const getAllspecItemservice = async () => {
        const mysql1 =`
        SELECT 
            --si.spec_item_id,
            si.spec_header_id,
            hsc.header_spec_component_label AS component,
            hsco.header_spec_component_label AS detail
        FROM "blCpi".spec_item si
        LEFT JOIN "blCpi"."header_spec_component" hsc
            ON si.header_component_item = hsc.header_spec_component_id
        LEFT JOIN "blCpi"."header_spec_component_option" hsco
            ON si.detail = hsco.header_spec_component_option_id
        WHERE hsc.option = true
        ORDER BY spec_item_id ASC 

        `
        const mysql2 =`
        SELECT 
            --si.spec_item_id,
            si.spec_header_id,
            hsc.header_spec_component_label AS component,
            si.detail
        FROM "blCpi".spec_item si
        LEFT JOIN "blCpi"."header_spec_component" hsc
            ON si.header_component_item = hsc.header_spec_component_id
        WHERE hsc.option = false
        ORDER BY spec_item_id ASC 

        `
        const result1 = await dbconnect.query(mysql1);
        const result2 = await dbconnect.query(mysql2);

        return ([...result1.rows, ...result2.rows])
}
const getSinglespecItembyheaderservice = async (payload) => {
    const mysql =`
    
        SELECT * FROM "blCpi".spec_item
        WHERE spec_header_id = $1
    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}
const postItem= async (payload) => {
    // console.log("payload", payload)
        const {
            spec_header_id, header_component_item, detail
        } = payload;
        const mysql = `
            INSERT INTO "blCpi".spec_item (spec_header_id, header_component_item, detail)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
    
        const values = [
            spec_header_id, header_component_item, detail
          ];
    const result = await dbconnect.query(mysql, values);
    
    return result.rows
}
const putItem= async (payload) => {
    // console.log("payload", payload)
        const {
            spec_header_id, header_component_item, detail, spec_item_id
        } = payload;
        const mysql = `
            UPDATE "blCpi".spec_item
            SET spec_header_id = $1, 
                header_component_item = $2, 
                detail = $3
            WHERE spec_item_id = $4
            RETURNING *;
        `;
    
        const values = [
            spec_header_id, header_component_item, detail, spec_item_id
          ];
    const result = await dbconnect.query(mysql, values);
    
    return result.rows
}
const deleteItem = async (payload) => {
    // console.log("payload", payload)
        const mysql = `
        DELETE FROM "blCpi".spec_item WHERE spec_item_id = $1
            RETURNING *;
        `;
    
        
    const result = await dbconnect.query(mysql, [payload.spec_item_id]);
    
    return result.rows
}

module.exports = {
    getAllspecDetailservice,
    getAllspecItemservice,
    
    getSinglespecItembyheaderservice,
    getSinglespecDetailbyheaderservice,

    postDetail,
    putDetail,
    deleteDetail,

    postItem,
    putItem,
    deleteItem

};

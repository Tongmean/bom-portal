const dbconnect = require('../../../middleWare/Dbconnect');
const getSingledetail = async (payload) => {
        const mysql =`
            SELECT * FROM "blCpi".sdpackaging_detail
            WHERE sdpackaging_detail_id = $1

        `
        const result = await dbconnect.query(mysql, [payload.sdpackaging_detail_id]);
        return result.rows
}
const getSingledetailbyheader_id = async (payload) => {
        // const {drawing_header_id} = payload;
        const mysql =`
        SELECT * FROM "blCpi".sdpackaging_detail
        WHERE sdpackaging_header_id = $1

        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}

const postDetail = async (payload) => {
    // console.log("payload", payload)
    const { sdpackaging_header_id, component_header, mat_id, quantity } = payload;

    const mysql = `
        INSERT INTO "blCpi".sdpackaging_detail (
            sdpackaging_header_id, 
            component_header, 
            mat_id, 
            quantity
        ) VALUES ($1, $2, $3, $4)
        RETURNING *; 
    `;

    const values = [sdpackaging_header_id, component_header, mat_id, quantity];
    const result = await dbconnect.query(mysql, values);

    return result.rows
}
const putDetail = async (payload) => {
    const {  component_header, mat_id, quantity, sdpackaging_detail_id } = payload;

    const mysql = `
        UPDATE "blCpi".sdpackaging_detail
        SET 
            component_header = $1, 
            mat_id = $2, 
            quantity = $3
        WHERE sdpackaging_detail_id = $4
        RETURNING *;
    `;

    const values = [ component_header, mat_id, quantity, sdpackaging_detail_id];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}
const deleteDetail = async (payload) => {
    const { 
        sdpackaging_detail_id
        
    
    } = payload;


    const mysql = `
        DELETE FROM "blCpi".sdpackaging_detail
        WHERE sdpackaging_detail_id = $1
        RETURNING *;
    `;

    const values = [
        sdpackaging_detail_id // Maps to $11 in the WHERE clause
    ];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}


module.exports = {
    postDetail,
    putDetail,
    getSingledetail,
    getSingledetailbyheader_id,
    deleteDetail
};

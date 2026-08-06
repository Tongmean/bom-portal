const dbconnect = require('../../../middleWare/Dbconnect');
const getSingledetailEngineering = async (payload) => {
        const mysql =`
            SELECT * FROM "blCpi".drawing_detail
            WHERE drawing_detail_id = $1

        `
        const result = await dbconnect.query(mysql, [payload.drawing_detail_id]);
        return result.rows
}
const getSingledetailEngineeringbyheader_id = async (payload) => {
        // const {drawing_header_id} = payload;
        const mysql =`
            SELECT * FROM "blCpi".drawing_detail
            WHERE drawing_header_id = $1

        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}

const postDetailenginnering = async (payload) => {
    // console.log("payload", payload)
    const { 
        component_header,
        mat_id,
        id,
        quantity,
        height,
        width,
        thick_upper,
        thick_lower,
        curve,
        area,
        hole
     } = payload;
    const mysql = `
        INSERT INTO "blCpi".drawing_detail(
            component_header, mat_id, id, quantity, height, width, thick_upper, thick_lower, curve, area, hole
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
    `;

    const values = [
        component_header || null,
        mat_id || null,
        id || null,
        quantity || null,
        height || null,
        width || null,
        thick_upper || null,
        thick_lower || null,
        curve || null,
        area || null,
        hole || null
    ];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}
const putDetailenginnering = async (payload) => {
    const { 
        drawing_detail_id,
        drawing_header_id,
        component_header,
        mat_id,
        id, // Note: If 'id' is a separate column from the PK, include it here
        quantity,
        height,
        width,
        thick_upper,
        thick_lower,
        curve,
        area,
        hole
    
    } = payload;


    const mysql = `
        UPDATE "blCpi".drawing_detail
        SET 
            drawing_header_id = $1, 
            component_header = $2, 
            mat_id = $3, 
            id = $4, 
            quantity = $5, 
            height = $6, 
            width = $7, 
            thick_upper = $8, 
            thick_lower = $9, 
            curve = $10,
            area = $11,
            hole = $12
        WHERE drawing_detail_id = $13
        RETURNING *;
    `;

    const values = [
        drawing_header_id,
        component_header,
        mat_id,
        id,
        quantity,
        height,
        width,
        thick_upper,
        thick_lower,
        curve,
        area,
        hole,
        drawing_detail_id // Maps to $11 in the WHERE clause
    ];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}
const deleteDetailenginnering = async (payload) => {
    const { 
        drawing_detail_id
        
    
    } = payload;


    const mysql = `
        DELETE FROM "blCpi".drawing_detail
        WHERE drawing_detail_id = $1
        RETURNING *;
    `;

    const values = [
        drawing_detail_id // Maps to $11 in the WHERE clause
    ];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}

///file
module.exports = {
    postDetailenginnering,
    putDetailenginnering,
    getSingledetailEngineering,
    getSingledetailEngineeringbyheader_id,
    deleteDetailenginnering
};

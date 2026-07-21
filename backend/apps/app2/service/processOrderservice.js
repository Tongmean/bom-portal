const dbconnect = require('../../../Middleware/Dbconnect');
//processRouting
const getAllprocessRouting = async () => {
        const mysql =`
                SELECT * FROM "blCpi".process_routing
                ORDER BY process_routing_id DESC 
        
        `
        const result = await dbconnect.query(mysql);
        return result.rows
}
const checkDuplicate = async (payload) => {
        const mysql =`
                SELECT * FROM "blCpi".process_routing
                WHERE mat_id = $1        
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const getSingleprocessRouting = async (payload) => {
        const mysql =`
                SELECT * FROM "blCpi".process_routing
                WHERE process_routing_id = $1
        
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const postSingleprocessRouting = async (payload) => {
        const mysql =`
                INSERT INTO "blCpi".process_routing(mat_id, revision, remark)
                VALUES ($1, $2, $3)
                RETURNING *;
        
        `
        const result = await dbconnect.query(mysql, [payload.mat_id,payload.revision, payload.remark]);
        return result.rows
}
const putProcessRouting = async (payload) => {
        const sql = `
            UPDATE "blCpi".process_routing
            SET
                mat_id = $1,
                revision = $2,
                remark = $3
            WHERE process_routing_id = $4
            RETURNING *;
        `;
    
        const result = await dbconnect.query(sql, [
            payload.mat_id,
            payload.revision,
            payload.remark,
            payload.process_routing_id,
        ]);
    
        return result.rows;
};
const deleteProcessRouting = async (process_routing_id) => {
        const sql = `
            DELETE FROM "blCpi".process_routing
            WHERE process_routing_id = $1
            RETURNING *;
        `;
    
        const result = await dbconnect.query(sql, [process_routing_id]);
    
        return result.rows;
};

///processOrder
const getAllprocessRoutingorder = async () => {
        const mysql =`
        SELECT 
                pro.process_routing_order_id,
                pro.process_routing_id,
                pro.process_order,
                cho.compoent_header_option_label AS process
        FROM "blCpi".process_routing_order pro
        LEFT JOIN "blCpi".m_compoent_header_option cho
        ON pro.process = cho.compoent_header_option_id
        ORDER BY process_routing_order_id 

        `
        const result = await dbconnect.query(mysql);
        return result.rows
}

const getSinlgeprocessRoutingorderbyroutingid = async (payload) => {
        const mysql =`
                SELECT * FROM "blCpi".process_routing_order
                WHERE process_routing_id = $1
        
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const getSinlgeprocessRoutingorder = async (payload) => {
        const mysql =`
                SELECT * FROM "blCpi".process_routing_order
                WHERE process_routing_order_id = $1
        
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const postSingleProcessRoutingOrder = async (payload) => {
        const sql = `
            INSERT INTO "blCpi".process_routing_order (
                process_routing_id,
                process_order,
                process
            )
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
    
        const result = await dbconnect.query(sql, [
            payload.process_routing_id,
            payload.process_order,
            payload.process,
        ]);
    
        return result.rows;
};
const putProcessRoutingOrder = async (payload) => {
        const sql = `
            UPDATE "blCpi".process_routing_order
            SET
                process_routing_id = $1,
                process_order = $2,
                process = $3
            WHERE process_routing_order_id = $4
            RETURNING *;
        `;
    
        const result = await dbconnect.query(sql, [
            payload.process_routing_id,
            payload.process_order,
            payload.process,
            payload.process_routing_order_id,
        ]);
    
        return result.rows;
};

const deleteProcessRoutingOrder = async (process_routing_order_id) => {
    const sql = `
        DELETE FROM "blCpi".process_routing_order
        WHERE process_routing_order_id = $1
        RETURNING *;
    `;

    const result = await dbconnect.query(sql, [process_routing_order_id]);

    return result.rows;
};
//process_routing_order


module.exports = {
    getAllprocessRouting,
    getAllprocessRoutingorder,
    getSinlgeprocessRoutingorderbyroutingid,
    getSingleprocessRouting,
    postSingleProcessRoutingOrder,
    postSingleprocessRouting,
    putProcessRouting,
    putProcessRoutingOrder,
    deleteProcessRouting,
    deleteProcessRoutingOrder,
    checkDuplicate,
    getSinlgeprocessRoutingorder
};

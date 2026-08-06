const dbconnect = require('../../../Middleware/Dbconnect');
const getSinglebyparrent = async (payload) => {
        const mysql =`
        WITH RECURSIVE bom AS (
            SELECT
                bd.bom_detail_id,
                mat_p.erp AS parent,
                mat_c.erp AS child,
                bd.quantity,
                bd.priority
            FROM "blCpi".bom_detail bd
            LEFT JOIN "blCpi".m_mat mat_p
                ON bd.parrent_mat_id = mat_p.mat_id
            LEFT JOIN "blCpi".m_mat mat_c
                ON bd.child_mat_id = mat_c.mat_id
        ),
        
        bom_tree AS (
            -- Root (Anchor Member)
            SELECT
                bom_detail_id,
                parent,
                child,
                quantity,
                priority,
                1 AS level,
                quantity AS total_qty,
                parent AS semi_fg,
                -- Cast as TEXT to prevent length mismatch errors in the recursive step
                CAST(parent || ' -> ' || child AS TEXT) AS path 
            FROM bom
            WHERE parent = $1
        
            UNION ALL
        
            -- Children (Recursive Member)
            SELECT
                b.bom_detail_id,
                b.parent,
                b.child,
                b.quantity,
                b.priority,
                bt.level + 1,
                bt.total_qty * b.quantity,
                bt.semi_fg,
                CAST(bt.path || ' -> ' || b.child AS TEXT) AS path
            FROM bom b
            JOIN bom_tree bt
                ON b.parent = bt.child
            -- Failsafe: Stops the query if a data error creates an infinite loop
            WHERE bt.level < 50 
        )
        
        SELECT *
        FROM bom_tree
        ORDER BY 
            level, 
            path,
            bom_detail_id DESC


        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const getSingle = async (payload) => {
        const mysql =`
        SELECT * FROM "blCpi".bom_detail 
        WHERE bom_detail_id = $1


        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}

const checkDuplicate = async (payload) => {
    // console.log("payload", payload)
        const { parrent_mat_id, child_mat_id } = payload;
        const mysql = `
            SELECT *
        FROM "blCpi".bom_detail 
        WHERE parrent_mat_id = $1
        AND child_mat_id = $2
        `;
    
    const values = [parrent_mat_id, child_mat_id];
    const result = await dbconnect.query(mysql, values);
    
    return result.rows
}
const postBomdetail= async (payload) => {
    // console.log("payload", payload)
        const { parrent_mat_id, child_mat_id, quantity, priority } = payload;
        const mysql = `
        INSERT INTO "blCpi".bom_detail (parrent_mat_id, child_mat_id, quantity, priority) 
        VALUES ($1, $2, $3, $4) RETURNING *
        `;
    
    const values = [parrent_mat_id, child_mat_id, quantity, priority];
    const result = await dbconnect.query(mysql, values);
    
    return result.rows
}
const putBomdetail = async (payload) => {
    // console.log("payload", payload)
        const { bom_detail_id, parrent_mat_id, child_mat_id, quantity, priority } = payload;
        const mysql = `
            UPDATE "blCpi".bom_detail 
            SET parrent_mat_id = $1, child_mat_id = $2, quantity = $3, priority = $4 
            WHERE bom_detail_id = $5 RETURNING *
        `;
    
    const values = [parrent_mat_id, child_mat_id, quantity, priority, bom_detail_id ];
    const result = await dbconnect.query(mysql, values);
    
    return result.rows
}
const deleteBomdetail= async (payload) => {
    // console.log("payload", payload)
        const { bom_detail_id} = payload;
        const mysql = `
            DELETE FROM "blCpi".bom_detail WHERE bom_detail_id = $1 RETURNING *
        `;
    
    const values = [bom_detail_id ];
    const result = await dbconnect.query(mysql, values);
    
    return result.rows
}


module.exports = {
    getSinglebyparrent,
    postBomdetail,
    deleteBomdetail,
    putBomdetail,
    getSingle,
    checkDuplicate

};

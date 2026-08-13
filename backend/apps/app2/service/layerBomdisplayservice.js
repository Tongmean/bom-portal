const dbconnect = require('../../../Middleware/Dbconnect');
//
const getAlllayer0 = async (payload) => {
        const mysqlsd =`
        SELECT 
            fg_mat.erp AS FG_ERP, 
            reg.production_code, 
            sd_mat.erp AS child, 
            sd_mat.name AS child_name, 
            ROUND(1.0 / NULLIF(sdpackage_detail.quantity, 0), 2) AS quantity,
            0 AS level
        FROM "blCpi".product_reg reg
        LEFT JOIN "blCpi".m_mat fg_mat
            ON reg.fg_mat_id = fg_mat.mat_id
        LEFT JOIN "blCpi".sdpackaging_header sdpackage
            ON reg.sdpackaging_id = sdpackage.sdpackaging_header_id
        LEFT JOIN "blCpi".sdpackaging_detail sdpackage_detail
            ON sdpackage_detail.sdpackaging_header_id = sdpackage.sdpackaging_header_id
        LEFT JOIN "blCpi".m_mat sd_mat
            ON sd_mat.mat_id = sdpackage_detail.mat_id
        WHERE reg.production_code = $1
        ORDER BY reg.product_reg_id DESC;

        `
        const resultSd = await dbconnect.query(mysqlsd, [payload]);
        const mysqlSpec =`
        SELECT 
            fg_mat.erp AS FG_ERP, 
            reg.production_code, 
            detail_mat.erp AS child, 
            detail_mat.name AS child_name, 
            detail.quantity,
            0 AS level
        FROM "blCpi".product_reg reg
        LEFT JOIN "blCpi".m_mat fg_mat
            ON reg.fg_mat_id = fg_mat.mat_id

        LEFT JOIN "blCpi".spec_detail detail
            ON reg.spec_id = detail.spec_detail_id
        LEFT JOIN "blCpi".m_mat detail_mat
            ON detail_mat.mat_id = detail.mat_id
        WHERE reg.production_code = $1
        ORDER BY reg.product_reg_id DESC;

        `
        const resultSpec = await dbconnect.query(mysqlSpec, [payload]);
        const mysqlFoam =`
        SELECT 
            fg_mat.erp AS FG_ERP, 
            reg.production_code, 
            detail_mat.erp AS child, 
            detail_mat.name AS child_name, 
            detail.quantity,
            0 AS level
        FROM "blCpi".product_reg reg
        LEFT JOIN "blCpi".m_mat fg_mat
            ON reg.fg_mat_id = fg_mat.mat_id

        LEFT JOIN "blCpi".foam_detail detail
            ON reg.additional_form_id  = detail.foam_header_id
        LEFT JOIN "blCpi".m_mat detail_mat
            ON detail_mat.mat_id = detail.mat_id
        ORDER BY reg.product_reg_id DESC;

        `
        const resultFoam = await dbconnect.query(mysqlFoam, [payload]);
        return [resultSd.rows, resultSpec.rows, resultFoam.rows];
}
const getAllbomtree = async (payload) => {
    const mysql =`
        WITH RECURSIVE bom AS (
            SELECT
                bd.bom_detail_id,
                mat_p.erp AS parent,
                mat_cat_c.mat_cat AS mat_cat_c,
                mat_c.erp AS child,
                mat_c.name AS child_name,
                bd.quantity,
                bd.priority
            FROM "blCpi".bom_detail bd
            LEFT JOIN "blCpi".m_mat mat_p
                ON bd.parrent_mat_id = mat_p.mat_id
            LEFT JOIN "blCpi".m_mat mat_c
                ON bd.child_mat_id = mat_c.mat_id
            LEFT JOIN "blCpi".m_mat_cat mat_cat_c
                ON mat_cat_c.mat_id = mat_c.mat_id
        ),
        
        bom_tree AS (
            -- Root (Anchor Member)
            SELECT
                bom_detail_id,
                parent,
                child,
                child_name,
                quantity,
                priority,
                0 AS level,
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
                b.child_name,
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
    const result = await dbconnect.query(mysql, [payload.compact_no, payload.formulation, payload.revision]);
    return result.rows
}
const getAllbomtreeHp = async (payload) => {
    const mysql =`
    WITH RECURSIVE bom AS (
        SELECT
            bd.bom_detail_id,
            mat_p.erp AS parent,
            mat_cat_c.mat_cat AS mat_cat_c,
            mat_c.erp AS child,
            mat_c.name AS child_name,
            bd.quantity,
            bd.priority
        FROM "blCpi".bom_detail bd
        LEFT JOIN "blCpi".m_mat mat_p
            ON bd.parrent_mat_id = mat_p.mat_id
        LEFT JOIN "blCpi".m_mat mat_c
            ON bd.child_mat_id = mat_c.mat_id
        LEFT JOIN "blCpi".m_mat_cat mat_cat_c
            ON mat_cat_c.mat_id = mat_c.mat_id
    ),
    
    bom_tree AS (
        -- Root (Anchor Member)
        SELECT
            bom_detail_id,
            parent,
            child,
            child_name,
            mat_cat_c,
            quantity,
            priority,
            0 AS level,
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
            b.child_name,
            b.mat_cat_c,
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
    WHERE mat_cat_c LIKE '%HP%' -- Added filter here
    ORDER BY 
        level, 
        path,
        bom_detail_id DESC;
    `
    const result = await dbconnect.query(mysql, [payload.compact_no, payload.formulation, payload.revision]);
    return result.rows
}


const getAllhpheightestWeight = async () => {
    const mysql =`
    SELECT DISTINCT ON (mat.erp, mat_bom.erp)
        mat.erp AS parrent,
        mat_bom.erp AS mat_id,
        mat_bom.name AS mat_name,
        protb.value AS quantity
    FROM "blCpi".process_routing_order_tooling_bom protb
    LEFT JOIN "blCpi".process_routing_order_tooling prot
        ON protb.process_routing_tooling_id = prot.process_routing_tooling_id
    LEFT JOIN "blCpi".process_routing_order pro
        ON pro.process_routing_order_id = prot.process_routing_order_id
    LEFT JOIN "blCpi".process_routing pr
        ON pr.process_routing_id = pro.process_routing_id
    LEFT JOIN "blCpi".m_mat mat
        ON mat.mat_id = pr.mat_id
    LEFT JOIN "blCpi".m_mat mat_bom
        ON mat_bom.mat_id = protb.mat_id
    WHERE pro.process = 'press'
    ORDER BY 
        mat.erp ASC, 
        mat_bom.erp ASC, 
        prot.tooling_id DESC;
    `
    const result = await dbconnect.query(mysql);
    return result.rows
}
module.exports = {
    getAlllayer0,
    getAllbomtree,
    getAllbomtreeHp,
    getAllhpheightestWeight



};
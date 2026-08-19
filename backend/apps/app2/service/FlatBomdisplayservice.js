const dbconnect = require('../../../Middleware/Dbconnect');
const { pivotERPData, pivotData } = require('../utility/pivotUltility');
const { leftJoin } = require('../utility/leftJoin') 



const getAllproductandspec = async (payload) => {
    const mysqlProduct =`
        SELECT 
            reg.product_reg_id,
            reg.production_type,
            fg_mat.erp AS FG_ERP, 
            fg_mat.name AS FG_name,
            reg.production_code, 
            reg.part_no, 
            drawing.compact_no AS drawing_no,
            reg.pcs_per_set,
            spec.spec_code AS product_spec_code,
            spec.sale_code,
            spec.formulation,
            co.label AS channel,
            cus.country,
            cus.nicK_name,
            cus.zone,
            entity.erp AS customer_id,
            entity.name AS customer_name,
            cer.aproval_code,          
            status.label AS status,
            reg.remark,
            fg_mat.revision,
            sc.label AS status_check
            
        FROM "blCpi".product_reg reg

        LEFT JOIN "blCpi".m_mat fg_mat
            ON reg.fg_mat_id = fg_mat.mat_id
            
        LEFT JOIN "blCpi".drawing_header drawing
            ON reg.drawing_id = drawing.drawing_header_id
            
        LEFT JOIN "blCpi".m_mat semi_fg_mat
            ON reg.semi_mat_id = semi_fg_mat.mat_id
            
        LEFT JOIN "blCpi".sdpackaging_header sdpackage
            ON reg.sdpackaging_id = sdpackage.sdpackaging_header_id
            
        LEFT JOIN "blCpi".foam_header foam
            ON reg.additional_form_id = foam.foam_header_id 

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
        LEFT JOIN "blCpi".m_chanel_option co
            ON co.chanel_option_id = spec.chanel_option_id
        WHERE reg.production_code = $1
        ORDER BY reg.product_reg_id DESC
    `
    // FIX 1: Added .rows here
    const resultProduct = (await dbconnect.query(mysqlProduct, [payload])).rows; 

    const mysqlProductitem =`
        SELECT 
            product.production_code,
            item_option.component_label AS component,
            item_option.option_header_label AS optional_header
        FROM "blCpi".product_reg_item reg_item
        LEFT JOIN "blCpi".product_reg product
            ON product.product_reg_id = reg_item.product_reg_id
        LEFT JOIN "blCpi".product_reg_item_option item_option
            ON reg_item.option_header = item_option.component
            AND reg_item.detail = item_option.option_header
        WHERE product.production_code = $1
    `
    const resultProductitem = (await dbconnect.query(mysqlProductitem, [payload])).rows;
    
    const pivotedItemResult = pivotData(resultProductitem, {
        groupBy: ['production_code'],
        pivotColumnKey: 'component',
        pivotValueKey: 'optional_header'
    });
    
    // Cleaned up the extra parentheses around resultProduct
    const productResult = leftJoin(resultProduct, pivotedItemResult, 'production_code', 'production_code');
    
    const mysqlSpecitem =`
            SELECT 
                product.production_code,
                hsc.header_spec_component_label AS component,
                hsco.header_spec_component_label AS detail
            FROM "blCpi".spec_item si
            LEFT JOIN "blCpi"."header_spec_component" hsc
                ON si.header_component_item = hsc.header_spec_component_id
            LEFT JOIN "blCpi"."header_spec_component_option" hsco
                ON si.detail = hsco.header_spec_component_option_id
            LEFT JOIN "blCpi".product_reg product
                ON product.spec_id = si.spec_header_id
            WHERE hsc.option = true AND product.production_code = $1
            ORDER BY spec_item_id ASC 
        `
    
    // FIX 2: Added .rows here
    const resultSpecitem = (await dbconnect.query(mysqlSpecitem, [payload])).rows;
    
    const pivotSpecitem = pivotData(resultSpecitem, {
        groupBy: ['production_code'],
        pivotColumnKey: 'component',
        pivotValueKey: 'detail'
    });
    
    const final = leftJoin(productResult, pivotSpecitem, 'production_code', 'production_code');

    return final;
}
const getAlllayer0 = async (payload) => {
    const mysqlSd =`
        SELECT 
            fg_mat.erp AS FG_ERP, 
            reg.production_code, 
            cho.compoent_header_option_label AS component,
            mat.erp AS erp, 
            mat.name AS name, 
            sdpackage_detail.quantity
        FROM "blCpi".product_reg reg
        LEFT JOIN "blCpi".m_mat fg_mat
            ON reg.fg_mat_id = fg_mat.mat_id
        LEFT JOIN "blCpi".sdpackaging_header sdpackage
            ON reg.sdpackaging_id = sdpackage.sdpackaging_header_id
        LEFT JOIN "blCpi".sdpackaging_detail sdpackage_detail
            ON sdpackage_detail.sdpackaging_header_id = sdpackage.sdpackaging_header_id
        LEFT JOIN "blCpi".m_mat mat
            ON mat.mat_id = sdpackage_detail.mat_id
        LEFT JOIN "blCpi"."m_compoent_header_option" cho
            ON sdpackage_detail.component_header = cho.compoent_header_option_id
        WHERE reg.production_code = $1
        ORDER BY reg.product_reg_id DESC;
    `
    const resultsd = await dbconnect.query(mysqlSd, [payload]);
    const pivotedresultsd = pivotERPData(resultsd.rows, ["production_code"]);
    const mysqlSpec =`
        SELECT 
            fg_mat.erp AS FG_ERP, 
            reg.production_code, 
            cho.compoent_header_option_label AS component,
            detail_mat.erp,
            detail_mat.name,
            detail.quantity
        FROM "blCpi".product_reg reg
        LEFT JOIN "blCpi".m_mat fg_mat
            ON reg.fg_mat_id = fg_mat.mat_id

        LEFT JOIN "blCpi".spec_detail detail
            ON reg.spec_id = detail.spec_header_id
        LEFT JOIN "blCpi".m_mat detail_mat
            ON detail_mat.mat_id = detail.mat_id
        LEFT JOIN "blCpi"."m_compoent_header_option" cho
        ON detail.header_component = cho.compoent_header_option_id
        WHERE reg.production_code = $1
        ORDER BY reg.product_reg_id DESC;
    `
    const resultSpec = await dbconnect.query(mysqlSpec, [payload]);
    const pivotedresultSpec = pivotERPData(resultSpec.rows, ["production_code"]);

    const mysqlFoam =`
        SELECT 
            fg_mat.erp AS FG_ERP, 
            reg.production_code, 
            cho.compoent_header_option_label AS component,
            detail_mat.erp, 
            detail_mat.name, 
            detail.quantity
        FROM "blCpi".product_reg reg
        LEFT JOIN "blCpi".m_mat fg_mat
            ON reg.fg_mat_id = fg_mat.mat_id

        LEFT JOIN "blCpi".foam_detail detail
            ON reg.additional_form_id  = detail.foam_header_id
        LEFT JOIN "blCpi".m_mat detail_mat
            ON detail_mat.mat_id = detail.mat_id

            
        LEFT JOIN "blCpi"."m_compoent_header_option" cho
            ON detail.component_header = cho.compoent_header_option_id
        WHERE reg.production_code = $1
                    AND detail_mat.erp IS NOT NULL
        ORDER BY reg.product_reg_id DESC;
    `
    const resultFoam = await dbconnect.query(mysqlFoam, [payload]);
    const pivotedresultFoam = pivotERPData(resultFoam.rows, ["production_code"]);

    const joinSdspec = leftJoin(pivotedresultsd, pivotedresultSpec, 'production_code', 'production_code')
    const joinSdspecFoam = leftJoin(joinSdspec, pivotedresultFoam, 'product_code', 'product_code')
    // console.log("joinSdspecFoam", joinSdspecFoam)
    return joinSdspecFoam
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

    const result = await dbconnect.query(mysql, [payload]);
    const mappedResult = result.rows.map(i=>({
        fg_erp: i.semi_fg,
        erp: i.child,
        name: i.child_name,
        component: `WIP_${i.level}`,
        quantity: i.total_qty
    }))
    const pivetmappedResult = pivotERPData(mappedResult, ['fg_erp'])
    return pivetmappedResult
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
    const result = await dbconnect.query(mysql, [payload]);
    const bomtreehpmapped = result?.rows?.map((i) => ({
        fg_erp: i.semi_fg,
        erp: i.child,
        name: i.child_name,
        total_quantity: i.total_qty,
        component: `WIP_${(Number(i.level) || 0) + 2}`
    })) || [];
    return bomtreehpmapped
}

module.exports = {
    getAlllayer0,
    getAllbomtree,
    getAllbomtreeHp,
    getAllproductandspec


};
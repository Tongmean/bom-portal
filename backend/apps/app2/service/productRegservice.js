const dbconnect = require('../../../Middleware/Dbconnect');
const getAllprodutReg= async () => {
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
        
            
        ORDER BY reg.product_reg_id DESC
        `
        const result = await dbconnect.query(mysql);
        return result.rows
}
const getSingleprodutReg = async (payload) => {
        const mysql =`
                SELECT * FROM "blCpi".product_reg
        WHERE product_reg_id = $1
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const checkDuplicate = async (payload) => {
        const mysql =`
                SELECT * FROM "blCpi".product_reg
        WHERE production_code = $1
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const postSingleheader = async (payload, {fg_mat_id}) => {
    const {
        production_code, production_type, part_no,
        drawing_id, spec_id, semi_mat_id, pcs_per_set,
        sdpackaging_id, additional_form_id, certificate_id, status_id, remark, revision
    } = payload;
    const sql = `INSERT INTO "blCpi".product_reg (
        fg_mat_id, production_code, production_type, part_no, drawing_id, spec_id, 
        semi_mat_id, pcs_per_set, sdpackaging_id, additional_form_id, certificate_id, 
        status_id, remark
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
      RETURNING *;`
    const values = [fg_mat_id, production_code, production_type, part_no, drawing_id, spec_id, 
        semi_mat_id, pcs_per_set, sdpackaging_id, additional_form_id, certificate_id, 
        status_id, remark]
    
    const result = await dbconnect.query(sql, values)
    return result.rows
}
const putSingleheader = async (payload, {fg_mat_id}) => {
    const {
        production_code, production_type, part_no,
        drawing_id, spec_id, semi_mat_id, pcs_per_set,
        sdpackaging_id, additional_form_id, certificate_id, status_id, remark, revision, product_reg_id
    } = payload;
    const sql = `UPDATE "blCpi".product_reg SET 
        fg_mat_id = $1, production_code = $2, production_type = $3, part_no = $4, 
        drawing_id = $5, spec_id = $6, semi_mat_id = $7, pcs_per_set = $8, 
        sdpackaging_id = $9, additional_form_id = $10, certificate_id = $11, 
        status_id = $12, remark = $13
        WHERE product_reg_id = $14 RETURNING *;`
    const values = [fg_mat_id, production_code, production_type, part_no, drawing_id, spec_id, 
        semi_mat_id, pcs_per_set, sdpackaging_id, additional_form_id, certificate_id, 
        status_id, remark, product_reg_id]
    
    const result = await dbconnect.query(sql, values)
    return result.rows
}
const deleteSingleheader = async (payload) => {
    const {
        product_reg_id
    } = payload;
    const sql = `
        DELETE FROM "blCpi".product_reg WHERE product_reg_id = $1 RETURNING *;
    `
    const values = [ product_reg_id]
    
    const result = await dbconnect.query(sql, values)
    return result.rows
}


///item
const getAllprodutRegitem= async () => {
    const mysql =`
    SELECT 
        reg_item.product_reg_id,
        item_option.component_label AS component,
        item_option.option_header_label AS optional_header
    FROM "blCpi".product_reg_item reg_item
    LEFT JOIN "blCpi".product_reg_item_option item_option
        ON reg_item.option_header = item_option.component 
        AND reg_item.detail = item_option.option_header
    `
    const result = await dbconnect.query(mysql);
    return result.rows
}

const getSingleprodutRegitembyregid = async (payload) => {
    const mysql =`
        SELECT * FROM "blCpi".product_reg_item
        WHERE product_reg_id = $1
    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}
const getSingleprodutRegitem = async (payload) => {
    const mysql =`
        SELECT * FROM "blCpi".product_reg_item
        WHERE product_reg_option_id = $1
    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}


const postSingledetail = async (payload) => {
    const {
        product_reg_id, option_header, detail
    } = payload;
    const sql = `
        INSERT INTO "blCpi".product_reg_item (product_reg_id, option_header, detail) 
        VALUES ($1, $2, $3) 
        RETURNING *
    `
    const values = [product_reg_id, option_header, detail]
    
    const result = await dbconnect.query(sql, values)
    return result.rows
}
const putSingledetail = async (payload) => {
    const {
       option_header, detail, product_reg_option_id
    } = payload;
    const sql = `UPDATE "blCpi".product_reg_item 
    SET option_header = $1, detail = $2 
    WHERE product_reg_option_id = $3 
    RETURNING *`
    const values = [ option_header, detail, product_reg_option_id]
    
    const result = await dbconnect.query(sql, values)
    return result.rows
}
const deleteSingledetail = async (payload) => {
    // const {
    //     product_reg_option_id
    // } = payload;
    const sql = `
        DELETE FROM "blCpi".product_reg_item WHERE product_reg_option_id = $1 RETURNING *;
    `
    // const values = [ product_reg_option_id]
    
    const result = await dbconnect.query(sql, [payload])
    return result.rows
}


module.exports = {
    getAllprodutReg,
    getAllprodutRegitem,


    getSingleprodutRegitembyregid,
    getSingleprodutReg,

    postSingleheader,
    putSingleheader,
    deleteSingleheader,


    postSingledetail,
    putSingledetail,
    deleteSingledetail,

    checkDuplicate,
    getSingleprodutRegitem

};
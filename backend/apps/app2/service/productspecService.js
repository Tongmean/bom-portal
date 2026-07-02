const dbconnect = require('../../../Middleware/Dbconnect');
const getAllproductspec = async () => {
        const mysql =`
            SELECT 
                ph.productspec_header_id,
                ph.productspec_code,
                ph.sale_code,
                    co.label AS channel,
                en.erp AS "customer_erp",
                en.name AS "customer_name",
                cus.nick_name,
                ph.formulation,
                ph.revit,
                ph.drill,
                ph.screen,
                ph.emark,
                cho.compoent_header_option_label AS component,
                mat.erp, mat.name, pd.quantity,
                ph.remark AS remark,
                ph.revision AS revision,
                 dso.label AS status,
                sc.label AS check_status
            FROM "blCpi".productspec_detail pd
            LEFT JOIN "blCpi".productspec_header ph
                ON pd.productspec_header_id = ph.productspec_header_id
            LEFT JOIN "blCpi".m_status_check AS sc
                ON sc.status_check_id = ph.check_status
            LEFT JOIN "blCpi".m_document_status_option AS dso
                ON dso.document_status_option_id = ph.document_status
            LEFT JOIN "blCpi".m_mat AS mat
                ON pd.mat_id = mat.mat_id
            LEFT JOIN "blCpi".m_compoent_header_option AS cho
                ON cho.compoent_header_option_id = pd.component_header
            LEFT JOIN "blCpi".m_customer AS cus
                ON cus.customer_id = ph.customer_id
            LEFT JOIN "blCpi".m_entity en
                ON cus.entity_id = en.entity_id
            LEFT JOIN "blCpi".m_chanel_option co
                ON co.chanel_option_id = ph.channel
                
                
            ORDER BY 
                ph.productspec_header_id ASC, 
                pd.productspec_detail_id DESC;

        `
        const result = await dbconnect.query(mysql);
        return result.rows
}
const getSingleproductspec = async (payload) => {
    // console.log("payload", payload)
        const mysql =`
            SELECT * FROM "blCpi".productspec_header
            WHERE productspec_header_id = $1

        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const checkDupliacteproductspec = async (payload) => {
        const mysql =`
            SELECT * FROM "blCpi".productspec_header
            WHERE productspec_code = $1

        `
        const result = await dbconnect.query(mysql, [payload.productspec_code]);
        return result.rows
}
const postProductspec = async (payload) => {
        const {
            productspec_code,
            formulation,
            revit,
            drill,
            screen,
            emark,
            channel,
            revision,
            remark,
            document_status,
            check_status,
            customer_id,
            sale_code
        } = payload;

        const mysql = `
            INSERT INTO "blCpi".productspec_header (
                productspec_code,
                formulation,
                revit,
                drill,
                screen,
                emark,
                channel,
                revision,
                remark,
                document_status,
                check_status,
                customer_id,
                sale_code
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7,
                $8, $9, $10, $11, $12, $13
            )
            RETURNING *;
        `;

        const values = [
            productspec_code,
            formulation,
            revit,
            drill,
            screen,
            emark,
            channel,
            revision,
            remark,
            document_status,
            check_status,
            customer_id,
            sale_code
        ];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}

const putProductspecheader = async (payload) => {
    const {
        productspec_header_id,
        productspec_code,
        formulation,
        revit,
        drill,
        screen,
        emark,
        channel,
        revision,
        remark,
        document_status,
        check_status,
        customer_id,
        sale_code
    } = payload;

    const mysql = `
        UPDATE "blCpi".productspec_header
        SET
            productspec_code = $1,
            formulation = $2,
            revit = $3,
            drill = $4,
            screen = $5,
            emark = $6,
            channel = $7,
            revision = $8,
            remark = $9,
            document_status = $10,
            check_status = $11,
            customer_id = $12,
            sale_code = $13
        WHERE productspec_header_id = $14
        RETURNING *;
    `;

    const values = [
        productspec_code,
        formulation,
        revit,
        drill,
        screen,
        emark,
        channel,
        revision,
        remark,
        document_status,
        check_status,
        customer_id,
        sale_code,
        productspec_header_id
    ];

    const result = await dbconnect.query(mysql, values);
    return result.rows;
}



module.exports = {
    getAllproductspec,
    postProductspec,
    checkDupliacteproductspec,
    getSingleproductspec,
    putProductspecheader
};
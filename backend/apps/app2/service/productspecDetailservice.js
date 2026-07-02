const dbconnect = require('../../../Middleware/Dbconnect');

const postProductspecdetailService = async (payload) => {
        const {
            productspec_header_id,
            component_header,
            mat_id,
            quantity,
        } = payload;

        const mysql = `
           INSERT INTO "blCpi".productspec_detail
            (
                productspec_header_id,
                component_header,
                mat_id,
                quantity
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const values = [
            productspec_header_id,
            component_header,
            mat_id,
            quantity,
        ];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}
const putProductspecdetailService = async (payload) => {
    const {
        productspec_detail_id,
        productspec_header_id,
        component_header,
        mat_id,
        quantity,
    } = payload;

    const mysql = `
        UPDATE "blCpi".productspec_detail
        SET
            productspec_header_id = $1,
            component_header = $2,
            mat_id = $3,
            quantity = $4
        WHERE productspec_detail_id = $5
        RETURNING *;
    `;

    const values = [
        productspec_header_id,
        component_header,
        mat_id,
        quantity,
        productspec_detail_id,
    ];

    const result = await dbconnect.query(mysql, values);
    return result.rows;
};

const getSingleproductspecDetail = async (payload) => {
        const mysql =`
            SELECT * FROM "blCpi".productspec_detail
            WHERE productspec_header_id = $1

        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const getSingleproductspecDetailbydetail_id = async (payload) => {
        const mysql =`
            SELECT * FROM "blCpi".productspec_detail
            WHERE productspec_detail_id = $1

        `
        const result = await dbconnect.query(mysql, [payload.productspec_detail_id]);
        return result.rows
}

const deleteProductspecdetailService = async (payload) => {
    const {
        productspec_detail_id,
    } = payload;

    const mysql = `
        DELETE FROM "blCpi".productspec_detail
        WHERE productspec_detail_id = $1
        RETURNING *;
    `;

    const values = [productspec_detail_id];

    const result = await dbconnect.query(mysql, values);
    return result.rows;
};

module.exports = {
    postProductspecdetailService,
    getSingleproductspecDetail,
    putProductspecdetailService,
    deleteProductspecdetailService,
    getSingleproductspecDetailbydetail_id
};
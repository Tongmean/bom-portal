const dbconnect = require('../../../Middleware/Dbconnect');
const getAllcustomer = async () => {
        const mysql =`
            SELECT 
                c.customer_id, e.erp, e.name, c.nick_name, c.zone, c.country, c.continent
            FROM "blCpi".m_customer c
            LEFT JOIN "blCpi".m_entity e
                ON e.entity_id = c.entity_id
            ORDER BY customer_id DESC 

        `
        const result = await dbconnect.query(mysql);
        return result.rows
}
const getAllcustomerbyid = async (id) => {
        const mysql =`
            SELECT * FROM "blCpi".m_customer
            WHERE customer_id = $1
            ORDER BY customer_id ASC 

        `
        const result = await dbconnect.query(mysql, [id]);
        return result.rows
}
const deleteArraycustomer = async (customer_id) => {
        const mysql =`
            DELETE FROM "blCpi".m_customer
            WHERE customer_id =$1
            RETURNING
        `
        const result = await dbconnect.query(mysql, [customer_id]);
        return result.rows
}
const postArraycustomer = async (payload) => {
        const {entity_id, nick_name, zone, country, continent} = payload
        const mysql =`
            INSERT INTO "blCpi".m_customer(entity_id, nick_name, zone, country, continent)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `
        const result = await dbconnect.query(mysql, [entity_id, nick_name, zone, country, continent]);
        return result.rows
}
const updateArraycustomer = async (payload) => {
        const {entity_id, nick_name, zone, country, continent, customer_id} = payload
        const mysql =`
            UPDATE "blCpi".m_customer
            SET 
                entity_id = $1,
                nick_name = $2, 
                zone = $3, 
                country = $4, 
                continent = $5
            WHERE customer_id = $6
            RETURNING *;

        `
        const result = await dbconnect.query(mysql, [entity_id, nick_name, zone, country, continent, customer_id]);
        return result.rows
}

module.exports = {
    getAllcustomer,
    deleteArraycustomer,
    postArraycustomer,
    getAllcustomerbyid,
    updateArraycustomer
};
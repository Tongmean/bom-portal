const dbconnect = require('../../../Middleware/Dbconnect');
const getAllentity = async () => {
        const mysql =`
            SELECT * FROM "blCpi".m_entity
            ORDER BY entity_id DESC 

        `
        const result = await dbconnect.query(mysql);
        return result.rows
}


module.exports = {
    getAllentity

};
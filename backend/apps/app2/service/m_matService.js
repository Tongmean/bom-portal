const dbconnect = require('../../../Middleware/Dbconnect');
const getAllmat = async () => {
        const mysql =`
            SELECT * FROM "blCpi".m_mat
            ORDER BY mat_id ASC 
        `
        const result = await dbconnect.query(mysql);
        return result.rows
}


module.exports = {
    getAllmat

};
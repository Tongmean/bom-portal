// logging.js
const dbconnect = require('../../../middleWare/Dbconnect'); 
async function logUpdate(table, column, record_id, oldValue, newValue, action, action_by) {
    const query = `
        INSERT INTO update_log (table_name, column_name, record_id, old_value, new_value, action, action_at, action_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [table, column, record_id, oldValue, newValue, action, (new Date), action_by];
    
    try {
        // Ensure the query is properly awaited
        await dbconnect.query(query, values);
        // Optionally log success
        // console.log("History Log successfully inserted");
    } catch (err) {
        console.error('Error logging update:', err); // Log the error if something goes wrong
    }
}

// utils/extractKeys.js
const extractKeys = (data, options = {}) => {
  const { pick, omit } = options;

  if (!Array.isArray(data) || data.length === 0) return [];

  let keys = Object.keys(data[0]);

  if (pick?.length) keys = keys.filter(k => pick.includes(k));
  if (omit?.length) keys = keys.filter(k => !omit.includes(k));

  return keys;
};

// module.exports = { extractKeys };
// const { extractKeys } = require('./utils/extractKeys');

// // All keys
// extractKeys(currentValue);
// // → ["customer_id", "erp", "name", "nick_name", "zone", "country", "continent"]

// // Only specific keys
// extractKeys(currentValue, { pick: ["customer_id", "name", "country"] });
// // → ["customer_id", "name", "country"]

// // Exclude specific keys
// extractKeys(currentValue, { omit: ["customer_id", "erp"] });
// // → ["name", "nick_name", "zone", "country", "continent"]
// Uses data[0] as the reference row — assumes all objects share the same shape, which is typical for table/grid data from a DB query.
module.exports = {
    logUpdate,
    extractKeys
};
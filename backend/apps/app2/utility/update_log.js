const {
    logUpdate,
    extractKeys,
} = require('../utility/log')
const dbconnect = require('../../../middleWare/Dbconnect'); 

const update_log = async (table_name, allColumn, record_id, old_Value, new_value,action_by) =>{
    
    // console.log("table_name, allColumn, record_id, old_Value, new_value,action_by", table_name, allColumn, record_id, old_Value, new_value,action_by)
    const column_name = Object.keys(allColumn);

    const logs = [];

    for (const column of column_name) {
        const oldValue = old_Value[column];
        const newValue = new_value[column];

        if (oldValue !== newValue) {
            const query = `
                INSERT INTO "blCpi".log_update
                (table_name, column_name, record_id, old_value, new_value, action, action_at, action_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *;
            `;

            const values = [
                table_name,
                column,
                record_id,
                oldValue,
                newValue,
                "updated",
                new Date(),
                action_by
            ];

            const log = await dbconnect.query(query, values);
            logs.push(log.rows[0]);
            // console.log("lof", log)
        }
    }
    return logs;
}

const delete_log = async (table_name,column_name, record_id,old_Value,action_by) =>{
    
    // console.log("table_name, allColumn, record_id, old_Value, new_value,action_by", table_name, allColumn, record_id, old_Value, new_value,action_by)

    const logs = [];
    const query = `
        INSERT INTO "blCpi".log_update
        (table_name, column_name, record_id, old_value, new_value, action, action_at, action_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;

    const values = [
        table_name,
        column_name,
        record_id,
        old_Value,
        "-",
        "deleted",
        new Date(),
        action_by
    ];

    const log = await dbconnect.query(query, values);
    logs.push(log.rows[0]); 
    return logs;
}
const create_log = async (table_name, record_id,action_by) =>{
    
    // console.log("table_name, allColumn, record_id, old_Value, new_value,action_by", table_name, allColumn, record_id, old_Value, new_value,action_by)

    const logs = [];
    const query = `
        INSERT INTO "blCpi".log_update
        (table_name, column_name, record_id, old_value, new_value, action, action_at, action_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;

    const values = [
        table_name,
        "create_by",
        record_id,
        "-",
        new Date(),
        "created",
        new Date(),
        action_by
    ];

    const log = await dbconnect.query(query, values);
    logs.push(log.rows[0]); 
    return logs;
}
// const create_log = async (table_name, record_id , action_by) =>{
//     // const column_name = extractKeys(allColumn[0]);
//     // const action = updated;
//         await logUpdate(table_name, "create_by", record_id, "-", "created" , action_by);
// }

module.exports = {
    update_log,
    create_log,
    delete_log
};
  
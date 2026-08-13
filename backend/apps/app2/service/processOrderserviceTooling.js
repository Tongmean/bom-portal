const dbconnect = require('../../../Middleware/Dbconnect');
//processRoutingtooling
const getAllprocessRoutingtooling = async () => {
        const mysql =`
        SELECT 
                prot.process_routing_tooling_id, prot.process_routing_order_id, prot.value, mat.erp AS tooling_id
        FROM "blCpi".process_routing_order_tooling prot
        LEFT JOIN "blCpi".m_mat mat
                ON mat.mat_id = prot.tooling_id
        ORDER BY process_routing_tooling_id Desc 
        
        `
        const result = await dbconnect.query(mysql);
        return result.rows
}
const deleteSingleprocessRoutingtooling = async (payload) => {
        const mysql =`
         
        DELETE FROM "blCpi".process_routing_order_tooling
        WHERE process_routing_tooling_id = $4
        RETURNING *;
        `
        const values = [
                payload.process_routing_tooling_id // WHERE condition
        ]
        const result = await dbconnect.query(mysql, values);
        return result.rows
}
const putSingleprocessRoutingtooling = async (payload) => {
        const mysql =`
         
        UPDATE "blCpi".process_routing_order_tooling
        SET
            process_routing_order_id = $1,
            tooling_id = $2,
            value = $3
        WHERE process_routing_tooling_id = $4
        RETURNING *;
        `
        const values = [
                payload.process_routing_order_id,
                payload.tooling_id,
                payload.value,
                payload.process_routing_tooling_id // WHERE condition
        ]
        const result = await dbconnect.query(mysql, values);
        return result.rows
}
const postSingleprocessRoutingtooling = async (payload) => {
        const mysql =`
                INSERT INTO "blCpi".process_routing_order_tooling (process_routing_order_id, tooling_id, value)
                VALUES ($1, $2, $3)  
                RETURNING *
        `
        const Values = [
                payload.process_routing_order_id, 
                payload.tooling_id, 
                payload.value
              ];
        const result = await dbconnect.query(mysql, Values);
        return result.rows
}

const getSingleprocessRoutingtooling = async (payload) => {
        const mysql =`
                SELECT * FROM "blCpi".process_routing_order_tooling
        WHERE process_routing_tooling_id = $1       
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const checkDuplicate = async (payload, {mat_id}) => {
        const mysql =`    
                SELECT * 
                FROM "blCpi".process_routing_order_tooling tooling
                LEFT JOIN "blCpi".process_routing_order_tooling_bom tooling_bom
                ON tooling.process_routing_tooling_id = tooling_bom.process_routing_tooling_id
                WHERE tooling.process_routing_order_id = $1
                AND tooling.tooling_id = $2
                AND tooling_bom.mat_id = $3
        `
        // const mysql =`    
        //         SELECT * FROM "blCpi".process_routing_order_tooling
        //         WHERE process_routing_order_id = $1
        //         AND tooling_id = $2     
        // `
        const result = await dbconnect.query(mysql, [payload.process_routing_order_id, payload.tooling_id, mat_id]);
        return result.rows
}


//processRoutingtoolingbom
const getAllprocessRoutingtoolingBom = async () => {
        const mysql =`
        SELECT 
                prot.process_routing_tooling_bom_id, prot.process_routing_tooling_id, mat.erp AS mat_id, prot.value
        FROM "blCpi".process_routing_order_tooling_bom prot
        LEFT JOIN "blCpi".m_mat mat
                on prot.mat_id = mat.mat_id
        ORDER BY process_routing_tooling_bom_id DESC 
        `
        const result = await dbconnect.query(mysql);
        return result.rows
}
const getSingleprocessRoutingtoolingBombybomid = async (payload) => {
        const mysql =`
        SELECT * FROM "blCpi".process_routing_order_tooling_bom
        WHERE process_routing_tooling_bom_id = $1       
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const getSingleprocessRoutingtoolingBom = async (payload) => {
        const mysql =`
        SELECT * FROM "blCpi".process_routing_order_tooling_bom
        WHERE process_routing_tooling_id = $1       
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const postSingleprocessRoutingtoolingBom = async (payload) => {
        const mysql =`
         
        INSERT INTO "blCpi".process_routing_order_tooling_bom (process_routing_tooling_id, mat_id, value)
        VALUES ($1, $2, $3)
        RETURNING *
        `
        const values = [
                payload.process_routing_tooling_id,
                payload.mat_id,
                payload.value
              ]
        const result = await dbconnect.query(mysql, values);
        return result.rows
}
const putSingleprocessRoutingtoolingBom = async (payload) => {
        const mysql =`
         
        UPDATE "blCpi".process_routing_order_tooling_bom
        SET
            process_routing_tooling_id = $1,
            mat_id = $2,
            value = $3
        WHERE process_routing_tooling_bom_id = $4
        RETURNING *;
        `
        const values = [
                payload.process_routing_tooling_id,
                payload.mat_id,
                payload.value,
                payload.process_routing_tooling_bom_id // WHERE condition
              ]
        const result = await dbconnect.query(mysql, values);
        return result.rows
}
const deleteSingleprocessRoutingtoolingBom = async (payload) => {
        const mysql =`
         
        DELETE FROM "blCpi".process_routing_order_tooling_bom
        WHERE process_routing_tooling_bom_id = $1
        RETURNING *;
        `
        const values = [
                payload.process_routing_tooling_bom_id // WHERE condition
              ]
        const result = await dbconnect.query(mysql, values);
        return result.rows
}

//processRoutingtoolingmachine
const getAllprocessRoutingtoolingMachine = async () => {
        const mysql =`
        SELECT 
                protm.process_routing_tooling_id,
                protm.value,
                mat.erp AS machine_id
        FROM "blCpi".process_routing_order_tooling_machine protm
        LEFT JOIN "blCpi".m_mat mat
                ON mat.mat_id = protm.machine_id
        ORDER BY process_routing_order_tooling_machine_id desc 
        `
        const result = await dbconnect.query(mysql);
        return result.rows
}
const getSingleprocessRoutingtoolingMachine = async (payload) => {
        const mysql =`
        SELECT * FROM "blCpi".process_routing_order_tooling_machine
        WHERE process_routing_tooling_id = $1       
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const getSingleprocessRoutingtoolingMachinebymachineid = async (payload) => {
        const mysql =`
        SELECT * FROM "blCpi".process_routing_order_tooling_machine
        WHERE process_routing_order_tooling_machine_id = $1       
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}
const postSingleprocessRoutingtoolingMachine = async (payload) => {
        const mysql =`   
        INSERT INTO "blCpi".process_routing_order_tooling_machine (process_routing_tooling_id, machine_id, value)
        VALUES ($1, $2, $3)
        RETURNING *
        `
        const values = [
                payload.process_routing_tooling_id,
                payload.machine_id,
                payload.value
              ]
        const result = await dbconnect.query(mysql, values);
        return result.rows
}
const putSingleprocessRoutingtoolingMachine = async (payload) => {
        const mysql =`   
        UPDATE "blCpi".process_routing_order_tooling_machine
        SET
            process_routing_tooling_id = $1,
            machine_id = $2,
            value = $3
        WHERE process_routing_order_tooling_machine_id = $4
        RETURNING *;
        `
        const values = [
                payload.process_routing_tooling_id,
                payload.machine_id,
                payload.value,
                payload.process_routing_order_tooling_machine_id,
        ]
        const result = await dbconnect.query(mysql, values);
        return result.rows
}
const deleteSingleprocessRoutingtoolingMachine = async (payload) => {
        const mysql =`   
        DELETE FROM "blCpi".process_routing_order_tooling_machine
        WHERE process_routing_order_tooling_machine_id = $1
        RETURNING *;
        `
        const values = [
                payload.process_routing_order_tooling_machine_id,
        ]
        const result = await dbconnect.query(mysql, values);
        return result.rows
}

module.exports = {
    getAllprocessRoutingtooling,
    getAllprocessRoutingtoolingBom,
    getAllprocessRoutingtoolingMachine,
    getSingleprocessRoutingtooling,
    getSingleprocessRoutingtoolingBom,
    getSingleprocessRoutingtoolingMachine,
    postSingleprocessRoutingtoolingMachine,
    postSingleprocessRoutingtooling,
    postSingleprocessRoutingtoolingBom,
    checkDuplicate,

    putSingleprocessRoutingtooling,
    putSingleprocessRoutingtoolingBom,
    putSingleprocessRoutingtoolingMachine,

    deleteSingleprocessRoutingtoolingMachine,
    deleteSingleprocessRoutingtooling,
    deleteSingleprocessRoutingtoolingBom,

    getSingleprocessRoutingtoolingBombybomid,
    getSingleprocessRoutingtoolingMachinebymachineid
}

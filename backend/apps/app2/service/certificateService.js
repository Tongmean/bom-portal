const dbconnect = require('../../../Middleware/Dbconnect');
//
const getAllcertificate = async () => {
        const mysql =`
        SELECT
            c.certificate_id,
            cho.compoent_header_option_label AS type_brake,
            c.compact_no,
            c.formulation,
            c.aproval_code,
            c.certificate_no,
            c.revision
            
                
                
        FROM "blCpi".certificate c
        LEFT JOIN "blCpi".m_compoent_header_option cho
            ON cho.compoent_header_option_id = c.type_brake
        ORDER BY certificate_id DESC 

        `
        const result = await dbconnect.query(mysql);
        return result.rows
}
const getSinglecertificatebyid = async (id) => {
        const mysql =`
            SELECT *
            FROM "blCpi".certificate 
           
            WHERE certificate_id = $1

        `
        const result = await dbconnect.query(mysql, [id]);
        return result.rows
}
const checkDuplicate = async (payload) => {
        const mysql =`
        SELECT * FROM "blCpi".certificate
        WHERE compact_no = $1 AND formulation = $2 AND revision = $3
        `
        const result = await dbconnect.query(mysql, [payload.compact_no, payload.formulation, payload.revision]);
        return result.rows
}
const deleteSinglecertificate= async (payload) => {
        const mysql =`
            DELETE FROM "blCpi".certificate
            WHERE certificate_id =$1
            RETURNING *
        `
        const result = await dbconnect.query(mysql, [payload]);
        return result.rows
}

const postSinglecertificate = async (payload) => {
        const mysql =`
            INSERT INTO "blCpi".certificate (
                type_brake, 
                compact_no, 
                formulation, 
                aproval_code, 
                certificate_no, 
                revision
            ) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *;
        `
        const values = [
            payload.type_brake,
            payload.compact_no,
            payload.formulation,
            payload.aproval_code,
            payload.certificate_no,
            payload.revision
        ];
        const result = await dbconnect.query(mysql, values);
        return result.rows
}
const putSinglecertificate = async (payload) => {
        const mysql =`
        UPDATE "blCpi".certificate 
        SET 
            type_brake = $1, 
            compact_no = $2, 
            formulation = $3, 
            aproval_code = $4, 
            certificate_no = $5, 
            revision = $6
        WHERE certificate_id = $7 
        RETURNING *;

        `
        const values = [
            payload.type_brake,
            payload.compact_no,
            payload.formulation,
            payload.aproval_code,
            payload.certificate_no,
            payload.revision,
            payload.certificate_id
        ];
        const result = await dbconnect.query(mysql, values);
        return result.rows
}
//cat
const getAllcertificatecat = async () => {
    const mysql =`
        SELECT * FROM "blCpi".certificate_cat
        ORDER BY certificate_id DESC 

    `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getSinglecertificatecatbyid = async (id) => {
    const mysql =`
        SELECT * FROM "blCpi".certificate_cat
        WHERE certificate_id = $1

    `
    const result = await dbconnect.query(mysql, [id]);
    return result.rows
}
const deleteSinglecertificatecat= async (payload) => {
    const mysql =`
        DELETE FROM "blCpi".certificate_cat
        WHERE certificate_id =$1
        RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}

const postSinglecertificatecat = async (payload) => {
    const mysql =`
        INSERT INTO "blCpi".certificate_cat (certificate_id, certificate_cat) 
        VALUES ($1, $2) 
        RETURNING *;
    `
    const values = [
       payload.certificate_id,
       payload.certificate_cat
    ];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}
const putSinglecertificatecat = async (payload) => {
    const mysql =`
        UPDATE "blCpi".certificate_cat 
        SET certificate_cat = $1 
        WHERE certificate_id = $2 
        RETURNING *;

    `
    const values = [
        payload.certificate_cat,
        payload.certificate_id
    ];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}
//type
const getAllcertificatetype = async () => {
    const mysql =`
        SELECT * FROM "blCpi".certificate_type
        ORDER BY certificate_id DESC 

    `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getSinglecertificatetypebyid = async (id) => {
    const mysql =`
        SELECT * FROM "blCpi".certificate_type
        WHERE certificate_id = $1

    `
    const result = await dbconnect.query(mysql, [id]);
    return result.rows
}
const deleteSinglecertificatetype = async (payload) => {
    const mysql =`
        DELETE FROM "blCpi".certificate_type
        WHERE certificate_id =$1
        RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}

const postSinglecertificatetype = async (payload) => {
    const mysql =`
        INSERT INTO "blCpi".certificate_type (certificate_id, certificate_type) 
        VALUES ($1, $2) 
        RETURNING *;
    `
    const values = [
       payload.certificate_id,
       payload.certificate_type
    ];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}
const putSinglecertificatetype = async (payload) => {
    const mysql =`
        UPDATE "blCpi".certificate_type
        SET certificate_type = $1 
        WHERE certificate_id = $2 
        RETURNING *;

    `
    const values = [
        payload.certificate_type,
        payload.certificate_id
    ];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}
//file
const getAllcertificatefile = async () => {
    const mysql =`
    SELECT certificate_id ,file_name AS file FROM "blCpi".certificate_file
    ORDER BY certificate_file_id ASC 

    `
    const result = await dbconnect.query(mysql);
    return result.rows
}
const getSinglecertificatefilebyid = async (id) => {
    const mysql =`
        SELECT certificate_id ,file_name AS file FROM "blCpi".certificate_file
        WHERE certificate_id = $1

    `
    const result = await dbconnect.query(mysql, [id]);
    return result.rows
}
const deleteSinglecertificatefile = async (payload) => {
    const mysql =`
        DELETE FROM "blCpi".certificate_file
        WHERE certificate_id =$1
        RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}

const postSinglecertificatefile = async (payload) => {
    const mysql =`
    INSERT INTO "blCpi".certificate_file (certificate_id, file_name, path)
    VALUES ($1, $2, $3)
    RETURNING *;
    `
    const values = [
       payload.certificate_id,
       payload.file_name,
         payload.path
    ];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}
const putSinglecertificatefile= async (payload) => {
    const {certificate_id, file_name, path} = payload
    const mysql =`
        UPDATE "blCpi".certificate_file
        SET 
        file_name = $1,
        path = $2
        WHERE certificate_id = $3
        RETURNING *;

    `
    const values = [file_name, path, certificate_id];
    const result = await dbconnect.query(mysql, values);
    return result.rows
}

module.exports = {
    getAllcertificate,
    getSinglecertificatebyid,
    postSinglecertificate,
    putSinglecertificate,
    deleteSinglecertificate,

    getAllcertificatecat,
    getSinglecertificatecatbyid,
    postSinglecertificatecat,
    putSinglecertificatecat,
    deleteSinglecertificatecat,

    getAllcertificatetype,
    getSinglecertificatetypebyid,
    postSinglecertificatetype,
    putSinglecertificatetype,
    deleteSinglecertificatetype,


    getAllcertificatefile,
    getSinglecertificatefilebyid,
    postSinglecertificatefile,
    putSinglecertificatefile,
    deleteSinglecertificatefile,

    checkDuplicate


};
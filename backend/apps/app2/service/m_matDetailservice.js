const dbconnect = require('../../../Middleware/Dbconnect');
//mat-cat
const getSinglematCat = async (payload) => {
        const mysql =`
        SELECT * FROM "blCpi".m_mat_cat
        WHERE mat_id = $1
     
        `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}
const postMatcat = async (payload) => {
    const mysql =`
    INSERT INTO "blCpi".m_mat_cat(
        mat_id, mat_cat)
        VALUES ($1, $2)
        RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload.mat_id, payload.mat_cat]);
    return result.rows
}
const putMatcat = async (payload) => {
    const mysql =`
    UPDATE "blCpi".m_mat_cat
    SET mat_cat=$1
    WHERE mat_id= $2
    RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload.mat_cat, payload.mat_id]);
    return result.rows
}
const deleteMatcat = async (payload) => {
    const mysql =`
    DELETE FROM "blCpi".m_mat_cat
    WHERE mat_id= $1
    RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload.mat_id]);
    return result.rows
}
//dimension
const getSinglematDimension = async (payload) => {
    const mysql =`
        SELECT * FROM "blCpi".m_mat_dimension
    WHERE mat_id = $1
    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}
const postMatdimension= async (payload) => {
    const mysql =`
    INSERT INTO "blCpi".m_mat_dimension(
        mat_id, height, width, thick, curve, area, min_thick, max_thick, cavity)
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload.mat_id, payload.height, payload.width, payload.thick, payload.curve, payload.area, payload.min_thick, payload.max_thick, payload.cavity]);
    return result.rows
}
const putMatdimension = async (payload) => {
    const mysql =`
    UPDATE "blCpi".m_mat_dimension
	SET height=$1, width=$2, thick=$3, curve=$4, area=$5, min_thick = $6, max_thick = $7, cavity = $8
    WHERE mat_id= $9
    RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload.height, payload.width, payload.thick, payload.curve, payload.area,payload.min_thick, payload.max_thick, payload.cavity, payload.mat_id]);
    return result.rows
}
const deleteMatDimension = async (payload) => {
    const mysql =`
    DELETE FROM "blCpi".m_mat_dimension
    WHERE mat_id= $1
    RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload.mat_id]);
    return result.rows
}
//mat-unit
const getSinglematUnit = async (payload) => {
    const mysql =`
    SELECT * FROM "blCpi".m_mat_unit
    WHERE mat_id = $1
    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}
const postMatunit = async (payload) => {
    const mysql =`
    INSERT INTO "blCpi".m_mat_unit(
        mat_id, weight, costperunit)
        VALUES ( $1, $2, $3)
        RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload.mat_id, payload.weight, payload.costperunit]);
    return result.rows
}
const putMatunit = async (payload) => {
    const mysql =`
    UPDATE "blCpi".m_mat_unit
	SET weight=$1, costperunit=$2
	WHERE mat_id = $3
    RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload.weight,payload.costperunit, payload.mat_id]);
    return result.rows
}
const deleteMatunit = async (payload) => {
    const mysql =`
    DELETE FROM "blCpi".m_mat_unit
    WHERE mat_id= $1
    RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload.mat_id]);
    return result.rows
}
//file
const getSinglematfile = async (payload) => {
    const mysql =`
    SELECT file_name AS file FROM "blCpi".m_mat_file
    WHERE mat_id = $1
    `
    const result = await dbconnect.query(mysql, [payload]);
    return result.rows
}
const postMatfile = async (payload) => {
    const mysql =`
    INSERT INTO "blCpi".m_mat_file(
        mat_id, file_name, path)
        VALUES ($1, $2, $3)
        RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload.mat_id, payload.file_name, payload.path]);
    return result.rows
}
const putMatfile = async (payload) => {
    const mysql =`
    UPDATE "blCpi".m_mat_file
	SET file_name=$1, path=$2
	WHERE mat_id = $3
    RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload.file_name, payload.path, payload.mat_id]);
    return result.rows
}
const deleteMatfile = async (payload) => {
    const mysql =`
    DELETE FROM "blCpi".m_mat_file
    WHERE mat_id= $1
    RETURNING *
    `
    const result = await dbconnect.query(mysql, [payload.mat_id]);
    return result.rows
}
//
module.exports = {
    getSinglematCat,
    getSinglematDimension,
    getSinglematUnit,
    getSinglematfile,

    postMatcat,
    postMatdimension,
    postMatunit,
    postMatfile,
    putMatcat,
    putMatdimension,
    putMatunit,
    putMatfile,
    deleteMatcat,
    deleteMatDimension,
    deleteMatunit,
    deleteMatfile

};
const dbconnect = require('../middleWare/Dbconnect')
const emailCheck = async (payload) => {
        const mysql =`
            SELECT id, email, password, role FROM public.users
            WHERE "email" = $1

        `
        const result = await dbconnect.query(mysql,[payload.email]);
        return result.rows
}
const getRole = async (payload) => {
        const mysql =`
            SELECT users.id AS user_id, users.email, users.role FROM public.users
            WHERE "email" = $1

        `
        const result = await dbconnect.query(mysql,[payload.email]);
        return result.rows
}
const getPermissionroute= async (payload) => {
        const mysql =`
            SELECT users.id AS user_id, users.email, "blCpi".user_route_item.route_item AS route
                FROM "blCpi"."userRoutepermission"
            LEFT JOIN public.users
                ON "blCpi"."userRoutepermission".user_id = users.id
            LEFT JOIN "blCpi".user_route_item
                ON "blCpi"."userRoutepermission".route_item_id = "blCpi".user_route_item.route_item_id
            WHERE "email" = $1

        `
        const result = await dbconnect.query(mysql,[payload.email]);
        return result.rows
}
module.exports = {
    emailCheck,
    getRole,
    getPermissionroute

};
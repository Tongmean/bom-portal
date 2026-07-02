const jwt = require('jsonwebtoken');
const dbconnect = require('./Dbconnect');

const requireAuth = async (req, res, next) => {
    // Destructuring Header req
    const { authorization } = req.headers;
    // console.log("authorization", authorization);

    if (!authorization) {
        return res.status(401).json({ msg: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];
    // console.log("token", token);

    try {
        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.SECRET);
        // console.log('Decoded Token:', decoded);
        // console.log("decoded",decoded);
        // Destructure id from decoded
        const { email } = decoded;
        // console.log("email", email);
        // // Fetch the user from the database asynchronously
        // // dbconnect.query('SELECT * FROM public.users WHERE "email" = $1', [email], (err, result) => {
        // //     if (err) {
        // //         console.error(err);
        // //         return res.status(500).json({ msg: 'Database query failed' });
        // //     }

        // //     if (result.rows.length === 0) {
        // //         return res.status(401).json({ msg: 'User not found' });
        // //     }
        // //     console.log()
        // //     // Store user information in req.user
        // //     req.user = result.rows;
        // //     // console.log("User Info:", req.user[0].user_id);
        // //     // Proceed to the next middleware or route handler
        // //     next();
        // // });
        dbconnect.query(
            'SELECT * FROM public.users WHERE "email" = $1',
            [email],
            (err, result) => {

                // console.log("DB ERROR:", err);
                // console.log("ROWS:", result?.rows);
                // console.log("ROW COUNT:", result?.rows?.length);

                if (err) {
                    return res.status(500).json({ msg: 'Database query failed' });
                }

                if (result.rows.length === 0) {
                    return res.status(401).json({ msg: 'User not found' });
                }

                req.user = result.rows[0];
                next();
            }
        );
    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: 'Request is not Authorized' });
    }
};

module.exports = requireAuth;
const dbconnect = require('../middleWare/Dbconnect');
const jwt = require('jsonwebtoken');

const {
    emailCheck,
    getRole,
    getPermissionroute
} = require('../auth/userService')
//login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log('Login attempt:', email, password);
        // Validate input
        if (!email || !password) {
            return res.status(401).json({ msg: 'Email and password are required' });
        }

        //01 if email exist
        const result = await emailCheck(req.body)
        // Check if user exists
        if (result.length === 0) {
            console.log(result);
            return res.status(401).json({ msg: 'Invalid email or password' });
        }

        // Get user from database
        const user = result[0];
        const users = result;
        // console.log('User found:', user);

        // Compare passwords (assuming no hashing, raw password comparison)
        if (password !== user.password) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }

        // Generate JWT token (Include id, email in object)
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET, { expiresIn: '10h' });
        const getRoleresult = await getRole(req.body)
        const getPermissionrouteResult = await getPermissionroute(req.body)
        // Respond with the token
        const Permissionroute = getPermissionrouteResult.map(item => item.route);
        const getRoleDepartment = (data) => {
        const role = [...new Set(data.map(item => item.role))];
            
        return [role]
        };

        const [role] = getRoleDepartment(getRoleresult);

        const result1 = {
            "email": email,
            Permissionroute,
            role,
            // department,
            token: token
        };

        res.status(200).json({ 
            success:true,
            data:{
                user:result1
            }
             

        });
        // console.log("getRoleandDepartmentresult", getRoleandDepartmentresult)
        // console.log("getPermissionrouteResult", getPermissionrouteResult)

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ msg: 'Error logging in' });
    }
};

module.exports ={
    login
   
}

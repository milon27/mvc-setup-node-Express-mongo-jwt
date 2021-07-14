/**
 * @design by milon27
 */
const bcryptjs = require('bcryptjs')
const UserModel = require('../../models/auth/UserModel')
const Response = require('../../models/Response')
const Define = require('../../utils/Define')
const Helper = require('../../utils/Helper')

const AuthController = {
    /**
     * @description  
     * get email, name, pass from req.body
     * do validatioin
     * ck already have an account or not(mySql Optional,Mongo required)
     * create password hash,save into database
     * generate a jwt access token,set into http cookie
     * return new user object as response
     * @param { email, name, pass} =req.body
     * @response {error(boolean), message(String), response(object:USER)}
     */
    signUp: async (req, res) => {
        try {
            const { email, name, pass } = req.body
            //validatioin
            if (!email || !name || !pass) {
                throw new Error("Enter email,name,pass")
            }
            if (pass.length < 6) {
                throw new Error("pass length should be atleast 6 char.")
            }
            //get hash pass & save new user into db
            const hashpass = await bcryptjs.hash(pass, await bcryptjs.genSalt(10))
            const user = {
                email: email.toString().trim(),
                name: name.toString().trim(),
                pass: hashpass
            }
            //create the new user.
            let newuser = new UserModel(user)
            let userDoc = await newuser.save()
            //send response
            //get token and set into cookie
            const token = Helper.getJWTtoken(email)
            //send token in http cookie with no expire
            res.cookie(Define.TOKEN, token, Define.SESSION_COOKIE_OPTION)
            delete user.pass
            userDoc['token'] = token
            res.status(200).json(new Response(false, "user created successfully", userDoc))

        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }

    },//end create user.
    login: async (req, res) => {
        try {
            const { email, pass } = req.body
            //validatioin
            if (!email || !pass) {
                throw new Error("Enter email,password")
            }
            //check user is available or not in db
            const user = await UserModel.findOne({ email: email })
            if (!user) {
                throw new Error("No User Found!,try signup first")
            }
            const ckPass = await bcryptjs.compare(pass, user.pass)
            if (!ckPass) {
                throw new Error("Wrong email or password")
            }
            //get token and set into cookie
            const token = Helper.getJWTtoken(email)
            //send token in http cookie 
            res.cookie(Define.TOKEN, token, Define.SESSION_COOKIE_OPTION)
            delete user.pass
            user['token'] = token
            res.status(200).json(new Response(false, "user logged in successfully", user))

        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },//login
    logout: (req, res) => {
        res.cookie(Define.TOKEN, "", Define.LOGOUT_COOKIE_OPTION)
        res.status(200).json(new Response(false, "user logged out", {}))
    },//logout
    isLoggedIn: (req, res) => {
        try {
            const token = req.cookies.token
            if (!token) {
                throw new Error("Unauthorized Access")
            }
            //token validation
            Helper.verifyJWTtoken(token)
            res.send(true)// logged in
        } catch (e) {
            //remove the old/expire token
            res.cookie("token", "", Define.LOGOUT_COOKIE_OPTION)
            res.send(false)//not logged in
        }
    },//isLoggedIn

}

module.exports = AuthController
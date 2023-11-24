const Jwt = require('jsonwebtoken')
const User = require("../model/UserSchema")

const authenticate = async(req, res, next) => {
    try {
        const token = req.cookies.Jwt
        const verifytoken = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifytoken)

        const rootuser = await User.findOne({ _id: verifytoken._id, "tokens.token": token })

        if (!rootuser) {
            throw new Error("user not found")
        }
        req.token = token
        req.rootuser = rootuser
        req.userId = rootuser._id
        next();

    } catch (err) {
        res.status(404)
        console.log(err)
    }

}

module.exports = authenticate;
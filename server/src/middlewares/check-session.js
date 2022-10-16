const jwt = require('jsonwebtoken')
const JWTPrivateKey = process.env.JWT_PRIVATE_KEY

function checkSession(req, res, next) {
    let { token } = req.body

    try {
        //Default algorithm: HMAC SHA256
        const payload = jwt.verify(token, JWTPrivateKey)
    } catch (err) {
        res.status(401).json({
            message: 'Please login first!',
            error: err.message,
        })
    }
}

module.exports = checkSession;
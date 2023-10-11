const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const headers = req.headers.authorization || req.headers.Authorization

    if(!headers?.startsWith('Bearer ')) return res.sendStatus(401)

    // get token from headers
    const accessToken = headers.split(' ')[1]

    // decode accessToken
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
        if(err){
            return res.status(403).json({message: "Unauthorized"})
        }
        req.user = decoded.UserInfo.username
        req.roles = decoded.UserInfo.roles
        next()
        
    })

}

module.exports = verifyJWT
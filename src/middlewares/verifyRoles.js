
const verifyRoles = (...allowedRoles) =>{
    return (req, res, next) =>{
        const rolesArray = [...allowedRoles]
        const roles = req.roles
        const result = roles.map(role => rolesArray.includes(role)).find(val => val === true)
        if(!result) return res.sendStatus(401)
        next()
    }
}

module.exports = verifyRoles
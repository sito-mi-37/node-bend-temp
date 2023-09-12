const userDb = {
    users: require('../models/users.json'),
    setUsers: function (data) {this.users = data}
}

const fsPromises = require('fs').promises
const path = require('path')

const handleLogout = async (req, res) => {
    const cookies = req.cookies

    if(!cookies?.jwt) return res.sendStatus(403)

    const refreshToken = cookies.jwt

    const foundUser = userDb.users.find(user => user.refreshToken === refreshToken)
    if(!foundUser){
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
        res.sendStatus(204)
    }

    const otherUsers = userDb.users.filter(user => user.refreshToken !== refreshToken)
    const currentUser = {...foundUser, refreshToken: ''}

    userDb.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
        path.join(__dirname, '..' , 'models', 'users.json'),
        JSON.stringify(userDb.users)
    )

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.sendStatus(204)
}


module.exports = {handleLogout}
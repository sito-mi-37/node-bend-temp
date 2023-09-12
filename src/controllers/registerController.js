const usersDb = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.users = data
    }
}

const bcrypt = require('bcrypt')
const fsPromises = require('fs').promises
const path = require('path')

const handleRegister = async (req, res) => {
    const {username, password} = req.body

    if(!username || !password) return res.status(400).json({message: "Username and password are required"})

    const duplicate = usersDb.users.find(user => user.username === username)

    if(duplicate) return res.sendStatus(409)

    try{
        const hashPwd = await bcrypt.hash(password, 10)
        const newUser = {username, password: hashPwd}
        // update the usersDb
        usersDb.setUsers([...usersDb.users, newUser])
        console.log(usersDb.users)
        await fsPromises.writeFile(path.join(__dirname, '..', 'models', 'users.json'), JSON.stringify(usersDb.users))

        return res.status(200).json({success: `New user ${username} created`})
    } catch (err) {
        res.status(500).json({message: err.message})
    }

}

module.exports = {handleRegister}
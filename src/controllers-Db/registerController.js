const User = require('../models/User')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

const handleRegister = asyncHandler( async (req, res) => {
    const {username, password} = req.body

    if(!username || !password) return res.status(400).json({message: "Username and password are required"})

    const duplicate = await User.findOne({username}).exec()

    if(duplicate) return res.sendStatus(409)

    try{
        const hashPwd = await bcrypt.hash(password, 10)
        const result = await User.create({
            username,
            password: hashPwd
        })
        console.log(result)
        
        return res.status(200).json({success: `New user ${username} created!`})
    } catch (err) {
        res.status(500).json({message: err.message})
    }

})

module.exports = {handleRegister}
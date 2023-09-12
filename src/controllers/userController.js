const User = require("../models/User")
const bcrypt = require("bcrypt")
const asyncHandler = require("express-async-handler")


//@desc get all user
//@route GET /users
//@access private
const getUsers = asyncHandler(async(req, res) => {
    const users = await User.find({}).lean().exec()

    // verify that user list is not empty
    if(!users.length)return res.status(404).json({message: "No user found"})

    // send back the list of users
    res.status(200).json(users)
})

//@desc create new user
//@route POST /users
//@access private
const createUser = asyncHandler(async(req, res) => {
    const {username, password} = req.body

    // verify all fields were provided
    if(!username || !password) return res.status(400).json({message: "Username and password are required"})

    // check for username duplication
    const duplicate = await User.findOne({username}).exec()

    if(duplicate) {
        return res.status(409).json({message: "Username taken"})
    }

    // hash password
    const hashPwd = await bcrypt.hash(password, 10) // 10 salt rounds

    const userObject = {
        username,
        password: hashPwd
    } 

    const user = await User.create(userObject)

    if(user){
        res.status(201).json({message: `New user ${username} created`})
    }else{
        res.status(400).json({message: "Invalid data provided"})
    }
})

module.exports = {
    getUsers,
    createUser
}
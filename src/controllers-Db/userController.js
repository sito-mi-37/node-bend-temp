const User = require('../models/User')
const bcrypt = require('bcrypt')


const getUsers = async (req, res) => {
    const users = await User.find().exec()

    if(!users) return res.status(204).json({message: 'No users found'})

    res.status(200).json(users)
}

const createUser = async (req, res) => {
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
        
        return res.status(201).json({success: `New user ${username} created!`})
    } catch (err) {
        res.status(500).json({message: err.message})
    }

}

const updateUser = async(req, res) => {
    const id = req.body.id
    const username = req?.body?.username
    const password = req?.body?.password
    if(!id) return res.status(400).json({message: 'ID field required'})

    const foundUser = await User.findOne({_id: id}).exec()

    if(!foundUser) return res.status(204).json({message: 'No user found'})

    if(username) foundUser.username = username
    if(password){
        const hashPwd = await bcrypt.hash(password, 10)
        foundUser.password = hashPwd
    }

    const result = await foundUser.save()
    console.log(result)

    res.json(result)
}

const deleteUser = async(req, res) => {
    const id = req.body.id
    if(!id) return res.status(400).json({message: 'ID field required'})

    const foundUser = await User.findOne({_id: id}).exec()
    if(!foundUser)return res.status(404).json({message: `No user match ID ${id}` })
    const result = await User.deleteOne({_id: id})
    res.json(result)
}

const getUser = async(req, res) => {
    const id = req.params.id
    if(!id) return res.status(404).json({message: 'ID is required'})

    const foundUser = await User.findOne({_id: id}).exec()
    if(!foundUser) return res.status(404).json({message:`No user match ID ${id}`})

    res.json(foundUser)
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser
}